// src/hooks/useInfiniteRoutes.ts
import { useEffect, useMemo, useRef, useState } from "react";
import { useLazyGetRoutesQuery } from "@/src/store/LazyHooks";
import type { RouteFilters } from "@/src/data/features/types/routeFilters";

type Options = {
  limit?: number;
  minSearchLen?: number;
  sort?: string;
  pageParamName?: string; // "page"
  limitParamName?: string; // "limit" | "per_page"
  cursorParamName?: string; // "cursor"
  offsetParamName?: string; // "offset"
  inferHasMoreFromCount?: boolean; // fallback jei nėra meta/links
};

const omitUndefined = (obj: Record<string, any>) =>
  Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined));

const dataArray = (res: any): any[] =>
  Array.isArray(res)
    ? res
    : Array.isArray(res?.data)
      ? res.data
      : Array.isArray(res?.data?.data)
        ? res.data.data
        : [];

const extractNext = (
  res: any
):
  | { mode: "cursor"; value: string }
  | { mode: "page"; value: number }
  | null => {
  // 1) cursor
  const cursor =
    res?.meta?.next_cursor ??
    res?.links?.next_cursor ??
    res?.next_cursor ??
    null;
  if (cursor) return { mode: "cursor", value: String(cursor) };

  // 2) nuoroda su query
  const nextUrl =
    res?.links?.next ??
    res?.next ??
    res?.next_page_url ??
    res?.meta?.next_page_url ??
    null;
  if (nextUrl) {
    try {
      const u = new URL(String(nextUrl));
      const c = u.searchParams.get("cursor");
      if (c) return { mode: "cursor", value: c };
      const p = u.searchParams.get("page");
      if (p) return { mode: "page", value: Number(p) };
    } catch {}
  }

  // 3) Laravel "meta"
  const curMeta = res?.meta?.current_page ?? res?.current_page;
  const lastMeta = res?.meta?.last_page ?? res?.last_page;
  if (
    curMeta != null &&
    lastMeta != null &&
    Number(curMeta) < Number(lastMeta)
  ) {
    return { mode: "page", value: Number(curMeta) + 1 };
  }

  // 4) TAVO API "pagination"
  const cur = res?.pagination?.current_page;
  const last = res?.pagination?.last_page;
  const hasNext = res?.pagination?.has_next;
  if (hasNext === true && cur != null) {
    return { mode: "page", value: Number(cur) + 1 };
  }
  if (cur != null && last != null && Number(cur) < Number(last)) {
    return { mode: "page", value: Number(cur) + 1 };
  }

  return null;
};

export function useInfiniteRoutes(applied: RouteFilters, opts: Options = {}) {
  const limit = opts.limit ?? 50;
  const minSearchLen = opts.minSearchLen ?? 3;
  const sort = opts.sort ?? "rating_desc";
  const pageKey = opts.pageParamName ?? "page";
  const limitKey = opts.limitParamName ?? "limit";
  const cursorKey = opts.cursorParamName ?? "cursor";
  const offsetKey = opts.offsetParamName ?? "offset";
  const inferFromCount = opts.inferHasMoreFromCount ?? true;

  // turim sąlygų?
  const hasOther = useMemo(() => {
    const { search, ...rest } = applied;
    return Object.values(rest).some((v) => v !== undefined);
  }, [applied]);

  const enabled =
    (applied.search?.trim().length ?? 0) >= minSearchLen || hasOther;

  // snake_case – pagal tavo backendą
  const base = useMemo(() => {
    const p: Record<string, any> = {
      country_id: applied.countryId,
      city_id: applied.cityId,
      category_id: applied.categoryId,
      difficulty: applied.difficulty, // įsitikink: "easy" | "moderate" | "hard"
      min_distance: applied.minDistance,
      max_distance: applied.maxDistance,
      min_elevation: Array.isArray(applied.elevation)
        ? applied.elevation[0]
        : undefined,
      max_elevation: Array.isArray(applied.elevation)
        ? applied.elevation[1]
        : undefined,
      min_rating: applied.minRating,
      search: applied.search?.trim(),
      [limitKey]: limit,
      sort,
    };
    return omitUndefined(p);
  }, [applied, limit, limitKey, sort]);

  // paging state
  const [mode, setMode] = useState<"cursor" | "page" | "offset" | undefined>();
  const [cursor, setCursor] = useState<string | undefined>();
  const [page, setPage] = useState<number | undefined>();
  const [offset, setOffset] = useState<number | undefined>();
  const [items, setItems] = useState<any[]>([]);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);

  const [trigger, { isFetching }] = useLazyGetRoutesQuery();

  // apsauga nuo pasenusių rezultatų
  const paramsKey = useMemo(
    () =>
      JSON.stringify({
        ...base,
        [cursorKey]: undefined,
        [pageKey]: undefined,
        [offsetKey]: undefined,
      }),
    [base, cursorKey, pageKey, offsetKey]
  );
  const latestKeyRef = useRef(paramsKey);
  useEffect(() => {
    latestKeyRef.current = paramsKey;
  }, [paramsKey]);

  const buildParams = (extra?: Record<string, any>) =>
    omitUndefined({ ...base, ...extra });

  // pirmas puslapis
  useEffect(() => {
    if (!enabled) {
      setItems([]);
      setMode(undefined);
      setCursor(undefined);
      setPage(undefined);
      setOffset(undefined);
      return;
    }

    setItems([]);
    setMode(undefined);
    setCursor(undefined);
    setPage(undefined);
    setOffset(undefined);

    // VISADA siųskim page=1 (tavo API ją palaiko)
    trigger(buildParams({ [pageKey]: 1 }), true)
      .unwrap()
      .then((res: any) => {
        if (latestKeyRef.current !== paramsKey) return;

        const arr = dataArray(res);
        setItems(arr);

        const next = extractNext(res);
        if (next?.mode === "cursor") {
          setMode("cursor");
          setCursor(next.value);
        } else if (next?.mode === "page") {
          setMode("page");
          setPage(next.value);
        } else if (inferFromCount && arr.length >= limit) {
          // jeigu nėra meta/links, bet atėjo pilnas limit – pereinam į offset
          setMode("offset");
          setOffset(arr.length);
        } else {
          setMode(undefined);
        }
      })
      .catch(() => {
        setItems([]);
        setMode(undefined);
        setCursor(undefined);
        setPage(undefined);
        setOffset(undefined);
      });
  }, [enabled, paramsKey, trigger]);

  const loadMore = () => {
    if (isFetchingNextPage) return;
    if (mode === "cursor" && !cursor) return;
    if (mode === "page" && !page) return;
    if (mode === "offset" && offset == null) return;

    setIsFetchingNextPage(true);

    const extra =
      mode === "cursor"
        ? { [cursorKey]: cursor }
        : mode === "page"
          ? { [pageKey]: page }
          : { [offsetKey]: offset };

    trigger(buildParams(extra), true)
      .unwrap()
      .then((res: any) => {
        if (latestKeyRef.current !== paramsKey) return;

        const arr = dataArray(res);
        setItems((prev) => {
          // dedupe pagal id, jei netyčia gaunam tą patį puslapį
          const seen = new Set(prev.map((x: any) => x.id));
          const toAdd = arr.filter((x: any) => !seen.has(x.id));
          return [...prev, ...toAdd];
        });

        const next = extractNext(res);
        if (next?.mode === "cursor") {
          setMode("cursor");
          setCursor(next.value);
          setPage(undefined);
          setOffset(undefined);
        } else if (next?.mode === "page") {
          setMode("page");
          setPage(next.value);
          setCursor(undefined);
          setOffset(undefined);
        } else if (mode === "offset") {
          if (arr.length >= limit) setOffset((o) => (o ?? 0) + arr.length);
          else {
            setMode(undefined);
            setOffset(undefined);
          }
        } else if (inferFromCount && arr.length >= limit) {
          setMode("offset");
          setOffset((o) => (o ?? 0) + arr.length);
        } else {
          setMode(undefined);
          setCursor(undefined);
          setPage(undefined);
          setOffset(undefined);
        }
      })
      .finally(() => setIsFetchingNextPage(false));
  };

  const reset = () => {
    setItems([]);
    setMode(undefined);
    setCursor(undefined);
    setPage(undefined);
    setOffset(undefined);
  };

  return {
    items,
    enabled,
    isLoadingFirst: isFetching && items.length === 0,
    hasNextPage: Boolean(
      (mode === "cursor" && cursor) ||
        (mode === "page" && page) ||
        (mode === "offset" && offset !== undefined)
    ),
    isFetchingNextPage,
    loadMore,
    reset,
  };
}

export default useInfiniteRoutes;

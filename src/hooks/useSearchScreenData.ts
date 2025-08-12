import { useCallback, useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import debounce from "lodash.debounce";
import { useAppDispatch, useAppSelector } from "@/src/data/hooks";
import {
  clearAllForKey,
  mergeFiltersForKey,
} from "@/src/data/features/filters/filtersSlice";
import { selectAppliedByKey } from "@/src/data/features/filters/selectors";
import type { RouteFilters } from "@/src/data/features/types/routeFilters";
import { useLazyGetRoutesQuery } from "@/src/store/LazyHooks";
import { shallowEqual } from "react-redux";

export function useSearchScreenData() {
  // ✅ Užtikrinam, kad visada turim routeKey
  const { key: rawKey } = useLocalSearchParams<{ key: string | string[] }>();

  const routeKey = Array.isArray(rawKey)
    ? rawKey.join("/")
    : rawKey || "default";

  const dispatch = useAppDispatch();

  // ✅ Filtrai iš Redux (tik APPLIED)
  const filters: RouteFilters = useAppSelector(
    (st) => selectAppliedByKey(st, routeKey),
    shallowEqual
  );

  // ✅ Vietinis search laukas
  const [localSearch, setLocalSearch] = useState(filters.search ?? "");

  useEffect(() => {
    setLocalSearch(filters.search ?? "");
  }, [filters.search]);

  // ✅ Debounce paieškai
  const onSearchChange = useCallback(
    debounce((text: string) => {
      dispatch(
        mergeFiltersForKey({
          key: routeKey,
          filters: { search: text.trim() || undefined },
        })
      );
    }, 300),
    [dispatch, routeKey]
  );

  // ✅ Enter paspaudus
  const onSearchSubmit = () => {
    const trimmed = localSearch.trim();
    dispatch(
      mergeFiltersForKey({
        key: routeKey,
        filters: { search: trimmed.length >= 3 ? trimmed : undefined },
      })
    );
  };

  // ✅ Išvalyti filtrus
  const handleClearFilters = () => {
    dispatch(clearAllForKey({ key: routeKey }));
  };

  // ✅ Patikrinam ar bent vienas filtras užpildytas
  const hasOtherFilters = Object.keys({ ...filters, search: undefined }).some(
    (k) => (filters as any)[k] !== undefined
  );
  const hasSearchOrFilters = localSearch.trim().length >= 3 || hasOtherFilters;

  // ✅ API kvietimas
  const [triggerRoutes, { data: routeRes, isFetching, isError }] =
    useLazyGetRoutesQuery();

  useEffect(() => {
    if (!hasSearchOrFilters) return;
    triggerRoutes({ ...filters, limit: 50, sort: "rating_desc" });
  }, [filters, hasSearchOrFilters, triggerRoutes]);

  return {
    routeKey,
    localSearch,
    setLocalSearch,
    onSearchChange,
    onSearchSubmit,
    handleClearFilters,
    filters,
    hasSearchOrFilters,
    isFetching,
    isError,
    routes: routeRes?.data ?? [],
  };
}

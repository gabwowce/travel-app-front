import { useCallback, useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import debounce from "lodash.debounce";
import { useAppDispatch, useAppSelector } from "@/src/data/hooks";
import {
  mergeFiltersForKey,
  clearFilters,
} from "@/src/data/features/filters/filtersSlice";
import type { RouteFilters } from "@/src/data/features/types/routeFilters";
import { useLazyGetRoutesQuery } from "@/src/hooks/LazyHooks";

export function useSearchScreenData() {
  const { key: rawKey } = useLocalSearchParams<{ key: string | string[] }>();
  const routeKey = Array.isArray(rawKey) ? rawKey.join("/") : rawKey;
  const dispatch = useAppDispatch();

  const filters: RouteFilters =
    useAppSelector(
      (st) => (st.filters as Record<string, RouteFilters | undefined>)[routeKey]
    ) ?? {};

  const [localSearch, setLocalSearch] = useState(filters.search ?? "");
  const searchTerm = filters.search ?? "";

  useEffect(() => {
    setLocalSearch(filters.search ?? "");
  }, [filters.search]);

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

  const onSearchSubmit = () => {
    const trimmed = localSearch.trim();
    dispatch(
      mergeFiltersForKey({
        key: routeKey,
        filters: {
          search: trimmed.length >= 3 ? trimmed : undefined,
        },
      })
    );
  };

  const handleClearFilters = () => {
    dispatch(clearFilters({ key: routeKey }));
  };

  const hasOtherFilters = Object.keys({ ...filters, search: undefined }).some(
    (k) => (filters as any)[k] !== undefined
  );
  const hasSearchOrFilters = searchTerm.length >= 3 || hasOtherFilters;

  const [triggerRoutes, { data: routeRes, isFetching, isError }] =
    useLazyGetRoutesQuery();

  //TODO 50 limitas tik???
  useEffect(() => {
    if (hasSearchOrFilters) {
      triggerRoutes({ ...filters, limit: 50, sort: "rating_desc" });
    }
  }, [filters]);

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

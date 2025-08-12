// src/hooks/useFiltersModalData.ts
import { useEffect, useRef } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAppDispatch, useAppSelector } from "@/src/data/hooks";
import {
  mergeFiltersDraftForKey,
  clearFiltersDraft,
  applyDraftForKey,
  clearAllForKey,
} from "@/src/data/features/filters/filtersSlice";
import {
  selectDraftByKey,
  selectAppliedByKey,
} from "@/src/data/features/filters/selectors";
import type { RouteFilters } from "@/src/data/features/types/routeFilters";
import {
  useGetCategoriesQuery,
  useGetCountriesQuery,
  useGetCitiesQuery,
} from "@/src/store/travelApi";

export function useFiltersModalData() {
  const { key: rawKey } = useLocalSearchParams<{ key: string | string[] }>();
  const routeKey = Array.isArray(rawKey)
    ? rawKey.join("/")
    : rawKey || "default";

  const dispatch = useAppDispatch();
  const router = useRouter();

  const draftFilters = useAppSelector(
    (st) => selectDraftByKey(st, routeKey) ?? {}
  );
  const appliedFilters = useAppSelector(
    (st) => selectAppliedByKey(st, routeKey) ?? {}
  );

  const { data: categoriesRes = [] } = useGetCategoriesQuery(undefined, {
    refetchOnMountOrArgChange: false,
    refetchOnFocus: false,
    refetchOnReconnect: false,
  });
  const { data: countriesRes = [] } = useGetCountriesQuery(undefined, {
    refetchOnMountOrArgChange: false,
    refetchOnFocus: false,
    refetchOnReconnect: false,
  });
  const { data: cities = [] } = useGetCitiesQuery(
    { countryId: draftFilters.countryId as number },
    {
      skip: !draftFilters.countryId,
      refetchOnMountOrArgChange: false,
      refetchOnFocus: false,
      refetchOnReconnect: false,
    }
  );
  const categories = (categoriesRes?.data ?? [])
    .filter((c): c is { id: number; name: string } => !!c?.id && !!c?.name)
    .map((c) => ({ id: c.id, name: c.name }));

  const countries = (countriesRes?.data ?? [])
    .filter((c): c is { id: number; name: string } => !!c?.id && !!c?.name)
    .map((c) => ({ id: c.id, name: c.name }));
  const formRef = useRef<any>(null);

  // useEffect(() => {
  //   dispatch(
  //     mergeFiltersDraftForKey({
  //       key: routeKey,
  //       filters: appliedFilters,
  //     })
  //   );
  // }, [routeKey]);

  const handleApply = () => {
    dispatch(applyDraftForKey({ key: routeKey }));
    router.back();
  };

  const handleResetDraft = () => {
    dispatch(clearFiltersDraft({ key: routeKey }));
  };

  const handleClearAll = () => {
    dispatch(clearAllForKey({ key: routeKey }));
  };

  const openFilters = () => {
    router.push({
      pathname: "/(app)/(tabs)/02-search/filters",
      params: { key: routeKey },
    });
  };

  return {
    routeKey,
    formRef,
    draftFilters,
    appliedFilters,
    categories,
    countries,
    cities,
    handleApply,
    handleResetDraft,
    handleClearAll,
    openFilters,
  };
}

import { useEffect, useRef, useState } from "react";
import type { FormikProps } from "formik";
import { useLocalSearchParams } from "expo-router";

import {
  useGetCategoriesQuery,
  useGetCountriesQuery,
  useGetCitiesQuery,
} from "@/src/store/travelApi";
import { useAppDispatch, useAppSelector } from "@/src/data/hooks";
import { RouteFilters } from "@/src/data/features/types/routeFilters";
import { deriveContextDefaults } from "@/src/utils/deriveContextDefaults";
import { mergeFiltersForKey } from "@/src/data/features/filters/filtersSlice";

export function useFiltersModalData() {
  const { from } = useLocalSearchParams<{ from: string }>();
  const dispatch = useAppDispatch();

  // 1. Fetch dropdowns
  const { data: categoriesRes } = useGetCategoriesQuery();
  const { data: countriesRes } = useGetCountriesQuery();

  const categories = (categoriesRes?.data ?? [])
    .filter((c): c is { id: number; name: string } => !!c?.id && !!c?.name)
    .map((c) => ({ id: c.id, name: c.name }));

  const countries = (countriesRes?.data ?? [])
    .filter((c): c is { id: number; name: string } => !!c?.id && !!c?.name)
    .map((c) => ({ id: c.id, name: c.name }));

  // 2. Context & redux filters
  const reduxFilters = useAppSelector(
    (st) => (st.filters as Record<string, RouteFilters | undefined>)[from] ?? {}
  );
  const contextDefaults = deriveContextDefaults(from);

  // 3. Merge context into redux once
  useEffect(() => {
    if (
      Object.keys(contextDefaults).length &&
      !reduxFilters.categoryId &&
      !reduxFilters.countryId &&
      !reduxFilters.cityId
    ) {
      dispatch(
        mergeFiltersForKey({ key: from, filters: contextDefaults as RouteFilters })
      );
    }
  }, []);

  // 4. Final initial values
  const initial: RouteFilters = {
    minRating: 0,
    maxDistance: 500,
    minElevation: 0,
    maxElevation: 5000,
    onlyFavorites: false,
    ...contextDefaults,
    ...reduxFilters,
  };

  // 5. Dynamic cities
  const [selectedCountryId, setSelectedCountryId] = useState<number | undefined>(
    initial.countryId
  );
  const { data: citiesRes } = useGetCitiesQuery(
    { countryId: selectedCountryId },
    { skip: !selectedCountryId }
  );

  const cities = (citiesRes?.data ?? [])
    .filter((c): c is { id: number; name: string } => !!c?.id && !!c?.name)
    .map((c) => ({ id: c.id, name: c.name }));

  const formRef = useRef<FormikProps<RouteFilters>>(null);

  return {
    from,
    formRef,
    initial,
    categories,
    countries,
    cities,
    setSelectedCountryId,
    dispatch,
  };
}

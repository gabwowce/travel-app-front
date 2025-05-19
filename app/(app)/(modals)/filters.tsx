import { Box } from "native-base";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import type { FormikProps } from "formik";

import Header from "@/src/components/Header";
import FilterForm from "@/src/components/ui/forms/FilterForm";
import CircleButton from "@/src/components/ui/btns/CircleButton";

import {
  useGetCategoriesQuery,
  useGetCountriesQuery,
  useGetCitiesQuery,
} from "@/src/store/travelApi";

import { useAppDispatch, useAppSelector } from "@/src/data/hooks";
import { RouteFilters } from "@/src/data/features/types/routeFilters";
import { mergeFiltersForKey } from "@/src/data/features/filters/filtersSlice";

/* ---------- Derive defaults from URL path ---------- */
function deriveContextDefaults(from: string | number): Partial<RouteFilters> {
  const m = String(from).match(/\/(category|country|city)\/(\d+)/);
  if (!m) return {};
  const [, type, id] = m;
  return { [`${type}Id`]: Number(id) } as Partial<RouteFilters>;
}

export default function FiltersModal() {
  const { from } = useLocalSearchParams<{ from: string }>();
  const dispatch = useAppDispatch();

  /* 1️⃣ –  fetch dropdown options */
  const { data: categoriesRes } = useGetCategoriesQuery();
  const { data: countriesRes } = useGetCountriesQuery();
const categories = (categoriesRes?.data ?? [])
  .filter(
    (c): c is { id: number; name: string } => !!c?.id && !!c?.name
  )
  .map((c) => ({ id: c.id, name: c.name }));

const countries = (countriesRes?.data ?? [])
  .filter((c): c is { id: number; name: string } => !!c?.id && !!c?.name)
  .map((c) => ({ id: c.id, name: c.name }));

  /* 2️⃣ –  current Redux filters + context defaults */
  const reduxFilters = useAppSelector(
    (st) => (st.filters as Record<string, RouteFilters | undefined>)[from] ?? {}
  );
  const contextDefaults = deriveContextDefaults(from);

  /* 3️⃣ –  if context defaults not in Redux → merge once */
  useEffect(() => {
    if (Object.keys(contextDefaults).length && !reduxFilters.categoryId && !reduxFilters.countryId && !reduxFilters.cityId) {
      dispatch(mergeFiltersForKey({ key: from, filters: contextDefaults as RouteFilters }));
    }
  }, []);

  /* 4️⃣ –  final initial values */
  const initial: RouteFilters = {
    minRating: 0,
    maxDistance: 500,
    minElevation: 0,
    maxElevation: 5000,
    onlyFavorites: false,
    ...contextDefaults,
    ...reduxFilters,
  };

  /* 5️⃣ –  dependent cities dropdown */
  const [selectedCountryId, setSelectedCountryId] = useState<number | undefined>(
    initial.countryId
  );
  const { data: citiesRes } = useGetCitiesQuery({ countryId: selectedCountryId }, { skip: !selectedCountryId });
const cities = (citiesRes?.data ?? [])
  .filter((c): c is { id: number; name: string } => !!c?.id && !!c?.name)
  .map((c) => ({ id: c.id, name: c.name }));

  /* 6️⃣ –  submit */
  const formRef = useRef<FormikProps<RouteFilters>>(null);
  const handleSubmit = (values: RouteFilters) => {
    dispatch(mergeFiltersForKey({ key: from, filters: values }));
    router.back();
  };

  return (
    <Box flex={1} bg="white">
      <Header
        title="Filters"
        onBackPress={() => router.back()}
        rightIcon={
          <CircleButton
            variant="apply"
            label="Apply"
            onPress={() => formRef.current?.handleSubmit()}
          />
        }
      />

      <FilterForm
        ref={formRef}
        initialValues={initial}
        onSubmit={handleSubmit}
        categories={categories}
        countries={countries}
        cities={cities}
        onCountryChange={setSelectedCountryId}
        routeKey={from}
      />
    </Box>
  );
}
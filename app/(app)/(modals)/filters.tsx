import { Box } from "native-base";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";

import Header         from "@/src/components/Header";
import FilterForm     from "@/src/components/ui/forms/FilterForm";
import { RouteFilters } from "@/src/components/ui/forms/FilterForm";

import {
  useGetCategoriesQuery,
  useGetCountriesQuery,
  useGetCitiesQuery,
} from "@/src/store/travelApi";
import { getFiltersForKey, mergeFiltersForKey } from "@/src/utils/searchParamsStore";

/* ---------- defaultai iš URL ---------- */
function deriveContextDefaults(from: string | number): Partial<RouteFilters> {
  const raw = String(from);
  const m   = raw.match(/\/(category|country|city)\/(\d+)/);
  if (!m) return {};
  const [, type, id] = m;
  return { [`${type}Id`]: Number(id) } as Partial<RouteFilters>;
}

export default function FiltersModal() {
  /* 1. Kurį puslapį filtruojam? */
  const { from } = useLocalSearchParams<{ from: string }>();

  /* 2. Pradiniai filtrai */
  const contextDefaults = deriveContextDefaults(from);
  const initial: RouteFilters = {
    minRating: 0,
    maxDistance: 500,
    minElevation: 0,
    maxElevation: 5000,
    onlyFavorites: false,
    ...contextDefaults,
    ...getFiltersForKey(from),           // 👈 Visi ankstesni pasirinkimai
  ...deriveContextDefaults(from),      // (jei ateita iš Home su kategorija)
  };

  /* 3. Pagrindiniai dropdown duomenys */
  const { data: categoriesRes } = useGetCategoriesQuery();
  const { data: countriesRes  } = useGetCountriesQuery();

  const categories = (categoriesRes?.data ?? []).map((c) => ({
    id: c.id as number,
    name: c.name as string,
  }));

  const countries = (countriesRes?.data ?? []).map((c) => ({
    id: c.id as number,
    name: c.name as string,
  }));

  /* 4. Dinamiški miestai */
  const [selectedCountryId, setSelectedCountryId] = useState<number | undefined>(
    initial.countryId
  );

  const { data: citiesRes } = useGetCitiesQuery(
    { countryId: selectedCountryId },
    { skip: !selectedCountryId }
  );

  const cities = (citiesRes?.data ?? []).map((c) => ({
    id: c.id as number,
    name: c.name as string,
  }));

  /* 5. Submit – atidarom naują Results ekraną */
const handleSubmit = (values: RouteFilters) => {
  mergeFiltersForKey(from, values);          // ➊ įrašom į store
  router.setParams?.({ filters: "updated" }); // ➋ kad Results re-render’intų
  router.back();                              // ➌ modalas užsidaro
};


  return (
    <Box flex={1} bg="white">
      <Header title="Filters" onBackPress={() => router.back()} />
      <FilterForm
        initialValues={initial}
        onSubmit={handleSubmit}
        categories={categories}
        countries={countries}
        cities={cities}                 /* ← jau filtruotas sąrašas */
        onCountryChange={setSelectedCountryId}
      />
    </Box>
  );
}

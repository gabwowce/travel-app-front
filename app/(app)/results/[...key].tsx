import React, { useEffect, useMemo, useRef, useState } from "react";
import { router, useLocalSearchParams, useFocusEffect } from "expo-router";
import {
  Box, Spinner, HStack, Pressable, Text,
  FlatList, Wrap, Button
} from "native-base";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

import Header      from "@/src/components/Header";
import FilterButton from "@/src/components/ui/btns/FilterButton";
import MiniTourCard from "@/src/components/MiniTourCard";
import { Background } from "@/src/components/BGWrapper";
import {
  useLazyGetRoutesQuery,
  useGetCategoriesQuery,
  useGetCountriesQuery,
  useGetCitiesQuery,
} from "@/src/store/travelApi";
import {
  getFiltersForKey,
  mergeFiltersForKey,
  setFiltersForKey,
} from "@/src/utils/searchParamsStore";

/* ---------- Pagalbininkas ---------- */
const clean = <T extends Record<string, any>>(o: T) =>
  Object.fromEntries(Object.entries(o).filter(([, v]) => v != null));

export default function ResultsScreen() {
  /* 1. URL params */
  const { key: rawKey, filters: filtersParam } = useLocalSearchParams<{
  key: string | string[];        // ← catch-all gali būti masyvas
  filters?: string;
}>();


 const routeKey = Array.isArray(rawKey) ? rawKey.join("/") : rawKey;

  /* 2. Jei atėjo švieži filtrai – įrašom į store (vieną kartą) */
  useEffect(() => {
    if (filtersParam) {
      try {
        const parsed = JSON.parse(filtersParam);
        mergeFiltersForKey(routeKey, parsed);
        // nuimam filters iš URL, kad nenusidubliuotų back navigation
        router.setParams({ filters: undefined });
      } catch (_) {
        /* ignore JSON errors */
      }
    }
  }, [filtersParam]);

  /* 3. Filtrų rinkinys */
  const filters    = getFiltersForKey(routeKey) ?? {};
  const defaults =
    routeKey.match(/category\/(\d+)/) ? { categoryId: Number(RegExp.$1) } : {};
  // const filters  = { ...defaults, ...saved };

  /* 4. Pagalbiniai pavadinimai dropdown chip’ams */
  const { data: catsRes      } = useGetCategoriesQuery(undefined, { skip: !filters.categoryId });
  const { data: countriesRes } = useGetCountriesQuery(undefined, { skip: !filters.countryId });
  const { data: citiesRes    } = useGetCitiesQuery({},           { skip: !filters.cityId });

  const catName     = useMemo(() => catsRes?.data?.find(c => c.id === filters.categoryId)?.name,     [catsRes, filters.categoryId]);
  const countryName = useMemo(() => countriesRes?.data?.find(c => c.id === filters.countryId)?.name, [countriesRes, filters.countryId]);
  const cityName    = useMemo(() => citiesRes?.data?.find(c => c.id === filters.cityId)?.name,       [citiesRes, filters.cityId]);

  /* 5. Routes su “load more” */
  const PAGE_SIZE = 10;
  const [page, setPage]     = useState(1);
  const [allRoutes, setAll] = useState<any[]>([]);
  const [trigger, result]   = useLazyGetRoutesQuery();
  const { data, isFetching, isError } = result;

  /* pirmas užkrovimas & page / filters pasikeitimai */
  useEffect(() => {
    trigger(clean({ ...filters, limit: PAGE_SIZE, page, sort: "rating_desc" }));
  }, [page, JSON.stringify(filters)]);

/* 3.  Kai gaunam setParams({filters:"updated"}) → reload’inam */
useFocusEffect(
  React.useCallback(() => {
    setPage(1);
    setAll([]);
  }, [JSON.stringify(filters)])
);
  useEffect(() => {
    if (data?.data) {
      setAll((prev) => (page === 1 ? data.data : [...prev, ...data.data]));
    }
  }, [data]);

  const canLoadMore = (data?.data?.length ?? 0) === PAGE_SIZE;

  /* 6. Chips */
  const chips: string[] = [];
  if (catName)         chips.push(`Category: ${catName}`);       else if (filters.categoryId)  chips.push(`Category #${filters.categoryId}`);
  if (countryName)     chips.push(`Country: ${countryName}`);    else if (filters.countryId)   chips.push(`Country #${filters.countryId}`);
  if (cityName)        chips.push(`City: ${cityName}`);          else if (filters.cityId)      chips.push(`City #${filters.cityId}`);
  if (filters.minRating)   chips.push(`Rating ≥ ${filters.minRating}`);
  if (filters.maxDistance) chips.push(`≤ ${filters.maxDistance} km`);
  if (filters.search)      chips.push(`“${filters.search}”`);

  /* 7. UI */
  return (
    <Background>
      <Header
        title="Tours"
        onBackPress={() => router.back()}
        rightIcon={<FilterButton routeKey={routeKey} />}
      />

      {/* Chips */}
      <Wrap
        px={wp("3%")}
        mt={2}
        direction="row"
      >
        {chips.length === 0 ? (
          <Text color="gray.500">No filters applied</Text>
        ) : (
          chips.map((c, i) => (
            <Pressable
              key={i}
              px={3}
              py={1}
              bg="primary.100"
              borderRadius="full"
              maxW={wp("70%")}
            >
              <Text fontSize="xs" color="primary.800" isTruncated>
                {c}
              </Text>
            </Pressable>
          ))
        )}
      </Wrap>

      {/* List */}
      {isFetching && page === 1 ? (
        <Box flex={1} alignItems="center" justifyContent="center"><Spinner size="lg" /></Box>
      ) : isError ? (
        <Box flex={1} alignItems="center" justifyContent="center"><Text color="red.500">Failed to load routes.</Text></Box>
      ) : allRoutes.length === 0 ? (
        <Box flex={1} alignItems="center" justifyContent="center"><Text>No tours found.</Text></Box>
      ) : (
        <FlatList
          data={allRoutes}
          numColumns={2}
          keyExtractor={(item) => String(item.id)}
          columnWrapperStyle={{ justifyContent: "space-between", gap: wp("1%") }}
          contentContainerStyle={{ gap: wp("1%"), padding: wp("3%"), paddingBottom: wp("12%") }}
          renderItem={({ item }) => <MiniTourCard tour={item} />}
          ListFooterComponent={
            canLoadMore ? (
              <Box alignItems="center" my={4}>
                <Button
                  onPress={() => setPage((p) => p + 1)}
                  isLoading={isFetching && page > 1}
                  _text={{ fontWeight: "bold" }}
                >
                  Show more
                </Button>
              </Box>
            ) : null
          }
        />
      )}
    </Background>
  );
}

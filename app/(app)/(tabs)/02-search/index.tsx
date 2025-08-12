// app/(app)/(tabs)/02-search/index.tsx
import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { TouchableWithoutFeedback, Keyboard, View } from "react-native";
import { Text, VStack } from "native-base";
import { useNavigation } from "expo-router";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { shallowEqual } from "react-redux";

import FlexContainer from "@/src/components/layout/FlexContainer";
import SearchBar from "@/src/components/SearchBar";
import Spinner from "@/src/components/ui/Spinner";
import FilterCircleButton from "@/src/components/ui/btns/FilterButton";
import ResponsiveTourList from "@/src/components/tour/ResponsiveTourList";
import FilterChips from "@/src/components/ui/FilterChips";

import { useAppDispatch, useAppSelector } from "@/src/data/hooks";
import {
  clearAllForKey,
  mergeFiltersForKey,
} from "@/src/data/features/filters/filtersSlice";
import { selectAppliedByKey } from "@/src/data/features/filters/selectors";
import { useGetRoutesQuery } from "@/src/store/travelApi";
import type { RouteFilters } from "@/src/data/features/types/routeFilters";
import { skipToken } from "@reduxjs/toolkit/query";

const ROUTE_KEY = "search";

// padeda nesiųsti undefined laukų
const clean = <T extends object>(obj: T): Partial<T> =>
  Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined)
  ) as Partial<T>;

export default function SearchScreen() {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  // Remove destructuring and call useFiltersForm only if you have a formik object to pass as the second argument.
  // If you don't need updateField here, just remove this block:
  // const { updateField } = useFiltersForm(ROUTE_KEY);

  // 1) Applied filtrai (tik jie valdo API)
  const appliedFilters = useAppSelector(
    (st) => selectAppliedByKey(st, ROUTE_KEY),
    shallowEqual
  ) as RouteFilters;

  // 2) Vietinis įvestas tekstas; sinchronizuojamės kai keičiasi applied.search
  const [localSearch, setLocalSearch] = useState(appliedFilters.search ?? "");
  useEffect(() => {
    setLocalSearch(appliedFilters.search ?? "");
  }, [appliedFilters.search]);

  // 3) Apskaičiuojam ar yra ką rodyti (>=3 raidės arba bent vienas kitas filtras)
  const hasOtherFilters = useMemo(() => {
    const { search, ...rest } = appliedFilters;
    return Object.values(rest).some((v) => v !== undefined);
  }, [appliedFilters]);

  const hasSearchOrFilters =
    (appliedFilters.search?.trim().length ?? 0) >= 3 || hasOtherFilters;

  // 4) Paruošiam paramus API (tik užpildyti) + map'inam laukus kaip backend tikisi
  const queryParams = useMemo(() => {
    const params: Record<string, any> = {
      countryId: appliedFilters.countryId,
      cityId: appliedFilters.cityId,
      categoryId: appliedFilters.categoryId,
      difficulty: appliedFilters.difficulty,
      maxDistance: appliedFilters.maxDistance,
      search: appliedFilters.search?.trim(),
      limit: 50,
      sort: "rating_desc",
    };

    console.log("Query params:", params);

    // elevation tuple [min, max] -> min_elevation / max_elevation
    if (Array.isArray(appliedFilters.elevation)) {
      params.min_elevation = appliedFilters.elevation[0];
      params.max_elevation = appliedFilters.elevation[1];
    }

    // jeigu turi minimalų įvertinimą
    if (appliedFilters.minRating !== undefined) {
      params.min_rating = appliedFilters.minRating;
    }

    return clean(params);
  }, [appliedFilters]);

  // 5) RTK Query – kviečiam tik jei yra bent vienas filtras arba >=3 raidžių paieška
  const args = hasSearchOrFilters ? queryParams : skipToken;

  const { data, isFetching, isError } = useGetRoutesQuery(args, {
    // papildomai gali išjungti “refetch on focus”, jei nereikia:
    refetchOnFocus: false,
    refetchOnReconnect: false,
  });
  // jeigu pasikeitė APPLIED – pasirefreskinam
  // useEffect(() => {
  //   if (hasSearchOrFilters) refetch();
  // }, [hasSearchOrFilters, queryParams, refetch]);

  // 6) Header mygtukas (filtrai)
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <FilterCircleButton routeKey={ROUTE_KEY} />,
    });
  }, [navigation]);

  // 7) Paieškos submit – į APPLIED
  const onSearchSubmit = () => {
    const trimmed = localSearch.trim();
    dispatch(
      mergeFiltersForKey({
        key: ROUTE_KEY,
        filters: {
          search: trimmed.length >= 3 ? trimmed : undefined,
        },
      })
    );
  };

  // 8) „Clear filters“
  const handleClearSearch = () => {
    setLocalSearch("");
    // svarbu: siųsti `undefined`, kad parametras išnyktų iš applied filtrų
    dispatch(
      mergeFiltersForKey({
        key: ROUTE_KEY,
        filters: { search: undefined },
      })
    );
  };

  // (pasirinktinai) visų filtrų išvalymas, jei kažkur kitur reikia „Clear all“
  const handleClearAll = () => {
    setLocalSearch("");
    dispatch(clearAllForKey({ key: ROUTE_KEY }));
  };
  function handleSetLocalSearch(text: string) {
    setLocalSearch(text);
    dispatch(
      mergeFiltersForKey({
        key: ROUTE_KEY,
        filters: {
          search: text,
        },
      })
    );
  }
  // 9) Routes iš atsakymo
  const routes = data?.data ?? [];

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <FlexContainer>
        <View style={{ marginHorizontal: wp("3%") }}>
          <SearchBar
            placeholder="Search Tours"
            accessibilityLabel="Search tours input"
            value={localSearch}
            onChangeText={handleSetLocalSearch}
            onClear={handleClearSearch}
            onEndEditing={onSearchSubmit}
          />
        </View>

        <VStack pt={0} px={4}>
          <FilterChips filters={appliedFilters} onClear={handleClearAll} />
        </VStack>

        {hasSearchOrFilters ? (
          <>
            {isFetching ? (
              <Spinner />
            ) : isError ? (
              <Text
                mt={8}
                color="red.500"
                textAlign="center"
                accessibilityRole="alert"
              >
                Failed to load routes
              </Text>
            ) : routes.length === 0 ? (
              <Text mt={8} color="gray.500" textAlign="center">
                No results found.
              </Text>
            ) : (
              <ResponsiveTourList
                data={routes}
                isFetching={isFetching}
                filters={appliedFilters}
              />
            )}
          </>
        ) : (
          <Text textAlign="center" mt={4} color="gray.400" px={6}>
            Type at least 3 letters or apply filters to start searching…
          </Text>
        )}
      </FlexContainer>
    </TouchableWithoutFeedback>
  );
}
/* updateField is not used in this file anymore, so this stub can be removed */

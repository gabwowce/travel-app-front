// app/(app)/(tabs)/02-search/index.tsx
import React, { useEffect, useLayoutEffect, useState } from "react";
import { TouchableWithoutFeedback, Keyboard, View } from "react-native";
import { Text } from "native-base";
import { useNavigation } from "expo-router";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { shallowEqual } from "react-redux";

import FlexContainer from "@/src/components/layout/FlexContainer";
import SearchBar from "@/src/components/SearchBar";
import Spinner from "@/src/components/ui/Spinner";
import FilterCircleButton from "@/src/components/ui/btns/FilterButton";
import ResponsiveTourList from "@/src/components/tour/ResponsiveTourList";

import { useAppDispatch, useAppSelector } from "@/src/data/hooks";
import {
  clearAllForKey,
  mergeFiltersForKey,
} from "@/src/data/features/filters/filtersSlice";
import { selectAppliedByKey } from "@/src/data/features/filters/selectors";
import type { RouteFilters } from "@/src/data/features/types/routeFilters";

import useInfiniteRoutes from "@/src/hooks/useInfiniteRoutes";
import {
  ROUTE_FILTER_LIMITS,
  ROUTE_KEY,
} from "@/src/config/initialRouterFilters";

export default function SearchScreen() {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  // APPLIED filtrai (valdo API)
  const appliedFilters = useAppSelector(
    (st) => selectAppliedByKey(st, ROUTE_KEY),
    shallowEqual
  ) as RouteFilters;

  // Vietinis paieškos tekstas; atsinaujina pasikeitus applied.search
  const [localSearch, setLocalSearch] = useState(appliedFilters.search ?? "");
  useEffect(() => {
    setLocalSearch(appliedFilters.search ?? "");
  }, [appliedFilters.search]);

  // Hook’as, kuris valdo visą „infinite“ krovimą
  const {
    items,
    enabled,
    isLoadingFirst,
    hasNextPage,
    isFetchingNextPage,
    loadMore,
    reset,
  } = useInfiniteRoutes(appliedFilters, {
    limit: ROUTE_FILTER_LIMITS,
    minSearchLen: 3,
    sort: "rating_desc",
  });

  // Header filtrų mygtukas
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <FilterCircleButton routeKey={ROUTE_KEY} />,
    });
  }, [navigation]);

  // Paieškos submit — į APPLIED (ne refetch po kiekvienos raidės)
  const onSearchSubmit = () => {
    const trimmed = localSearch.trim();
    dispatch(
      mergeFiltersForKey({
        key: ROUTE_KEY,
        filters: { search: trimmed.length >= 3 ? trimmed : undefined },
      })
    );
  };

  const handleClearSearch = () => {
    setLocalSearch("");
    dispatch(
      mergeFiltersForKey({
        key: ROUTE_KEY,
        filters: { search: undefined },
      })
    );
  };

  const handleClearAll = () => {
    setLocalSearch("");
    reset(); // pilnas lokalaus sąrašo reset
    dispatch(clearAllForKey({ key: ROUTE_KEY }));
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <FlexContainer>
        <View style={{ marginHorizontal: wp("3%") }}>
          <SearchBar
            placeholder="Search Tours"
            accessibilityLabel="Search tours input"
            value={localSearch}
            onChangeText={setLocalSearch} // tik local state
            onClear={handleClearSearch}
            onEndEditing={onSearchSubmit}
          />
        </View>

        {enabled ? (
          isLoadingFirst ? (
            <Spinner />
          ) : (
            <ResponsiveTourList
              data={items}
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
              onEndReached={loadMore}
              filters={appliedFilters}
              onClearAll={handleClearAll}
            />
          )
        ) : (
          <Text textAlign="center" mt={4} color="gray.400" px={6}>
            Type at least 3 letters or apply filters to start searching…
          </Text>
        )}
      </FlexContainer>
    </TouchableWithoutFeedback>
  );
}

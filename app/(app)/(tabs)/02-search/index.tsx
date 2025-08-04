import React, {useLayoutEffect} from "react";
import { Text } from "native-base";
import { TouchableWithoutFeedback, Keyboard } from "react-native";
import { useRouter, useNavigation } from "expo-router";

import Spinner from "@/src/components/ui/Spinner";
import Header from "@/src/components/Header";
import SearchBar from "@/src/components/SearchBar";
import FlexContainer from "@/src/components/layout/FlexContainer";
import FilterCircleButton from "@/src/components/ui/btns/FilterButton";
import ResponsiveTourList from "@/src/components/tour/ResponsiveTourList";
import {
  clearFilters,
  mergeFiltersForKey,
} from "@/src/data/features/filters/filtersSlice";
import useAnnounceForAccessibility from "@/src/hooks/useAnnounceForAccessibility";
import { useSearchScreenData } from "@/src/hooks/useSearchScreenData";
import { useAppDispatch } from "@/src/data/hooks";

export default function SearchScreen() {
  useAnnounceForAccessibility("Search screen opened. Enter a keyword to begin searching tours.");
  const router = useRouter();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const {
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
    routes,
  } = useSearchScreenData();

 useLayoutEffect(() => {
  navigation.setOptions({
    headerRight: () => (
      <FilterCircleButton routeKey={routeKey} />
    )
  });
}, [navigation, routeKey]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <FlexContainer>
        {/* <Header
          title="Search"
          rightIcon={<FilterCircleButton routeKey={routeKey} />}
        /> */}

        <SearchBar
          placeholder="Search Tours"
          accessibilityLabel="Search tours input"
          value={localSearch}
          onChangeText={(t) => {
            setLocalSearch(t);
            onSearchChange(t);
          }}
          onClear={() => {
            setLocalSearch("");
            dispatch(
              mergeFiltersForKey({
                key: routeKey,
                filters: { search: undefined },
              })
            );
          }}
          onEndEditing={onSearchSubmit}
        />

        {hasSearchOrFilters ? (
          <>
            {isFetching ? (
              <Spinner mt={8} />
            ) : isError ? (
              <Text mt={8} color="red.500" textAlign="center" accessibilityLiveRegion="assertive"
  accessibilityRole="alert">
                Failed to load routes
              </Text>
            ) : routes.length === 0 ? (
              <Text mt={8} color="gray.500" textAlign="center"  accessibilityLiveRegion="polite"
  accessibilityRole="status">
                No results found.
              </Text>
            ) : (
              <ResponsiveTourList
                data={routes}
                isFetching={isFetching}
                filters={filters}
                onClearFilters={handleClearFilters}
              />
            )}
          </>
        ) : (
          <Text textAlign="center" mt={10} color="gray.400" px={6} accessibilityLiveRegion="polite"
  accessibilityRole="status">
            Type at least 3 letters or apply filters to start searching…
          </Text>
        )}
      </FlexContainer>
    </TouchableWithoutFeedback>
  );
}

import React, { useMemo, useCallback, useState, useEffect } from "react";
import {
  Box,
  Text,
  VStack,
} from "native-base";
import { TouchableWithoutFeedback, Keyboard } from "react-native";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { useLocalSearchParams, useRouter } from "expo-router";
import debounce from "lodash.debounce";
import { FlashList } from "@shopify/flash-list";
import Spinner from "@/src/components/ui/Spinner";
import Header from "@/src/components/Header";
import SearchBar from "@/src/components/SearchBar";
import MiniTourCard from "@/src/components/MiniTourCard";
import FlexContainer from "@/src/components/layout/FlexContainer";
import FilterCircleButton from "@/src/components/ui/btns/FilterButton";
import FilterChips from "@/src/components/ui/FilterChips";

import {
  useLazyGetRoutesQuery,
} from "@/src/store/travelApi";

import { useAppDispatch, useAppSelector } from "@/src/data/hooks";
import { RouteFilters } from "@/src/data/features/types/routeFilters";
import {
  clearFilters,
  mergeFiltersForKey,
} from "@/src/data/features/filters/filtersSlice";
import ResponsiveTourList from "@/src/components/tour/ResponsiveTourList";

export default function SearchScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { key: rawKey } = useLocalSearchParams<{ key: string | string[] }>();
  const routeKey = Array.isArray(rawKey) ? rawKey.join("/") : rawKey;

  const filters: RouteFilters =
    useAppSelector(
      (st) => (st.filters as Record<string, RouteFilters | undefined>)[routeKey]
    ) ?? {};

  const [localSearch, setLocalSearch] = useState(filters.search ?? "");
  useEffect(() => {
    setLocalSearch(filters.search ?? "");
  }, [filters.search]);

  const searchTerm = filters.search ?? "";

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

  const onSearchChange = useCallback(
    debounce((t: string) => {
      dispatch(
        mergeFiltersForKey({
          key: routeKey,
          filters: { search: t.trim() || undefined },
        })
      );
    }, 300),
    [dispatch, routeKey]
  );

  const hasOtherFilters = Object.keys({ ...filters, search: undefined }).some(
    (k) => (filters as any)[k] !== undefined
  );
  const hasSearchOrFilters = searchTerm.length >= 3 || hasOtherFilters;

  const handleClearFilters = () => {
    dispatch(clearFilters({ key: routeKey }));
  };

  const [
    triggerRoutes,
    { data: routeRes, isFetching, isError },
  ] = useLazyGetRoutesQuery();

  const routes = routeRes?.data ?? [];

  useEffect(() => {
    if (hasSearchOrFilters) {
      triggerRoutes({ ...filters, limit: 50, sort: "rating_desc" });
    }
  }, [filters]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <FlexContainer>
        <Header
          title="Search"
          onBackPress={() => router.back()}
          rightIcon={<FilterCircleButton routeKey={routeKey} />}
        />

      <SearchBar
            placeholder="Search Tours"
            value={localSearch}
            onChangeText={(t) => {
              setLocalSearch(t);
              onSearchChange(t);
            }}
            onClear={() => {
              setLocalSearch("");
              dispatch(mergeFiltersForKey({ key: routeKey, filters: { search: undefined } }));
            }}
            onEndEditing={onSearchSubmit}
          />

        {hasSearchOrFilters ? (
          <>


            {isFetching ? (
              <Spinner mt={8} />
            ) : isError ? (
              <Text mt={8} color="red.500" textAlign="center">
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
        
  
                    filters={filters}
                    onClearFilters={() => dispatch(clearFilters({ key: routeKey }))}
                  />
            )}
          </>
        ) : (
          <Text textAlign="center" mt={10} color="gray.400" px={6}>
            Type at least 3 letters or apply filters to start searching…
          </Text>
        )}
      </FlexContainer>
    </TouchableWithoutFeedback>
  );
}

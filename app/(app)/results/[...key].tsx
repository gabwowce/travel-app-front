import React, { useMemo } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { Box, HStack, SimpleGrid, Spinner, Text, VStack } from "native-base";
import { FlashList } from "@shopify/flash-list";
import Header from "@/src/components/Header";
import FilterCircleButton from "@/src/components/ui/btns/FilterButton";
import MiniTourCard from "@/src/components/MiniTourCard";
import FlexContainer from "@/src/components/layout/FlexContainer";
import { useRoutesInfinite } from "@/src/hooks/useRoutesInfinite";
import { useAppDispatch, useAppSelector } from "@/src/data/hooks";
import FilterChips from "@/src/components/ui/FilterChips";
import { clearFilters } from "@/src/data/features/filters/filtersSlice";
import ResponsiveTourList from "@/src/components/tour/ResponsiveTourList";

export default function ResultsScreen() {
  /* params & filters */
  const { key: rawKey } = useLocalSearchParams<{ key: string | string[] }>();
  const routeKey = Array.isArray(rawKey) ? rawKey.join("/") : rawKey;
  const filters  = useAppSelector(st => (st.filters as any)[routeKey] ?? {});
  const token    = useAppSelector(st => st.auth?.token) as string | undefined;

  /* TanStack Query infinite */
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useRoutesInfinite(
    {
      category_id: filters.categoryId,
      city_id:     filters.cityId,
      country_id:  filters.countryId,
      search:      filters.search,
    },
    token
  );

  const routes = useMemo(
    () => data?.pages.flatMap(p => p.data) ?? [],
    [data?.pages]
  );

  const dispatch = useAppDispatch();

  /* UI states */
  if (isLoading) return (
    <FlexContainer><Header title="Tours" onBackPress={router.back} /><Spinner mt={10}/></FlexContainer>
  );
  if (error) return (
    <FlexContainer><Header title="Tours" onBackPress={router.back}/>
      <Text color="red.500" mt={10} textAlign="center">Failed to load tours</Text>
    </FlexContainer>
  );

  /* Normal render */
  return (
    <FlexContainer >
      <Header
        title="Tours"
        onBackPress={() => {
          dispatch(clearFilters({ key: routeKey }));
          router.back();
        }}
        rightIcon={<FilterCircleButton routeKey={routeKey}/>}
      />
      
    <ResponsiveTourList
      data={routes}
      isFetching={isFetchingNextPage}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      onEndReached={fetchNextPage}
      filters={filters}
      onClearFilters={() => dispatch(clearFilters({ key: routeKey }))}
    />
    


    </FlexContainer>
  );
}

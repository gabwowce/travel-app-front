import Header from "@/src/components/Header";
import FlexContainer from "@/src/components/layout/FlexContainer";
import ResponsiveTourList from "@/src/components/tour/ResponsiveTourList";
import Spinner from "@/src/components/ui/Spinner";
import FilterCircleButton from "@/src/components/ui/btns/FilterButton";
import { clearAllForKey } from "@/src/data/features/filters/filtersSlice";
import { useAppDispatch, useAppSelector } from "@/src/data/hooks";
import useAnnounceForAccessibility from "@/src/hooks/useAnnounceForAccessibility";
import { useRoutesInfinite } from "@/src/hooks/useRoutesInfinite";
import { router, useLocalSearchParams } from "expo-router";
import { Text } from "native-base";
import React, { useMemo } from "react";

export default function ResultsScreen() {
  useAnnounceForAccessibility("Tour screen opened");
  /* params & filters */
  const { key: rawKey } = useLocalSearchParams<{ key: string | string[] }>();
  const routeKey = Array.isArray(rawKey) ? rawKey.join("/") : rawKey;
  const filters = useAppSelector(
    (st) => st.filters.applied?.[routeKey ?? ""] ?? {}
  );
  const token = useAppSelector((st) => st.auth?.token) as string | undefined;

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
      city_id: filters.cityId,
      country_id: filters.countryId,
      search: filters.search,
    },
    token
  );

  const routes = useMemo(
    () => data?.pages.flatMap((p) => p.data) ?? [],
    [data?.pages]
  );

  const dispatch = useAppDispatch();

  /* UI states */
  if (isLoading)
    return (
      <FlexContainer>
        <Header title="Tours" onBackPress={router.back} />
        <Spinner />
      </FlexContainer>
    );
  if (error)
    return (
      <FlexContainer>
        <Header title="Tours" onBackPress={router.back} />
        <Text
          accessibilityLiveRegion="assertive"
          accessibilityRole="alert"
          color="red.500"
          mt={10}
          textAlign="center"
        >
          Failed to load tours
        </Text>
      </FlexContainer>
    );

  /* Normal render */
  return (
    <FlexContainer>
      <Header
        title="Tours"
        onBackPress={() => {
          dispatch(clearAllForKey({ key: routeKey })); // išvalo draft + applied tam raktui
          router.back();
        }}
        rightIcon={<FilterCircleButton routeKey={routeKey} />}
      />

      <ResponsiveTourList
        data={routes}
        isFetching={isFetchingNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        onEndReached={fetchNextPage}
        filters={filters}
        onClearAll={() =>
          routeKey && dispatch(clearAllForKey({ key: routeKey }))
        }
      />
    </FlexContainer>
  );
}

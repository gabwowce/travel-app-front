import React from "react";
import { router, useLocalSearchParams, useSegments } from "expo-router";
import {
  Box,
  Heading,
  ScrollView,
  Spinner,
  Text,
} from "native-base";
import { FlatList } from "react-native";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { Background } from "@/src/components/BGWrapper";
import Header from "@/src/components/Header";
import MiniTourCard from "@/src/components/MiniTourCard";
import FilterButton from "@/src/components/ui/btns/FilterButton";
import { useGetRoutesQuery } from "@/src/store/travelApi";
import { useSearchParams } from "@/src/hooks/useFilters";

export default function CategoryScreen() {
  /* ---------- Params ---------- */
  const { id, slug } = useLocalSearchParams<{ id?: string; slug?: string }>();
  const catId = id ? Number(id) : undefined;
  const segments = useSegments();

  /* ---------- routeKey (unique per-page) ---------- */
  const routeKey = `(app)/category/${id ?? slug ?? "unknown"}`;
  const { getFilters } = useSearchParams(routeKey);
  const filters = getFilters() ?? {};

  /* ---------- API args ---------- */
  const apiArgs = {
    categoryId: catId,
    countryId: filters.countryId,
    cityId: filters.cityId,
    difficulty: filters.difficulty,
    minRating: filters.minRating,
    minDistance: filters.minDistance,
    maxDistance: filters.maxDistance,
    minElevation: filters.minElevation,
    maxElevation: filters.maxElevation,
    onlyFavorites: filters.onlyFavorites,
    search: filters.search,
    limit: 200,
    sort: "rating_desc" as const,
  };

  /* ---------- Routes query ---------- */
  const {
    data: routesRes,
    isLoading: loadingRoutes,
    isError,
  } = useGetRoutesQuery(apiArgs, { skip: !catId && !slug });

  const routes = routesRes?.data ?? [];

  /* ---------- UI ---------- */
  return (
    <Background>
      <Header
        title={slug ?? routesRes?.data?.[0]?.category_name ?? "Category"}
        onBackPress={() => router.back()}
        rightIcon={<FilterButton routeKey={routeKey} />}
      />

      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: wp("5%") }}
      >
        <Box flex={1} pt={wp("5%")}>
          {loadingRoutes && (
            <Box alignItems="center" py="20px">
              <Spinner size="lg" />
            </Box>
          )}

          {!loadingRoutes && isError && (
            <Text color="red.500" px={wp("3%")}>Failed to load tours. Please try again.</Text>
          )}

          {!loadingRoutes && !isError && (
            <>
              <Heading size="md" mb={3} px={wp("3%")}>Tours</Heading>

              {routes.length === 0 ? (
                <Text px={wp("3%")}>No tours found with current filters.</Text>
              ) : (
                <FlatList
                  data={routes}
                  numColumns={2}
                  keyExtractor={(item) => String(item.id)}
                  columnWrapperStyle={{ justifyContent: "space-between", gap: wp("1%") }}
                  contentContainerStyle={{ gap: wp("1%"), marginHorizontal: wp("3%") }}
                  renderItem={({ item }) => <MiniTourCard tour={item} />}
                  scrollEnabled={false}
                />
              )}
            </>
          )}
        </Box>
      </ScrollView>
    </Background>
  );
}
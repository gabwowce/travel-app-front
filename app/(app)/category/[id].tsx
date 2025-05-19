import React from "react";
import { router, useLocalSearchParams, useSegments } from "expo-router";
import {
  Box,
  Heading,
  Spinner,
  Text,
  VStack,
  FlatList,
} from "native-base";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { Background } from "@/src/components/BGWrapper";
import Header from "@/src/components/Header";
import MiniTourCard from "@/src/components/MiniTourCard";
import CircleButton from "@/src/components/ui/btns/CircleButton";
import { useGetRoutesQuery } from "@/src/store/travelApi";
import { useSearchParams } from "@/src/hooks/useFilters";

export default function CategoryScreen() {
  const { id, slug } = useLocalSearchParams<{ id?: string; slug?: string }>();
  const catId = id ? Number(id) : undefined;
  const segments = useSegments();

  const routeKey = `(app)/category/${id ?? slug ?? "unknown"}`;
  const { getFilters } = useSearchParams(routeKey);
  const filters = getFilters() ?? {};

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

  const {
    data: routesRes,
    isLoading: loadingRoutes,
    isError,
  } = useGetRoutesQuery(apiArgs, { skip: !catId && !slug });

  const routes = routesRes?.data ?? [];

  return (
    <Background>
      <Header
        title={slug ?? routesRes?.data?.[0]?.category_name ?? "Category"}
        onBackPress={() => router.back()}
        rightIcon={
          <CircleButton
            variant="filter"
            onPress={() =>
              router.push({
                pathname: "/(app)/routes/filter",
                params: { routeKey },
              })
            }
          />
        }
      />

      <FlatList
        data={routes}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: "space-between",
          gap: wp("1%"),
        }}
        contentContainerStyle={{
          gap: wp("1%"),
          marginHorizontal: wp("3%"),
          paddingTop: wp("5%"),
          paddingBottom: wp("5%"),
        }}
        renderItem={({ item }) => <MiniTourCard tour={item} />}
        ListHeaderComponent={
          <Box px={5} pb={2}>
            {loadingRoutes && (
              <Box alignItems="center" py="20px">
                <Spinner size="lg" />
              </Box>
            )}

            {!loadingRoutes && isError && (
              <Text color="red.500">
                Failed to load tours. Please try again.
              </Text>
            )}

            {!loadingRoutes && !isError && (
              <>
                <Heading size="md" mb={3}>
                  Tours
                </Heading>

                {routes.length === 0 && (
                  <Text>No tours found with current filters.</Text>
                )}
              </>
            )}
          </Box>
        }
      />
    </Background>
  );
}

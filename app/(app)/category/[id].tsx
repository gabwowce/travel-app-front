import React, { useEffect, useMemo, useState } from "react";
import * as Location from "expo-location";
import { Background } from "@/src/components/BGWrapper";
import {
  Box,
  Text,
  ScrollView,
  Spinner,
  FlatList,
  Heading,
} from "native-base";
import { router, useLocalSearchParams } from "expo-router";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import Header from "@/src/components/Header";
import MiniTourCard from "@/src/components/MiniTourCard";
import {
  useGetRoutesQuery,
  useGetCategoryByIdQuery,
} from "@/src/store/travelApi";
import { getDistanceKm } from "@/src/utils/distance";

export default function CategoryScreen() {
  /* ---------- URL param & category name ---------- */
  const { id } = useLocalSearchParams<{ id: string }>();
  const catId = Number(id);

  const {
    data: categoryName,
    isLoading: catLoading,
  } = useGetCategoryByIdQuery(catId, {
    skip: isNaN(catId),
    selectFromResult: ({ data, isLoading }) => ({
      data: data?.name,
      isLoading,
    }),
  });

  /* ----------  All routes for this category ---------- */
  const {
    data: routeRes,
    isLoading: loadingRoutes,
    isError,
  } = useGetRoutesQuery(
    { category_id: catId, limit: 200, sort: "rating_desc" },
    { skip: isNaN(catId) }
  );

  const allRoutes = routeRes?.data ?? [];

  /* ---------- 1) Get user location ---------- */
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [locDenied, setLocDenied] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocDenied(true);
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      setLocation({ lat: loc.coords.latitude, lng: loc.coords.longitude });
    })();
  }, []);

  /* ---------- 2) Split into nearby (≤100 km) & global ---------- */
  const nearbyRoutes = useMemo(() => {
    if (!location) return [];
    return allRoutes.filter((r) => {
      if (r.lat == null || r.lng == null) return false;
      return getDistanceKm(location.lat, location.lng, r.lat, r.lng) <= 100;
    });
  }, [allRoutes, location]);

  /* ---------- UI ---------- */
  return (
    <Background>
      {catLoading ? (
        <Header title="Loading..." />
      ) : (
        <Header
          title={categoryName ?? "Category"}
          onBackPress={() => router.back()}
        />
      )}

      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: wp("5%") }}
      >
        <Box flex={1} pt={wp("5%")}>
          {/* -------- Error / Spinner -------- */}
          {loadingRoutes && (
            <Box alignItems="center" py="20px">
              <Spinner size="lg" />
            </Box>
          )}

          {!loadingRoutes && isError && (
            <Text color="red.500" px={wp("3%")}>
              Failed to load tours. Please try again.
            </Text>
          )}

          {/* -------- 1. Routes Around You -------- */}
          {location && !loadingRoutes && !isError && (
            <>
              <Heading size="md" px={wp("3%")} mb={2}>
                Routes Around You
              </Heading>

              {nearbyRoutes.length === 0 ? (
                <Text px={wp("3%")}>No nearby tours within 100 km.</Text>
              ) : (
                <FlatList
                  data={nearbyRoutes}
                  horizontal
                  keyExtractor={(item) => item.id.toString()}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal: wp("3%") }}
                  renderItem={({ item }) => (
                    <MiniTourCard tour={item} mr={wp("2%")} />
                  )}
                />
              )}
            </>
          )}

          {/* -------- 2. Popular Worldwide -------- */}
          {!loadingRoutes && !isError && (
            <>
              <Heading size="md" mt={5} px={wp("3%")} mb={2}>
                Popular Routes Around the World
              </Heading>

              {allRoutes.length === 0 ? (
                <Text px={wp("3%")}>No tours found in this category.</Text>
              ) : (
                <FlatList
                  data={allRoutes}
                  numColumns={2}
                  keyExtractor={(item) => item.id.toString()}
                  columnWrapperStyle={{
                    justifyContent: "space-between",
                    gap: wp("1%"),
                  }}
                  contentContainerStyle={{
                    gap: wp("1%"),
                    marginHorizontal: wp("3%"),
                  }}
                  renderItem={({ item }) => <MiniTourCard tour={item} />}
                  scrollEnabled={false}
                />
              )}
            </>
          )}

          {/* --------  Location denied message -------- */}
          {locDenied && (
            <Text mt={4} px={wp("3%")} color="gray.500" fontSize="xs">
              Location permission denied – showing worldwide routes only.
            </Text>
          )}
        </Box>
      </ScrollView>
    </Background>
  );
}

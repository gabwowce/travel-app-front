import React, { useEffect, useMemo } from "react";
import { Background } from "@/src/components/BGWrapper";
import { Box, Text, ScrollView, Spinner, FlatList } from "native-base";
import { router, useLocalSearchParams } from "expo-router";
import { useAppDispatch, useAppSelector } from "@/src/data/hooks";
import { fetchRoutes } from "@/src/data/features/routes/routesThunks";
import type { Route } from "@/src/api/generated/models/Route";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import Header from "@/src/components/Header";
import MiniTourCard from "@/src/components/MiniTourCard";

export default function CategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const dispatch = useAppDispatch();

  const categories = useAppSelector((state) => state.categories.categories);
  const routes = useAppSelector((state) => state.routes.routes);
  const loading = useAppSelector((state) => state.routes.loading);
  const error = useAppSelector((state) => state.routes.error);

  const catId = useMemo(() => Number(id), [id]);
  const category = useMemo(() => categories.find((c) => c.id === catId), [categories, catId]);

  useEffect(() => {
    if (!isNaN(catId)) {
      dispatch(fetchRoutes({ categoryId: catId, perPage: 30, sort: "rating_desc" }));
    }
  }, [dispatch, catId]);

  return (
    <Background>
      <Header title={category?.name ?? "Category"} onBackPress={() => router.back()} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: wp("5%") }}
      >
        <Box flex={1} pt={wp("5%")}>
          {loading && (
            <Box alignItems="center" py="20px">
              <Spinner size="lg" />
            </Box>
          )}

          {!loading && error && (
            <Text color="red.500" px={wp("3%")}>
              Failed to load tours. Please try again.
            </Text>
          )}

          {!loading && !error && routes.length === 0 && (
            <Text px={wp("3%")}>No tours found in this category.</Text>
          )}

          {!loading && !error && routes.length > 0 && (
            <FlatList
              data={routes}
              keyExtractor={(item) => item.id.toString()}
              numColumns={2}
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
        </Box>
      </ScrollView>
    </Background>
  );
}

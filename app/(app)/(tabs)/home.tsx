import React from "react";
import { Background } from "@/src/components/BGWrapper";
import { TourCard } from "@/src/components/tour/TourCard";
import {
  Box,
  Text,
  ScrollView,
  VStack,
  HStack,
  Spinner,
  Pressable,
} from "native-base";
import {
  useGetFeaturedRoutesQuery,   // 🔹 sugeneruoti hook’ai
  useGetCategoriesQuery,
} from "@/src/store/travelApi";
import type { Route } from "@/src/api/generated/models/Route";
import type { Category } from "@/src/api/generated/models/Category";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import useBreakpoint from "@/src/hooks/useBreakpoint";
import { useRouter } from "expo-router";
import SectionHeader from "@/src/components/ui/SectionHeader";
import {travelApi} from "@/src/store/travelApi";
import { generateEndpointDefinition } from './../../../node_modules/@rtk-query/codegen-openapi/src/codegen';
const VINGIO_IMG = require("../../../src/assets/images/vingio-parkas.png");

export default function Home() {
  const router = useRouter();

  /* ─────────── ROUTES & CATEGORIES PER RTK Query ─────────── */
const {
  data: featuredRoutesResponse,       // be numatytos reikšmės!
  isLoading: routesLoading,
  error: routesError,
} = useGetFeaturedRoutesQuery({ limit: 6 });

const featuredRoutes = featuredRoutesResponse?.data ?? [];

  const {
    data: categoriesResponse,
    isLoading: categoriesLoading,
  } = useGetCategoriesQuery();

  const categories = categoriesResponse?.data ?? []; 

  /* ─────────── UI helperiai ─────────── */
  const { heightBreakpoint } = useBreakpoint();
  const paddingTop = heightBreakpoint === "short" ? wp("10%") : wp("17%");

  /* ─────────── Navigacija ─────────── */
  const handleCategoryPress = (category: Category) => {
    router.push({
      pathname: "/category/[id]",
      params: { id: String(category.id) },
    });
  };

  return (
    <Background>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: wp("10%") }}
      >
        <Box flex={1} pt={paddingTop}>
          {/* ─── HEADER ─── */}
          <VStack pl={wp("3%")} pb={wp("1%")}>
            <Text variant="header1">Explore the</Text>
            <Text variant="header1Bold">Beautiful world!</Text>
          </VStack>

          {/* ─── CATEGORIES ─── */}
          <SectionHeader title="Categories" />

          {categoriesLoading ? (
            <Box alignItems="center" py="15px">
              <Spinner size="sm" />
            </Box>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <HStack space={3} px={wp("3%")}>
                {categories.map((cat) => (
                  <Pressable
                    key={cat.id}
                    onPress={() => handleCategoryPress(cat)}
                  >
                    <Box
                      px={4}
                      py={2}
                      borderRadius="full"
                      bg="primary.100"
                      _pressed={{ bg: "primary.200" }}
                    >
                      <Text fontSize="sm" fontWeight="bold" color="primary.800">
                        {cat.name}
                      </Text>
                    </Box>
                  </Pressable>
                ))}
              </HStack>
            </ScrollView>
          )}

          {/* ─── FEATURED ROUTES ─── */}
          <SectionHeader title="Featured tours" topPadding />

          {routesLoading ? (
            <Box alignItems="center" py="20px">
              <Spinner size="lg" color="primary.500" />
            </Box>
          ) : routesError ? (
            <Text color="red.500" px={wp("3%")}>
              Failed to load tours. Please try again.
             
            </Text>
          ) : (featuredRoutes as Route[]).length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <HStack space={4} px={wp("3%")}>
                {featuredRoutes.map((route) => (
                  <TourCard
                    key={route.id}
                    id={String(route.id)}
                    image={VINGIO_IMG /* TODO: route.media[0] */}
                    title={route.name ?? "Unnamed"}
                    rating={route.ratings_avg ?? 0}
                    location={`${route.city?.name ?? "Unknown"}, ${
                      route.city?.country?.name ?? "Unknown"
                    }`}
                  />
                ))}
              </HStack>
            </ScrollView>
          ) : (
            <Text px={wp("3%")}>No featured routes available.</Text>
          )}
        </Box>
      </ScrollView>
    </Background>
  );
}

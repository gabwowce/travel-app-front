import React, { useState } from "react";
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
  Wrap,
} from "native-base";
import {
  useGetFeaturedRoutesQuery,   // 🔹 sugeneruoti hook’ai
  useGetCategoriesQuery,
  useGetCurrentUserQuery,
} from "@/src/store/travelApi";
import type { Route } from "@/src/api/generated/models/Route";
import type { Category } from "@/src/api/generated/models/Category";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { useRouter } from "expo-router";
import SectionHeader from "@/src/components/ui/SectionHeader";
import { Button } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { mergeFiltersForKey } from "@/src/data/features/filters/filtersSlice";
import { useAppDispatch } from "@/src/data/hooks";
import RandomRouteButton from "@/src/components/ui/RandomRouteButton";

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


  /* ─────────── Navigacija ─────────── */
  const dispatch = useAppDispatch();
const handleCategoryPress = (cat: Category) => {
  const key = "results";
  const filtersObj = { categoryId: cat.id };

  // ➊ į Redux
  dispatch(mergeFiltersForKey({ key, filters: filtersObj }));

  // ➋ per URL (?filters=…)
  router.navigate({
    pathname: `/results/${key}`,
    params: { filters: JSON.stringify(filtersObj) },
  });
};
const [expanded, setExpanded] = useState(true);
const visibleCategories = expanded ? categories : categories.slice(0, 3);

const { data: userData } = useGetCurrentUserQuery();
const userName = userData?.data?.name?.split(" ")[0] ?? "keliautojau";
  return (
    <Background>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: wp("10%") }}
      >
        <Box flex={1} pt={20}>
          {/* ─── HEADER ─── */}
          <VStack pl={5} pb={wp("1%")}>
              <Box>
                <Text variant="header1" >Explore the</Text>
                <Text variant="header1Bold" mt={-4}>
                  Beautiful world!
                </Text>
              </Box>
            
          </VStack>


          {/* ─── FEATURED ROUTES ─── */}
          <SectionHeader title="Featured tours" topPadding />

          {routesLoading ? (
            <Box alignItems="center" py="20px">
              <Spinner size="lg" color="primary.500" />
            </Box>
          ) : routesError ? (
            <Text color="red.500" px={5}>
              Failed to load tours. Please try again.
             
            </Text>
          ) : (featuredRoutes as Route[]).length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <HStack space={4} px={5}>
                {featuredRoutes.map((route) => (
                  <TourCard
                    key={route.id}
                    id={String(route.id)}
                    image={VINGIO_IMG /* TODO: route.media[0] */}
                    title={route.name ?? "Unnamed"}
                    rating={(route as any).ratings_avg_rating ?? 0}
                    location={`${route.city?.name ?? "Unknown"}, ${
                      route.city?.country?.name ?? "Unknown"
                    }`}
                  />
                ))}
              </HStack>
            </ScrollView>
          ) : (
            <Text px={5}>No featured routes available.</Text>
          )}

          {/* ─── CATEGORIES ─── */}
         <SectionHeader pt={4} title="Categories" />

        <VStack px={5} space={3}>
          <Wrap direction="row" justify="flex-start" spacing={3}>
            {visibleCategories.map((cat) => (
              <Pressable key={cat.id} onPress={() => handleCategoryPress(cat)}>
                <Box
                  px={4}
                  py={2}
                  m={1}
                  borderRadius="full"
                  bg="primary.100"
                  maxW={wp("40%")}  // apriboja plotį, kad wrap’intų
                  _pressed={{ bg: "primary.200" }}
                >
                  <Text
                    fontSize="sm"
                    fontWeight="bold"
                    color="primary.800"
                    textAlign="center"
                  >
                    {cat.name}
                  </Text>
                </Box>
              </Pressable>
            ))}
          </Wrap>

          {/* {categories.length > 3 && (
            <Pressable onPress={() => setExpanded((prev) => !prev)}>
              <Text
                fontSize="sm"
                fontWeight="medium"
                color="primary.600"
                textAlign="center"
                mt={1}
              >
                {expanded ? "Show less" : "Show more"}
              </Text>
            </Pressable>
          )} */}
        </VStack>



          <RandomRouteButton/>
        </Box>
      </ScrollView>
    </Background>
  );
}

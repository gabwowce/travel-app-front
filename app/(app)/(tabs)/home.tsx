import { Background } from "@/src/components/BGWrapper";
import SectionHeader from "@/src/components/ui/SectionHeader";
import CategoryGrid from "@/src/components/ui/CategoryGrid";
import FeaturedRoutesRow from "@/src/components/ui/FeaturedRoutesRow";
import RandomRouteButton from "@/src/components/ui/RandomRouteButton";
import { Box, ScrollView, Text, VStack } from "native-base";
import { useAppDispatch } from "@/src/data/hooks";
import { mergeFiltersForKey } from "@/src/data/features/filters/filtersSlice";
import { useRouter } from "expo-router";
import { useHomeData } from "@/src/hooks/useHomeData";
import type { Category } from "@/src/api/generated/models/Category";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import useAnnounceForAccessibility from "@/src/hooks/useAnnounceForAccessibility";

export default function Home() {
  useAnnounceForAccessibility("Home screen opened. Explore featured tours and categories.");
  const router = useRouter();
  const dispatch = useAppDispatch();

  const {
    featuredRoutes,
    routesLoading,
    routesError,
    visibleCategories,
    userName,
  } = useHomeData();

  const handleCategoryPress = (cat: Category) => {
    const key = "results";
    const filtersObj = { categoryId: cat.id };

    dispatch(mergeFiltersForKey({ key, filters: filtersObj }));

    router.navigate({
      pathname: "/(app)/results/[...key]",
      params: {
        key: [key],
        filters: JSON.stringify(filtersObj),
      },
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
        <Box flex={1} pt={20}>
          {/* Header */}
          <VStack pl={5} pb={wp("1%")}>
            <Text variant="header1" accessibilityRole="header">Explore the</Text>
            <Text variant="header1Bold" accessibilityRole="header" mt={-4}>
              Beautiful world!
            </Text>
          </VStack>

          <SectionHeader title="Featured tours" topPadding />
          <FeaturedRoutesRow
            routes={featuredRoutes as import("@/src/store/travelApi").Route[]}
            loading={routesLoading}
            error={routesError}
          />

          <SectionHeader pt={4} title="Categories" />
          <VStack px={5} space={3}>
            <CategoryGrid
              categories={visibleCategories}
              onPress={handleCategoryPress}
            />
          </VStack>

          <RandomRouteButton />
        </Box>
      </ScrollView>
    </Background>
  );
}

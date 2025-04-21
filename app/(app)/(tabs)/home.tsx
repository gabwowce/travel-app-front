import React, { useEffect } from "react";
import { Background } from "@/src/components/BGWrapper";
import { TourCard } from "@/src/components/tour/TourCard";
import { Box, Text, ScrollView, VStack, HStack, Spinner } from "native-base";
import { useAppDispatch, useAppSelector } from "@/src/data/hooks";
import { fetchFeaturedRoutes } from "@/src/data/features/routes/routesThunks";
import type { Route } from "@/src/api/generated/models/Route";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
const VINGIO_IMG = require("../../../src/assets/images/vingio-parkas.png");
const API_URL = "https://travelapp.prus.dev";
import useBreakpoint from "@/src/hooks/useBreakpoint";



export default function Index() {
  const dispatch = useAppDispatch();
  const featuredRoutes = useAppSelector(state => state.routes.featuredRoutes) as Route[];
  const loading = useAppSelector((state)=> state.routes.loading);
  const error = useAppSelector((state)=>state.routes.error);

  const { heightBreakpoint } = useBreakpoint();

  const paddingTop = heightBreakpoint === "short" ? wp("10%") : wp("37%");

  useEffect(() => {
    dispatch(fetchFeaturedRoutes({ limit: 6 }));
  }, [dispatch]);
  


  return (
    <Background>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: wp("10%") }}
      >
      <Box flex={1} pt={paddingTop}>
              <VStack pl={wp("3%")} pb={wp("1%")}>
                <Text variant="header1">Explore the</Text>
                <Text variant="header1Bold">Beautiful world!</Text>
              </VStack>

              <Text variant="header2Bold" pl={wp("3%")} pb={wp("2%")}>Tours for you</Text>

              {loading ? (
                <Box alignItems="center" py="20px">
                  <Spinner size="lg" color="primary.500" />
                </Box>
              ) : error ? (
                <Text color="red.500" px={wp("3%")}>Failed to load tours. Please try again.</Text>
              ) : Array.isArray(featuredRoutes) && featuredRoutes.length > 0 ? (
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <HStack space={4} px={wp("3%")}>
                    {featuredRoutes.map((route) => (
                      <TourCard
                      key={route.id}
                      id={String(route.id)} // naudok id kaip string, nes slug nėra
                      // image={{ uri: `${API_URL}${route.media?.[0]?.url ?? ""}` }}
                      image={VINGIO_IMG}
                      title={route.name ?? "Unnamed"}
                      rating={route.ratings_avg ?? 0}
                      location={`${route.city?.name ?? "Unknown"}, ${route.city?.country?.name ?? "Unknown"}`}
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

import React, { useEffect } from "react";
import { Background } from "@/src/components/BGWrapper";
import { TourCard } from "@/src/components/TourCard";
import { Box, Text, ScrollView, VStack, HStack, Spinner } from "native-base";
import { useAppDispatch, useAppSelector } from "@/src/data/hooks";
import { fetchFeaturedRoutes } from "@/src/data/features/routes/routesThunks";
import type { Route } from "@/src/api/generated/models/Route";


const API_URL = "https://travelapp.prus.dev";




export default function Index() {
  const dispatch = useAppDispatch();
  const featuredRoutes = useAppSelector(state => state.routes.featuredRoutes) as Route[];
  const loading = useAppSelector((state)=> state.routes.loading);
  const error = useAppSelector((state)=>state.routes.error);



  useEffect(() => {
    dispatch(fetchFeaturedRoutes({ limit: 6 }));
  }, [dispatch]);
  


  return (
    <Background>
      <Box flex={1} pt="121px">
        <VStack pl="35px" pb="54px">
          <Text variant="header1">Explore the</Text>
          <Text variant="header1Bold">Beautiful world!</Text>
        </VStack>

        <Text variant="header2Bold" pl="35px" pb="14px">Tours for you</Text>

        {loading ? (
          <Box alignItems="center" py="20px">
            <Spinner size="lg" color="primary.500" />
          </Box>
        ) : error ? (
          <Text color="red.500" px="35px">Failed to load tours. Please try again.</Text>
        ) : Array.isArray(featuredRoutes) && featuredRoutes.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <HStack space={4} px="35px">
              {featuredRoutes.map((route) => (
                <TourCard
                key={route.id}
                id={String(route.id)} // naudok id kaip string, nes slug nėra
                image={{ uri: `${API_URL}${route.media?.[0]?.url ?? ""}` }}
                title={route.name ?? "Unnamed"}
                rating={route.ratings_avg ?? 0}
                location={`${route.city?.name ?? "Unknown"}, ${route.city?.country?.name ?? "Unknown"}`}
                />
              ))}
            </HStack>
          </ScrollView>
        ) : (
          <Text px="35px">No featured routes available.</Text>
        )}
      </Box>
    </Background>
  );
}

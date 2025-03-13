import React, { useEffect } from "react";
import { Background } from "@/src/components/BGWrapper";
import { TourCard } from "@/src/components/TourCard";
import { Box, Text, ScrollView, VStack, HStack, Spinner } from "native-base";
import { useAppDispatch, useAppSelector } from "@/src/data/hooks";
import { fetchFeaturedRoutes } from "@/src/data/features/routes/routesSlice";
import {selectRoutesLoading, selectRoutesError, selectFeaturedRoutes} from "@/src/data/features/routes/routesSelectors";

export default function Index() {
  const dispatch = useAppDispatch();
  const featuredRoutes = useAppSelector(selectFeaturedRoutes);
  const loading = useAppSelector(selectRoutesLoading);
  const error = useAppSelector(selectRoutesError);

  useEffect(() => {
    dispatch(fetchFeaturedRoutes());
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
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <HStack space={4} px="35px">
              {featuredRoutes.length > 0 ? (
                featuredRoutes.map((route) => (
                  <TourCard
                    key={route.id}
                    id={route.slug}
                    image={{ uri: `http://127.0.0.1:8000${route.media[0]?.url || ""}` }}
                    title={route.name}
                    rating={route.ratings_avg_rating}
                    location={`${route.city.name}, ${route.city.country.name}`}
                  />
                ))
              ) : (
                <Text px="35px">No featured routes available.</Text>
              )}
            </HStack>
          </ScrollView>
        )}
      </Box>
    </Background>
  );
}

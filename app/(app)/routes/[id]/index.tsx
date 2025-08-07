import React, { useEffect, useLayoutEffect, useMemo } from "react";
import { useLocalSearchParams, router } from "expo-router";
import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { Box, Image, VStack, Text, Icon } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import {
  useGetRouteByIdQuery,
  useGetRoutePlacesQuery,
} from "@/src/store/travelApi";
import { FAKE_POINTS } from "@/src/config/fakeData";
import { IMAGES } from "@/src/config/images";
import FlexContainer from "@/src/components/layout/FlexContainer";
import Spinner from "@/src/components/ui/Spinner";
import RatingStars from "@/src/components/ui/RatingStars";
import RouteStatsRow from "@/src/components/ui/RouteStatsRow";
import CategoryBadges from "@/src/components/ui/CategoryBadges";
import Button from "@/src/components/ui/btns/Button";
import FavoriteButton from "@/src/components/ui/btns/FavoriteButton";
import { useNavigation } from "@react-navigation/native";
import useAnnounceForAccessibility from "@/src/hooks/useAnnounceForAccessibility";
import { travelApi } from "@/src/store/travelApi";

export default function RouteInfoScreen() {
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();
  const routeId = useMemo(() => Number(Array.isArray(id) ? id[0] : id), [id]);
  const prefetchRoutePlaces = travelApi.usePrefetch("getRoutePlaces");
  useEffect(() => {
    if (routeId) {
      prefetchRoutePlaces({ route: String(routeId) });
    }
  }, [routeId]);
  const { data: selectedRoute, isLoading: routeLoading } = useGetRouteByIdQuery(
    { route: String(routeId) },
    { skip: !routeId }
  );

  const { isLoading: placesLoading } = useGetRoutePlacesQuery(
    { route: String(routeId) },
    { skip: !routeId }
  );

  // Consolidated loading state so hooks order stays the same on every render
  const isLoading = routeLoading || placesLoading || !selectedRoute;
  const route = selectedRoute?.data;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: isLoading ? "" : (route?.name ?? ""),
      headerRight: () => (
        <TouchableOpacity onPress={navigateToMap} accessibilityLabel="Open map">
          <Icon as={MaterialIcons} name="map" size="lg" color="primary.500" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, isLoading, route?.name]);

  useAnnounceForAccessibility(
    isLoading ? "Loading route..." : `${route!.name} route screen opened`
  );

  const navigateToMap = () => {
    router.push({
      pathname: "/routes/[id]/map",
      params: {
        id: String(routeId),
        routeName: route?.name ?? "",
      },
    });
  };

  if (isLoading) {
    return <Spinner />;
  }

  const {
    name,
    description,
    distance,
    elevation,
    difficulty,
    estimated_time,
    ratings_avg_rating,
    categories,
  } = route!;

  return (
    <FlexContainer>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        accessible={false}
        importantForAccessibility="no"
      >
        <VStack space={4} mt={6}>
          <Box style={styles.imageContainer}>
            <Image
              alt={`${name} route main image`}
              accessibilityLabel={`${name} route photo`}
              accessible
              source={IMAGES.VINGIO_PARKAS}
              style={styles.image}
            />
            <FavoriteButton routeId={routeId} style={styles.bookmarkIcon} />
            <Box style={styles.imageOverlay}>
              <Text style={styles.title} accessibilityRole="header">
                {name}
              </Text>
              <RatingStars
                value={ratings_avg_rating}
                accessibilityLabel={`Rating: ${ratings_avg_rating} stars`}
              />
            </Box>
          </Box>
        </VStack>

        <VStack space="4" px="4" pt="4" pb="10">
          <RouteStatsRow
            distance={distance}
            elevation={elevation}
            difficulty={difficulty}
            estimated_time={estimated_time}
          />

          <CategoryBadges categories={categories} />

          <Text fontSize="sm" lineHeight="lg">
            {description}
          </Text>
        </VStack>
      </ScrollView>
      <Button
        pr={10}
        pl={10}
        pb={35}
        onPress={navigateToMap}
        accessibilityLabel={`Start ${name} route on the map`}
        leftIcon={
          <Icon as={MaterialIcons} name="map" size="sm" color="white" />
        }
      >
        Start
      </Button>
    </FlexContainer>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    position: "relative",
    marginTop: -32,
  },
  image: {
    width: "100%",
    height: 260,
  },
  imageOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "40%",
    paddingHorizontal: 16,
    paddingBottom: 12,
    justifyContent: "flex-end",
  },
  title: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  bookmarkIcon: {
    position: "absolute",
    top: 24,
    right: 24,
    backgroundColor: "rgba(0,0,0,0.2)",
    padding: 5,
    borderRadius: 20,
  },
});

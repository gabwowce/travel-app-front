import FlexContainer from "@/src/components/layout/FlexContainer";
import CategoryBadges from "@/src/components/ui/CategoryBadges";
import RatingStars from "@/src/components/ui/RatingStars";
import RouteStatsRow from "@/src/components/ui/RouteStatsRow";
import Spinner from "@/src/components/ui/Spinner";
import Button from "@/src/components/ui/btns/Button";
import FavoriteButton from "@/src/components/ui/btns/FavoriteButton";
import { IMAGES } from "@/src/config/images";
import useAnnounceForAccessibility from "@/src/hooks/useAnnounceForAccessibility";
import {
  useGetRouteByIdQuery,
  useGetRoutePlacesQuery,
  useGetUserFavoritesQuery, // <<< pridėta
} from "@/src/store/travelApi";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { router, useLocalSearchParams } from "expo-router";
import { Box, Icon, Image, Text, VStack } from "native-base";
import React, { useCallback, useLayoutEffect, useMemo } from "react";
import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";

function pickRouteIdFromFavorite(item: any): number | undefined {
  if (!item) return;
  if (typeof item.id === "number" && ("title" in item || "name" in item))
    return item.id;
  if (typeof item.route_id === "number") return item.route_id;
  if (typeof item.routeId === "number") return item.routeId;
  if (item.route && typeof item.route.id === "number") return item.route.id;
  if (typeof item === "number") return item;
}

export default function RouteInfoScreen() {
  const navigation = useNavigation();
  const params = useLocalSearchParams<{
    id: string | string[];
    is_favorite?: string | string[];
  }>();
  const routeId = useMemo(
    () => Number(Array.isArray(params.id) ? params.id[0] : params.id),
    [params.id]
  );
  console.log("[RouteInfoScreen: routeId]", routeId);

  // PRADINIS FAVORITE IŠ PARAMS (1/true/yes)
  const initialSelectedFromParams = useMemo(() => {
    const raw = Array.isArray(params.is_favorite)
      ? params.is_favorite[0]
      : params.is_favorite;
    if (!raw) return undefined;
    const s = String(raw).toLowerCase();
    return s === "1" || s === "true" || s === "yes";
  }, [params.is_favorite]);

  const { data: selectedRoute, isLoading: routeLoading } = useGetRouteByIdQuery(
    { route: String(routeId) },
    { skip: !routeId }
  );

  const { isLoading: placesLoading } = useGetRoutePlacesQuery(
    { route: String(routeId) },
    { skip: !routeId }
  );

  // <<< pasiimame favorites sąrašą (argumentai pas tave visi optional)
  const { data: favResp } = useGetUserFavoritesQuery({});

  const favoritesArray = useMemo(() => {
    const raw =
      (favResp as any)?.data?.data ?? (favResp as any)?.data ?? favResp ?? [];
    return Array.isArray(raw) ? raw : [];
  }, [favResp]);

  const isFavoriteForThisRoute = useMemo(
    () => favoritesArray.some((it) => pickRouteIdFromFavorite(it) === routeId),
    [favoritesArray, routeId]
  ); // <<<

  console.log("[isFavoriteForThisRoute]:", isFavoriteForThisRoute);

  const isLoading = routeLoading || placesLoading || !selectedRoute;
  const route = selectedRoute?.data;

  const navigateToMap = useCallback(() => {
    router.push({
      pathname: "/routes/[id]/map",
      params: { id: String(routeId), routeName: route?.name ?? "" },
    });
  }, [routeId, route?.name]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: isLoading ? "" : (route?.name ?? ""),
      headerRight: () => (
        <TouchableOpacity onPress={navigateToMap} accessibilityLabel="Open map">
          <Icon as={MaterialIcons} name="map" size="lg" color="primary.500" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, isLoading, route?.name, navigateToMap]);

  useAnnounceForAccessibility(
    isLoading ? "Loading route..." : `${route!.name} route screen opened`
  );

  if (isLoading) return <Spinner />;

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
            <FavoriteButton
              routeId={routeId}
              initialSelected={initialSelectedFromParams}
              style={styles.bookmarkIcon}
            />
            <Box style={styles.imageOverlay}>
              <Text style={styles.title} accessibilityRole="header">
                {name}
              </Text>
              <RatingStars value={ratings_avg_rating} />
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
  imageContainer: { position: "relative", marginTop: -32 },
  image: { width: "100%", height: 260 },
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
  title: { color: "white", fontSize: 24, fontWeight: "bold" },
  bookmarkIcon: {
    position: "absolute",
    top: 24,
    right: 24,
    backgroundColor: "rgba(0,0,0,0.2)",
    padding: 5,
    borderRadius: 20,
  },
});

import React from "react";
import { useLocalSearchParams, router } from "expo-router";
import { ScrollView, StyleSheet } from "react-native";
import { Box, Image, VStack, HStack, Text, Badge, Icon } from "native-base";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";

import { useGetRouteByIdQuery, useGetRoutePlacesQuery } from "@/src/store/travelApi";
import { FAKE_POINTS } from "@/src/config/fakeData";
import { IMAGES } from "@/src/config/images";
import { AppRoutes } from "@/src/config/routes";

import FlexContainer from "@/src/components/layout/FlexContainer";
import Header from "@/src/components/Header";
import Button from "@/src/components/ui/btns/Button";
import CircleButton from "@/src/components/ui/btns/CircleButton";
import FavoriteButton from "@/src/components/ui/btns/FavoriteButton";
import StatChip from "@/src/components/ui/StatChip";
import Spinner from "@/src/components/ui/Spinner";

export default function RouteInfoScreen() {
  const { id } = useLocalSearchParams();
  const routeId = Array.isArray(id) ? parseInt(id[0], 10) : parseInt(id ?? "", 10);

  const {
    data: selectedRoute,
    isLoading: routeLoading,
  } = useGetRouteByIdQuery(routeId, { skip: !routeId });

  const { isLoading: placesLoading } = useGetRoutePlacesQuery(routeId, { skip: !routeId });

  if (routeLoading || !selectedRoute) {
    return <Spinner />;
  }

  const {
    name,
    description,
    distance,
    elevation_gain,
    difficulty,
    estimated_time,
    ratings_avg_rating,
    media,
    categories,
  } = selectedRoute;

  const navigateToMap = () => {
    router.push({
      pathname: AppRoutes.routeMap(routeId),
      params: {
        id: String(routeId),
        fake: encodeURIComponent(JSON.stringify(FAKE_POINTS)),
        routeName: String(name),
      },
    });
  };

  return (
    <FlexContainer>
      <Header title={name} onBackPress={() => router.back()} rightIcon={<CircleButton variant="start" onPress={navigateToMap} />} />

      <ScrollView keyboardShouldPersistTaps="handled">
        <VStack space={4} mt={6}>
          <Box style={styles.imageContainer}>
            <Image alt={name} source={IMAGES.VINGIO_PARKAS} style={styles.image} />
            <FavoriteButton routeId={routeId} style={styles.bookmarkIcon} />
            <Box style={styles.imageOverlay}>
              <Text style={styles.title}>{name}</Text>
              <HStack alignItems="center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Icon
                    key={i}
                    as={FontAwesome}
                    name={i + 1 <= Math.round(ratings_avg_rating) ? "star" : "star-o"}
                    color="yellow.400"
                    size="sm"
                  />
                ))}
                <Text style={styles.ratingText}>{ratings_avg_rating.toFixed(1)}</Text>
              </HStack>
            </Box>
          </Box>
        </VStack>

        <VStack space="4" px="4" pt="4" pb="10">
          <HStack flexWrap="wrap">
            <StatChip icon="map-marker" label={`${distance.toFixed(1)} km`} />
            <StatChip icon="area-chart" label={`${elevation_gain} m ↑`} />
            <StatChip icon="road" label={difficulty} />
            <StatChip icon="clock-o" label={estimated_time} />
          </HStack>

          <HStack flexWrap="wrap">
            {categories?.map((c: any) => (
              <Badge
                key={c.id}
                bg={c.color ?? "primary.500"}
                _text={{ color: "white", fontSize: "xs" }}
                mr="2"
                mb="2"
              >
                {c.name}
              </Badge>
            ))}
          </HStack>

          <Text fontSize="sm" lineHeight="lg">
            {description}
          </Text>

          <Button
            pb={15}
            onPress={navigateToMap}
            leftIcon={<Icon as={MaterialIcons} name="map" size="sm" color="white" />}
          >
            Start
          </Button>
        </VStack>
      </ScrollView>
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
  ratingText: {
    color: "#E5E7EB",
    marginLeft: 8,
    fontSize: 14,
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

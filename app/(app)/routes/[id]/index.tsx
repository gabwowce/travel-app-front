import React from "react";
import {
  Box,
  Image,
  ScrollView,
  VStack,
  HStack,
  Text,
  Badge,
  Icon,
} from "native-base";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";
import { StyleSheet } from "react-native";

import Header from "@/src/components/Header";
import Button from "@/src/components/ui/btns/Button";
import FlexContainer from "@/src/components/layout/FlexContainer";
import CircleButton from "@/src/components/ui/btns/CircleButton";
import FavoriteButton from "@/src/components/ui/btns/FavoriteButton";
import { useGetRouteByIdQuery, useGetRoutePlacesQuery } from "@/src/store/travelApi";
import { TourPoint } from "./map";
import Spinner from "@/src/components/ui/Spinner";
import { FAKE_POINTS } from "@/src/config/fakeData";
import { IMAGES } from "@/src/config/images";

const StatChip = ({ icon, label }: { icon: string; label: string }) => (
  <HStack
    alignItems="center"
    bg="primary.100"
    _dark={{ bg: "primary.800" }}
    px="3"
    py="1"
    rounded="md"
    mr="2"
    mb="2"
  >
    <Icon as={FontAwesome} name={icon} size="xs" mr="1" />
    <Text fontSize="xs">{label}</Text>
  </HStack>
);

export default function RouteInfoScreen() {
  const { id } = useLocalSearchParams();
  const routeId = Array.isArray(id) ? parseInt(id[0], 10) : parseInt(id ?? "", 10);

  const {
    data: selectedRoute,
    isLoading: routeLoading,
    isError,
  } = useGetRouteByIdQuery(routeId, { skip: !routeId });

  const {
    data: routePlaces,
    isLoading: placesLoading,
  } = useGetRoutePlacesQuery(routeId, { skip: !routeId });

  if (routeLoading || !selectedRoute) {
    return <Spinner/>;
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

  return (
    <FlexContainer>
      <Header
        title={`${name}`}
        onBackPress={() => router.back()}
        rightIcon={
          <CircleButton
            variant="start"
            onPress={() =>
              router.push({
                pathname: "/(app)/routes/[id]/map",
                params: {
                  id: String(routeId),
                  fake: encodeURIComponent(JSON.stringify(fakePoints)),
                  routeName: String(name),
                },
              })
            }
          />
        }
      />

      <ScrollView keyboardShouldPersistTaps="handled">
        <VStack space={4} mt={6}>
          <Box position="relative" mt={-8}>
            <Image
              alt={name}
              source={IMAGES.VINGIO_PARKAS}
              width="100%"
              height={260}
            />
            <FavoriteButton routeId={routeId} style={styles.bookmarkIcon} />
            <Box
              position="absolute"
              left={0}
              right={0}
              bottom={0}
              h="40%"
              bg={{
                linearGradient: {
                  colors: ["transparent", "rgba(0,0,0,0.6)"],
                  start: [0, 0],
                  end: [0, 1],
                },
              }}
              px="4"
              pb="3"
              justifyContent="flex-end"
            >
              <Text color="white" fontSize="2xl" fontWeight="bold">
                {name}
              </Text>
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
                <Text color="warmGray.200" ml="2" fontSize="sm">
                  {ratings_avg_rating.toFixed(1)}
                </Text>
              </HStack>
            </Box>
          </Box>
        </VStack>

        <VStack space="4" px="4" pt="4" pb="10">
          {/* Statistika */}
          <HStack flexWrap="wrap">
            <StatChip icon="map-marker" label={`${distance.toFixed(1)} km`} />
            <StatChip icon="area-chart" label={`${elevation_gain} m ↑`} />
            <StatChip icon="road" label={difficulty} />
            <StatChip icon="clock-o" label={estimated_time} />
          </HStack>

          {/* Kategorijos */}
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

          {/* Aprašymas */}
          <Text fontSize="sm" lineHeight="lg">
            {description}
          </Text>

          {/* Start button */}
          <Button
            pb={15}
            onPress={() =>
              router.push({
                pathname: "/(app)/routes/[id]/map",
                params: {
                  id: String(routeId),
                  fake: encodeURIComponent(JSON.stringify(FAKE_POINTS)),
                  routeName: String(name),
                },
              })
            }
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
  bookmarkIcon: {
    position: "absolute",
    top: 24,
    right: 24,
    backgroundColor: "rgba(0,0,0,0.2)",
    padding: 5,
    borderRadius: 20,
  },
});

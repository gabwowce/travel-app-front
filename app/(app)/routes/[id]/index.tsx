import React, {useLayoutEffect} from "react";
import { useLocalSearchParams, router } from "expo-router";
import { ScrollView, StyleSheet } from "react-native";
import { Box, Image, VStack, HStack, Text, Badge, Icon } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import {
  useGetRouteByIdQuery,
  useGetRoutePlacesQuery,
} from "@/src/store/travelApi";
import { FAKE_POINTS } from "@/src/config/fakeData";
import { IMAGES } from "@/src/config/images";
import FlexContainer from "@/src/components/layout/FlexContainer";
import Header from "@/src/components/Header";
import Button from "@/src/components/ui/btns/Button";
import CircleButton from "@/src/components/ui/btns/CircleButton";
import FavoriteButton from "@/src/components/ui/btns/FavoriteButton";
import Spinner from "@/src/components/ui/Spinner";
import RatingStars from "@/src/components/ui/RatingStars";
import RouteStatsRow from "@/src/components/ui/RouteStatsRow";
import CategoryBadges from "@/src/components/ui/CategoryBadges";
import { useNavigation } from "@react-navigation/native";
import useAnnounceForAccessibility from "@/src/hooks/useAnnounceForAccessibility";

export default function RouteInfoScreen() {

    const navigation = useNavigation();
  const { id } = useLocalSearchParams();
  const routeId = Array.isArray(id)
    ? parseInt(id[0], 10)
    : parseInt(id ?? "", 10);

  const { data: selectedRoute, isLoading: routeLoading } = useGetRouteByIdQuery(
    { route: String(routeId) },
    { skip: !routeId }
  );

  const { isLoading: placesLoading } = useGetRoutePlacesQuery(
    { route: String(routeId) },
    { skip: !routeId }
  );

  if (routeLoading || !selectedRoute) {
    return <Spinner />;
  }

  const route = selectedRoute?.data;

  if (routeLoading || !route) {
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
    media,
    categories,
  } = route;
  const navigateToMap = () => {
    router.push({
      pathname: "/routes/[id]/map",
      params: {
        id: String(routeId),
        fake: encodeURIComponent(JSON.stringify(FAKE_POINTS)),
        routeName: String(name),
      },
    });
  };

      useLayoutEffect(() => {
      navigation.setOptions({
        title:`${name}`
      });
    }, [navigation]);
useAnnounceForAccessibility(`${name} route screen opened`);
  return (
    <FlexContainer>
      {/* <Header
        title={name}
        onBackPress={() => router.back()}
        rightIcon={<CircleButton variant="start" onPress={navigateToMap} />}
      /> */}

      <ScrollView keyboardShouldPersistTaps="handled" accessible={false}
  importantForAccessibility="no">
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
              <Text style={styles.title} accessibilityRole="header">{name}</Text>
              <RatingStars value={ratings_avg_rating} accessibilityLabel={`Rating: ${ratings_avg_rating} stars`} />
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

          <Button
            pb={15}
            onPress={navigateToMap}
            accessibilityLabel={`Start ${name} route on the map`}
            leftIcon={
              <Icon as={MaterialIcons} name="map" size="sm" color="white" />
            }
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

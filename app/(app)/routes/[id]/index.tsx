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

const fakePoints: TourPoint[] = [
  {
    id: "1",
    title: "Gedimino pilis",
    coords: { latitude: 54.6869, longitude: 25.2896 },
    url: "https://lt.wikipedia.org/wiki/Gedimino_pilis",
    address: "Arsenalo g. 5, Vilnius",
    category: "museum",
    description: "Vienas svarbiausių Lietuvos simbolių. Pilies bokštas siūlo puikius vaizdus į Senamiestį ir Neries pakrantę. Vienas svarbiausių Lietuvos simbolių. Pilies bokštas siūlo puikius vaizdus į Senamiestį ir Neries pakrantę. Vienas svarbiausių Lietuvos simbolių. Pilies bokštas siūlo puikius vaizdus į Senamiestį ir Neries pakrantę."
  },
  {
    id: "2",
    title: "Katedros aikštė",
    coords: { latitude: 54.6862, longitude: 25.2871 },
    url: "https://vilnius-tourism.lt/lankytinos-vietos/katedros-aikste/",
    address: "Katedros a., Vilnius",
    category: "museum",
    description: "Vilniaus širdis – vieta renginiams, pasivaikščiojimams ir istorijos pažinimui. Aikštę supa svarbiausi miesto pastatai."
  },
  {
    id: "3",
    title: "Vilniaus universitetas",
    coords: { latitude: 54.6828, longitude: 25.2896 },
    url: "https://www.vu.lt",
    address: "Universiteto g. 3, Vilnius",
    category: "museum",
    description: "Vienas seniausių universitetų Rytų Europoje, garsėjantis savo kiemeliais, freskomis ir akademine dvasia."
  },
  {
    id: "4",
    title: "Aušros Vartai",
    coords: { latitude: 54.6756, longitude: 25.2924 },
    url: "https://lt.wikipedia.org/wiki/Aušros_Vartai",
    address: "Aušros Vartų g. 14, Vilnius",
    category: "museum",
    description: "Šventovė ir istoriniai vartai, garsėjantys stebuklingu Marijos paveikslu, traukiantys tiek turistus, tiek maldininkus."
  },
  {
    id: "5",
    title: "MO Muziejus",
    coords: { latitude: 54.6767, longitude: 25.2800 },
    url: "https://mo.lt",
    address: "Pylimo g. 17, Vilnius",
    category: "museum",
    description: "Modernus menas pačiame Vilniaus centre. Pastato architektūra bei parodos traukia šiuolaikinio meno mėgėjus."
  },
  {
    id: "6",
    title: "Bernardinų sodas",
    coords: { latitude: 54.6851, longitude: 25.2962 },
    url: "https://vilnius-tourism.lt/lankytinos-vietos/bernardinu-sodas/",
    address: "B. Radvilaitės g. 8A, Vilnius",
    category: "nature",
    description: "Istorinis parkas šalia Vilnelės – puiki vieta pasivaikščioti, pailsėti ar atvykti su vaikais."
  },
  {
    id: "7",
    title: "Operos ir baleto teatras",
    coords: { latitude: 54.6894, longitude: 25.2767 },
    url: "https://opera.lt",
    address: "A. Vienuolio g. 1, Vilnius",
    category: "museum",
    description: "Pagrindinė klasikinės muzikos ir šokio scena Lietuvoje, siūlanti aukščiausio lygio spektaklius."
  },
  {
    id: "8",
    title: "Vingio parkas",
    coords: { latitude: 54.6808, longitude: 25.2486 },
    url: "https://vilnius-tourism.lt/lankytinos-vietos/vingio-parkas/",
    address: "M. K. Čiurlionio g. 100, Vilnius",
    category: "nature",
    description: "Didžiulis žalias parkas, tinkamas sportui, pasivaikščiojimams ir koncertams. Viena mėgstamiausių vilniečių vietų."
  },
  {
    id: "9",
    title: "Televizijos bokštas",
    coords: { latitude: 54.6822, longitude: 25.2133 },
    url: "https://www.tvbokstas.lt/",
    address: "Sausio 13-osios g. 10, Vilnius",
    category: "museum",
    description: "Aukščiausias pastatas Lietuvoje su besisukančiu restoranu ir apžvalgos aikštele. Simbolinė vieta Sausio 13-osios istorijoje."
  },
  {
    id: "10",
    title: "Lukiškių kalėjimas 2.0",
    coords: { latitude: 54.6891, longitude: 25.2757 },
    url: "https://www.lukiskiukalejimas.lt/",
    address: "Lukiškių skg. 6, Vilnius",
    category: "museum",
    description: "Buvęs kalėjimas, dabar – kultūros ir meno erdvė. Įspūdinga atmosfera su ekskursijomis ir renginiais."
  },
  {
    id: "11",
    title: "Televizijos bokštas",
    coords: { latitude: 54.1822, longitude: 25.2133 },
    url: "https://www.tvbokstas.lt/",
    address: "Sausio 13-osios g. 10, Vilnius (tolimesnis taškas)",
    category: "museum",
    description: "Aukštai nuo miesto šurmulio – vieta su istorija ir panoraminiais vaizdais. Lankytina ir nuošalesnė versija."
  },
  {
    id: "12",
    title: "Lukiškių kalėjimas 2.0",
    coords: { latitude: 54.6891, longitude: 25.1757 },
    url: "https://www.lukiskiukalejimas.lt/",
    address: "Lukiškių skg. 6, Vilnius (kita lokacija)",
    category: "museum",
    description: "Alternatyvi Lukiškių kalėjimo lokacija – urbanistinė, eksperimentinė, skirta performansams ir kūrybai."
  },
];

const VINGIO_IMG = require("@/src/assets/images/vingio-parkas.png")
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
              source={VINGIO_IMG}
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
                  fake: encodeURIComponent(JSON.stringify(fakePoints)),
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

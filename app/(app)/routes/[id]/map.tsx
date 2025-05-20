import React from "react";
import { useLocalSearchParams } from "expo-router";
import { Box } from "native-base";
import Map from "@/src/components/map/map";
import { useGetRoutePlacesQuery } from "@/src/store/travelApi";
import Spinner from "@/src/components/ui/Spinner";

export interface TourPoint {
  id: string;
  title: string;
  coords: {
    latitude: number;
    longitude: number;
  };
  url: string;
  address: string;
  category?: "museum" | "nature" | "food";
  description: string;
}

export default function RouteMapScreen() {
  const { id, fake, routeName } = useLocalSearchParams();

  const routeId = Array.isArray(id) ? parseInt(id[0], 10) : parseInt(id ?? "", 10);
  const fakeData: TourPoint[] | null = fake
    ? JSON.parse(decodeURIComponent(fake as string))
    : null;

  // Jei turim fake duomenis – rodom juos
  if (fakeData) {
    return <Map title={`${routeName}`} points={fakeData} />;
  }

  // Naudojam travelApi, kad gauti tikrus taškus
  const {
    data: places,
    isLoading,
    isError,
  } = useGetRoutePlacesQuery(routeId, { skip: !routeId });

  // Rodom spinner, kol gaunam duomenis
  if (isLoading || !places) {
    return <Spinner/>
  }

  // Transformuojam į TourPoint[]
  const points: TourPoint[] = places.map((p: any) => ({
    id: String(p.id),
    title: p.name,
    coords: {
      latitude: parseFloat(p.latitude),
      longitude: parseFloat(p.longitude),
    },
    url: p.media?.[0]?.url ?? "",
    address: p.address ?? "",
    description: p.description ?? "",
    category: p.category?.slug ?? undefined,
  }));

  return <Map title={`${routeName}`} points={points} />;
}

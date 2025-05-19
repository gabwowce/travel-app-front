import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { useAppDispatch, useAppSelector } from "@/src/data/hooks";
import { Box, Spinner } from "native-base";
import Map from "@/src/components/map/map";
import { fetchRoutePlaces } from "@/src/data/features/routes/routesThunks";

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
const routeId = Array.isArray(id) ? parseInt(id[0]) : parseInt(id ?? "");
const fakeData = fake ? JSON.parse(decodeURIComponent(fake as string)) : null;
useEffect(() => {
  if (fakeData) {
    setPoints(fakeData);
    return; // praleidžiam fetchinimą
  }

  if (routeId) {
    dispatch(fetchRoutePlaces(routeId))
      .unwrap()
      .then((places) => {
        const mapped = places.map((p: any) => ({
          id: String(p.id),
          title: p.name,
          coords: {
            latitude: parseFloat(p.latitude),
            longitude: parseFloat(p.longitude),
          },
          url: p.media?.[0]?.url ?? "",
          address: p.address ?? "",
          description: p.description ?? "",
        }));
        setPoints(mapped);
      });
  }
}, [routeId]);
  const dispatch = useAppDispatch();
  const [points, setPoints] = useState<TourPoint[]>([]);
  const loading = useAppSelector((s) => s.routes.loading);

  useEffect(() => {
    if (routeId) {
      dispatch(fetchRoutePlaces(routeId))
        .unwrap()
        .then((places: any[]) => {
          const mapped = places.map((p) => ({
            id: String(p.id),
            title: p.name,
            coords: {
              latitude: parseFloat(p.latitude),
              longitude: parseFloat(p.longitude),
            },
            url: p.media?.[0]?.url ?? "",
            address: p.address ?? "",
            description: p.description ?? "",
          }));
          setPoints(mapped);
        });
    }
  }, [routeId]);

  if (loading && points.length === 0) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center">
        <Spinner size="lg" />
      </Box>
    );
  }

  return <Map title={`${routeName}`} points={fakeData} />;
}

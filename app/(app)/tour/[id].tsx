import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { useAppDispatch, useAppSelector } from "@/src/data/hooks";
import { fetchRouteById, selectRouteById } from "@/src/data/features/routes/routesSlice";
import { Box, Spinner, Text } from "native-base";
import Map from "@/src/components/map/map";

export interface TourPoint {
  id: string;
  title: string;
  coords: {
    latitude: number;
    longitude: number;
  };
  url: string;
}

export default function TourDetails() {
  const { id } = useLocalSearchParams();
  const tourId = Array.isArray(id) ? id[0] : id;

  const dispatch = useAppDispatch();
  const route = useAppSelector(selectRouteById);
  const loading = useAppSelector((state) => state.routes.loading);
  const error = useAppSelector((state) => state.routes.error);
  
  const [points, setPoints] = useState<TourPoint[]>([]);


  useEffect(() => {
    if (tourId) {
      dispatch(fetchRouteById(Number(tourId)));
    }
  }, [dispatch, tourId]);


  useEffect(() => {
    if (tourId) {
      dispatch(fetchRouteById(Number(tourId)));
    }
  }, [dispatch, tourId]);

  useEffect(() => {
    if (route?.geo_json) {
      try {
        const geoJson = JSON.parse(route.geo_json);
        if (geoJson.type === "LineString" && geoJson.coordinates) {
          const mappedPoints = geoJson.coordinates.map((coord: number[], index: number) => ({
            id: `${index}`,
            title: `${route.name} - Point ${index + 1}`,
            coords: { latitude: coord[1], longitude: coord[0] },
            url: "",
          }));
          setPoints(mappedPoints);
        }
      } catch (err) {
        console.error("❌ Failed to parse geoJSON:", err);
      }
    }
  }, [route]);

  

  if (loading) {
    return (
      <Box flex={1} alignItems="center" justifyContent="center">
        <Spinner size="lg" color="primary.500" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box flex={1} alignItems="center" justifyContent="center">
        <Text color="red.500">Error loading tour details: {error}</Text>
      </Box>
    );
  }

  return <Map title={route?.name || "Tour"} points={points} />;
}

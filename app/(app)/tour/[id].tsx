import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { useAppDispatch, useAppSelector } from "@/src/data/hooks";
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
  // const { id } = useLocalSearchParams(); ← nebereikia kol kas
  // const tourId = Array.isArray(id) ? id[0] : id;

  const dispatch = useAppDispatch();
  // const route = useAppSelector(selectRouteById);
  // const loading = useAppSelector((state) => state.routes.loading);
  // const error = useAppSelector((state) => state.routes.error);
  
  const [points, setPoints] = useState<TourPoint[]>([]);

  useEffect(() => {
    // TESTINIAI DUOMENYS
    const testPoints: TourPoint[] = [
      {
        id: "1",
        title: "Start point",
        coords: { latitude: 54.6872, longitude: 25.2797 },
        url: "",
      },
      {
        id: "2",
        title: "Middle point",
        coords: { latitude: 54.6890, longitude: 25.2850 },
        url: "",
      },
      {
        id: "3",
        title: "End point",
        coords: { latitude: 54.6905, longitude: 25.2903 },
        url: "",
      },
    ];
    setPoints(testPoints);
  }, []);

  return (
    <Map title="Test Tour" points={points} />
  );
}

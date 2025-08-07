// src/hooks/useRouteMapData.ts
import { useLocalSearchParams } from "expo-router";
import { Place, useGetRoutePlacesQuery } from "@/src/store/travelApi";
import { placeToPoint } from "@/src/utils/placeToPoint";
import type { TourPoint } from "@/src/types/tourPoint"; // jei turite atskirame faile

export function useRouteMapData() {
  /* 1) ID ir routeName iš params */
  const { id, routeName } = useLocalSearchParams();
  const routeId = Array.isArray(id) ? +id[0] : +(id ?? "");

  /* 2) API užklausa */
  const {
    data: placesResponse,
    isLoading,
    isError,
  } = useGetRoutePlacesQuery({ route: String(routeId) }, { skip: !routeId });

  /* 3) Konvertuojam Place[] → TourPoint[] vienu sakiniu */
  const points: TourPoint[] | null =
    placesResponse?.data?.map(placeToPoint) ?? null;

  /* 4) Pavadinimas */
  const title =
    typeof routeName === "string" && routeName.length ? routeName : "Tour";

  return { points, title, isLoading, isError };
}

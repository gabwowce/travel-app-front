// src/hooks/useRouteMapData.ts
import { useLocalSearchParams } from "expo-router";
import { useGetRoutePlacesQuery } from "@/src/store/travelApi";

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

export function useRouteMapData() {
  const { id, fake, routeName } = useLocalSearchParams();

  const routeId = Array.isArray(id)
    ? parseInt(id[0], 10)
    : parseInt(id ?? "", 10);

  const decodedFakeData: TourPoint[] | null = fake
    ? JSON.parse(decodeURIComponent(fake as string))
    : null;

  const {
    data: places,
    isLoading,
    isError,
  } = useGetRoutePlacesQuery({ route: String(routeId) }, { skip: !routeId });

  const title = typeof routeName === "string" ? routeName : "Tour";

  const points: TourPoint[] | null = decodedFakeData
    ? decodedFakeData
    : (places?.data?.map((p: any) => ({
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
      })) ?? null);

  return {
    points,
    title,
    isLoading,
    isError,
  };
}

// utils/placeToPoint.ts
import { Place } from "@/src/store/travelApi";
import { TourPoint } from "@/src/types/tourPoint";

export function placeToPoint(p: Place): TourPoint {
  return {
    id: String(p.id ?? ""), // fallback, jei id null
    title: p.name ?? "Untitled place",
    coords: {
      latitude: +(p.latitude ?? 0),
      longitude: +(p.longitude ?? 0),
    },
    url: (p.media?.[0] as any)?.url ?? "",
    address: p.address ?? "",
    description: p.description ?? "",
    category: (p as any).category?.slug as
      | "museum"
      | "nature"
      | "food"
      | undefined,
  };
}

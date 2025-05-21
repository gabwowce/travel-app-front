// src/components/ui/FeaturedRoutesRow.tsx
import { ScrollView, Text, HStack } from "native-base";
import Spinner from "@/src/components/ui/Spinner";
import { TourCard } from "@/src/components/tour/TourCard";
import { Route } from "@/src/store/travelApi";
import { IMAGES } from "@/src/config/images";

export default function FeaturedRoutesRow({
  routes,
  loading,
  error,
}: {
  routes: Route[];
  loading: boolean;
  error?: any;
}) {
  if (loading) return <Spinner />;
  if (error)
    return (
      <Text color="red.500" px={5}>
        Failed to load tours.
      </Text>
    );
  if (routes.length === 0)
    return <Text px={5}>No featured routes available.</Text>;

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <HStack space={4} px={5}>
        {routes.map((route) => (
          <TourCard
            key={route.id}
            id={String(route.id)}
            image={IMAGES.VINGIO_PARKAS}
            title={route.name ?? "Unnamed"}
            rating={(route as any).ratings_avg_rating ?? 0}
            location={`${route.city?.name ?? "Unknown"}, ${route.city?.country?.name ?? "Unknown"}`}
          />
        ))}
      </HStack>
    </ScrollView>
  );
}

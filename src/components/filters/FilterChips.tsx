// src/components/filters/FilterChips.tsx
import { RouteFilters } from "@/src/data/features/types/routeFilters";
import {
  useGetCategoriesQuery,
  useGetCitiesQuery,
  useGetCountriesQuery,
} from "@/src/store/travelApi";
import { Ionicons } from "@expo/vector-icons";
import { Badge, Box, HStack, Icon, Pressable, Text } from "native-base";
import React, { useMemo } from "react";

type Props = {
  filters: RouteFilters;
  onClear?: () => void;
};

function normalize(resp: unknown): { id: number; name: string }[] {
  if (Array.isArray(resp)) {
    return resp.map((i: any) => ({ id: Number(i?.id), name: String(i?.name) }));
  }
  if (resp && typeof resp === "object" && "data" in (resp as any)) {
    const data = (resp as any).data;
    if (Array.isArray(data)) {
      return data.map((i: any) => ({
        id: Number(i?.id),
        name: String(i?.name),
      }));
    }
  }
  return [];
}

export default function FilterChips({ filters, onClear }: Props) {
  const needCat = !!filters.categoryId;
  const needCountry = !!filters.countryId;
  const needCity = !!filters.countryId && !!filters.cityId;

  const { data: catsResp } = useGetCategoriesQuery(undefined, {
    skip: !needCat,
    refetchOnMountOrArgChange: false,
  });
  const { data: countriesResp } = useGetCountriesQuery(undefined, {
    skip: !needCountry,
    refetchOnMountOrArgChange: false,
  });
  const { data: citiesResp } = useGetCitiesQuery(
    needCity ? { countryId: filters.countryId! } : (undefined as any),
    { skip: !needCity, refetchOnMountOrArgChange: false }
  );

  const cats = useMemo(() => normalize(catsResp), [catsResp]);
  const countries = useMemo(() => normalize(countriesResp), [countriesResp]);
  const cities = useMemo(() => normalize(citiesResp), [citiesResp]);

  const categoryName = cats.find((c) => c.id === filters.categoryId)?.name;
  const countryName = countries.find((c) => c.id === filters.countryId)?.name;
  const cityName = cities.find((c) => c.id === filters.cityId)?.name;

  const makeDistanceLabel = (min?: number, max?: number) => {
    if (min != null && max != null) return `${min}–${max} km`;
    if (min != null) return `≥ ${min} km`;
    if (max != null) return `≤ ${max} km`;
    return null;
  };

  const chips: string[] = [];
  if (filters.difficulty) chips.push(`Difficulty: ${filters.difficulty}`);
  if (filters.categoryId)
    chips.push(`Category: ${categoryName ?? `#${filters.categoryId}`}`);
  if (filters.countryId)
    chips.push(`Country: ${countryName ?? `#${filters.countryId}`}`);
  if (filters.cityId) chips.push(`City: ${cityName ?? `#${filters.cityId}`}`);
  if (filters.minRating != null && filters.minRating > 0)
    chips.push(`Rating ≥ ${filters.minRating}`);

  const distLabel = makeDistanceLabel(filters.minDistance, filters.maxDistance);
  if (distLabel) chips.push(distLabel);

  if (filters.search?.trim()) chips.push(`“${filters.search.trim()}”`);
  if (!chips.length) return null;

  return (
    <Box w="100%" pb={4}>
      <Box flexDirection="row" flexWrap="wrap" alignItems="center">
        {chips.map((chip, idx) => (
          <Badge
            key={idx}
            variant="subtle"
            colorScheme="primary"
            borderRadius="full"
            px={3}
            py={1.5}
            mr={2}
            mb={2}
          >
            <Text fontSize="xs" color="primary.800" noOfLines={1}>
              {chip}
            </Text>
          </Badge>
        ))}

        {onClear && (
          <Pressable
            onPress={onClear}
            accessibilityRole="button"
            accessibilityLabel="Clear all filters"
            borderRadius="full"
            px={3}
            py={1.5}
            mr={2}
            mb={2}
            bg="primary.100"
            _pressed={{ opacity: 0.85 }}
          >
            <HStack alignItems="center" space={1}>
              <Icon
                as={Ionicons}
                name="funnel-outline"
                size="sm"
                color="red.400"
              />
              <Text fontSize="xs" color="red.400">
                Clear all filters
              </Text>
            </HStack>
          </Pressable>
        )}
      </Box>
    </Box>
  );
}

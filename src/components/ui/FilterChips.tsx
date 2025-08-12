import React, { useMemo } from "react";
import { Box, HStack, Pressable, Text, Button } from "native-base";
import {
  useGetCategoriesQuery,
  useGetCountriesQuery,
  useGetCitiesQuery,
} from "@/src/store/travelApi";

type Props = {
  filters: {
    categoryId?: number;
    countryId?: number;
    cityId?: number;
    minRating?: number;
    maxDistance?: number;
    search?: string;
  };
  onClear?: () => void;
};

// Saugus normalizatorius: veikia tiek su masyvu, tiek su { data: [] }
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

  // KVIEČIAM TIK JEI REIKIA
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

  const chips: string[] = [];
  if (filters.categoryId)
    chips.push(`Category: ${categoryName ?? `#${filters.categoryId}`}`);
  if (filters.countryId)
    chips.push(`Country: ${countryName ?? `#${filters.countryId}`}`);
  if (filters.cityId) chips.push(`City: ${cityName ?? `#${filters.cityId}`}`);
  if (filters.minRating !== undefined)
    chips.push(`Rating ≥ ${filters.minRating}`);
  if (filters.maxDistance !== undefined)
    chips.push(`≤ ${filters.maxDistance} km`);
  if (filters.search?.trim()) chips.push(`“${filters.search.trim()}”`);

  if (!chips.length) return null;

  return (
    <Box>
      <HStack flexWrap="wrap" space={2}>
        {chips.map((chip, idx) => (
          <Pressable
            key={idx}
            accessibilityRole="text"
            accessibilityLabel={`Active filter: ${chip}`}
            bg="primary.100"
            borderRadius="full"
            px={3}
            py={1}
            mb={2}
          >
            <Text fontSize="xs" color="primary.800" isTruncated>
              {chip}
            </Text>
          </Pressable>
        ))}
      </HStack>

      {onClear && (
        <Button
          accessibilityRole="button"
          accessibilityLabel="Clear all active filters"
          variant="ghost"
          size="sm"
          colorScheme="primary"
          mt={2}
          mb={2}
          onPress={onClear}
        >
          Clear all filters
        </Button>
      )}
    </Box>
  );
}

import React from "react";
import { Box, HStack, Pressable, Text, Button } from "native-base";
import { useGetCategoriesQuery, useGetCountriesQuery, useGetCitiesQuery } from "@/src/store/travelApi";

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

export default function FilterChips({ filters, onClear }: Props) {
  const { data: cats } = useGetCategoriesQuery();
  const { data: countries } = useGetCountriesQuery();
  const { data: cities } = useGetCitiesQuery({});

  const categoryName = cats?.data?.find(c => c.id === filters.categoryId)?.name;
  const countryName  = countries?.data?.find(c => c.id === filters.countryId)?.name;
  const cityName     = cities?.data?.find(c => c.id === filters.cityId)?.name;

  const chips: string[] = [];

  if (filters.categoryId) {
    chips.push(`Category: ${categoryName ?? `#${filters.categoryId}`}`);
  }
  if (filters.countryId) {
    chips.push(`Country: ${countryName ?? `#${filters.countryId}`}`);
  }
  if (filters.cityId) {
    chips.push(`City: ${cityName ?? `#${filters.cityId}`}`);
  }
  if (filters.minRating) {
    chips.push(`Rating ≥ ${filters.minRating}`);
  }
  if (filters.maxDistance) {
    chips.push(`≤ ${filters.maxDistance} km`);
  }
  if (filters.search) {
    chips.push(`“${filters.search}”`);
  }

  if (!chips.length) return null;

  return (
    <Box >
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

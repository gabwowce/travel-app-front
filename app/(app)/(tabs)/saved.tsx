// screens/SavedScreen.tsx
import React from 'react';
import { Background } from '@/src/components/BGWrapper';
import { TourCard } from '@/src/components/TourCard';
import { Box, Text, ScrollView, Spinner } from 'native-base';
import { useGetFavoritesQuery } from '@/src/store/travelApi';

export default function SavedScreen() {
  const { data, isLoading, isError } = useGetFavoritesQuery();

  const favorites = data?.data ?? [];

  return (
    <Background>
      <Box flex={1} pt="121px" px={4}>
        <Text variant="header1Bold">Your Favorite Tours</Text>

        {isLoading && <Spinner mt={6} size="lg" color="primary.500" />}
        {isError && (
          <Text mt={6} color="red.500">
            Failed to load favorites.
          </Text>
        )}
        {!isLoading && !favorites.length && (
          <Text mt={6} color="gray.500">
            You haven't saved any tours yet.
          </Text>
        )}
        <ScrollView mt={4}>
          {favorites.map((route) => (
            <TourCard key={route.id} {...route} />
          ))}
        </ScrollView>
      </Box>
    </Background>
  );
}

// screens/SavedScreen.tsx
import React from 'react';
import { Background } from '@/src/components/BGWrapper';
import { TourCard } from '@/src/components/tour/TourCard';
import { Box, Text, ScrollView, Spinner } from 'native-base';
import { useGetUserFavoritesQuery } from '@/src/store/travelApi';

export default function SavedScreen() {
  const { data, isLoading, isError } = useGetUserFavoritesQuery({});

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
            <TourCard
              key={route.id}
              id={`${route.id}`}
              image={'https://via.placeholder.com/150'} // default image jei nėra
              title={route.name ?? ""}
              rating={route.ratings_avg ?? 0}
              location={route.city?.name ?? 'Unknown'}
            />
          ))}


        </ScrollView>
      </Box>
    </Background>
  );
}

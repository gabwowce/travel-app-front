import React, { useEffect } from "react";
import { Background } from "@/src/components/BGWrapper";
import { TourCard } from "@/src/components/TourCard";
import { Box, Text, ScrollView, VStack, HStack, Spinner } from "native-base";
import { useAppDispatch, useAppSelector } from "@/src/data/hooks";
import { fetchFavorites } from "@/src/data/features/favorites/favoritesSlice";


export default function SavedScreen() {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.favorites.items);
  const loading = useAppSelector((state) => state.favorites.loading);

  useEffect(() => {
    dispatch(fetchFavorites());
  }, [dispatch]);

  return (
    <Background>
      <Box flex={1} pt="121px">
        <Text variant="header1Bold">Your Favorite Tours</Text>
        {/* {loading ? <Spinner size="lg" color="primary.500" /> : (
          <ScrollView>{favorites.map((route) => <TourCard key={route.id} {...route} />)}</ScrollView>
        )} */}
      </Box>
    </Background>
  );
}

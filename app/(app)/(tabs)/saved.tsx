// app/(app)/saved/index.tsx
import React, { useState, useMemo } from "react";
import { Box, Text, VStack } from "native-base";
import { TouchableWithoutFeedback, Keyboard } from "react-native";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

import { useGetUserFavoritesQuery } from "@/src/store/travelApi";
import Header from "@/src/components/Header";
import FlexContainer from "@/src/components/layout/FlexContainer";
import SearchBar from "@/src/components/SearchBar";
import MiniTourCard from "@/src/components/MiniTourCard";
import PaginatedFlatList from "@/src/components/layout/PaginatedFlatList";
import ResponsiveTourListStatic from "@/src/components/tour/ResponsiveTourListStatic";


export default function SavedScreen() {
  const { data, isLoading, isError } = useGetUserFavoritesQuery({});
  const favorites = data?.data ?? [];

  const [searchTerm, setSearchTerm] = useState("");

  const filtered = useMemo(() => {
    if (!searchTerm.trim()) return favorites;
    const q = searchTerm.toLowerCase().trim();
    return favorites.filter((tour) => {
      const name = tour.name.toLowerCase();
      const city = tour.city?.name?.toLowerCase() ?? "";
      const country = tour.city?.country?.name?.toLowerCase() ?? "";
      return name.includes(q) || city.includes(q) || country.includes(q);
    });
  }, [favorites, searchTerm]);

  const ListHeader = (
    <VStack alignItems="center" mt={6} mb={4} space={4}>
      <SearchBar
        placeholder="Search favorites"
        value={searchTerm}
        onChangeText={setSearchTerm}
        onClear={() => setSearchTerm("")}
      />
    </VStack>
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <FlexContainer>
        <Header title="Your Favorite Tours" />

       <ResponsiveTourListStatic
    data={filtered}
    isFetching={isLoading}
    searchTerm={searchTerm}
    setSearchTerm={setSearchTerm}
    ListEmptyComponent={
      <Text mt={4} color="gray.500" textAlign="center">
        {favorites.length
          ? "No favorites match your search."
          : "You haven't saved any tours yet."}
      </Text>
    }
  />


      </FlexContainer>
    </TouchableWithoutFeedback>
  );
}

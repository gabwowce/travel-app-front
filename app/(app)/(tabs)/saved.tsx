// app/(app)/saved/index.tsx
import React from "react";
import { Text } from "native-base";
import { TouchableWithoutFeedback, Keyboard } from "react-native";

import Header from "@/src/components/Header";
import FlexContainer from "@/src/components/layout/FlexContainer";
import ResponsiveTourListStatic from "@/src/components/tour/ResponsiveTourListStatic";
import FavoritesListHeader from "@/src/components/ui/FavoritesListHeader";
import { useSavedScreenData } from "@/src/hooks/useSavedScreenData";
import useAnnounceForAccessibility from "@/src/hooks/useAnnounceForAccessibility";

export default function SavedScreen() {
  useAnnounceForAccessibility("Favorite tours screen opened");
  const { filtered, favorites, searchTerm, setSearchTerm, isLoading } =
    useSavedScreenData();

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <FlexContainer>
        {/* <Header title="Your Favorite Tours" /> */}

        <ResponsiveTourListStatic
          data={filtered}
          isFetching={isLoading}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          ListHeaderComponent={
            <FavoritesListHeader
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          }
          ListEmptyComponent={
            <Text mt={4} color="gray.500" textAlign="center" accessibilityLiveRegion="polite">
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

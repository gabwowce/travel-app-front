// app/(app)/saved/index.tsx
import React, { useLayoutEffect } from "react";
import { Text } from "native-base";
import { TouchableWithoutFeedback, Keyboard, View } from "react-native";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import Header from "@/src/components/Header";
import FlexContainer from "@/src/components/layout/FlexContainer";
import ResponsiveTourListStatic from "@/src/components/tour/ResponsiveTourListStatic";
import FavoritesListHeader from "@/src/components/ui/FavoritesListHeader";
import { useSavedScreenData } from "@/src/hooks/useSavedScreenData";
import useAnnounceForAccessibility from "@/src/hooks/useAnnounceForAccessibility";
import { useNavigation } from "expo-router";
import FilterCircleButton from "@/src/components/ui/btns/FilterButton";
import { ROUTE_KEY_SAVED } from "@/src/config/initialRouterFilters";

export default function SavedScreen() {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <FilterCircleButton routeKey={ROUTE_KEY_SAVED} />,
    });
  }, [navigation]);

  useAnnounceForAccessibility("Favorite tours screen opened");
  const { filtered, favorites, searchTerm, setSearchTerm, isLoading } =
    useSavedScreenData();
  const favArray = Array.isArray(favorites)
    ? favorites
    : Array.isArray((favorites as any)?.items)
      ? (favorites as any).items
      : [];

  const filteredArray = Array.isArray(filtered) ? filtered : favArray;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <FlexContainer>
        <ResponsiveTourListStatic
          data={filteredArray}
          isFetching={isLoading}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          ListEmptyComponent={
            <Text mt={4} color="gray.500" textAlign="center">
              {favArray.length
                ? "No favorites match your search."
                : "You haven't saved any tours yet."}
            </Text>
          }
        />
      </FlexContainer>
    </TouchableWithoutFeedback>
  );
}

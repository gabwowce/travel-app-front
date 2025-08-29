// app/(app)/saved/index.tsx
import FlexContainer from "@/src/components/layout/FlexContainer";
import ResponsiveTourListStatic from "@/src/components/tour/ResponsiveTourListStatic";
import useAnnounceForAccessibility from "@/src/hooks/useAnnounceForAccessibility";
import { useSavedScreenData } from "@/src/hooks/useSavedScreenData";
import { Text } from "native-base";
import React from "react";
import { Keyboard, TouchableWithoutFeedback } from "react-native";

export default function SavedScreen() {
  // const navigation = useNavigation();
  // useLayoutEffect(() => {
  //   navigation.setOptions({
  //     headerRight: () => <FilterCircleButton routeKey={ROUTE_KEY_SAVED} />,
  //   });
  // }, [navigation]);

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

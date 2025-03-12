import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ImageViewer from "./ImageViewer";
import { useRouter } from "expo-router"; // Navigacijai


import { Box, Text, Image, Button } from "native-base";
import { useAppDispatch, useAppSelector } from "@/src/data/hooks";
import { addFavorite, removeFavorite } from "@/src/data/features/favorites/favoritesSlice";
import { selectFavorites } from "@/src/data/features/favorites/favoritesSelectors";


interface TourCardProps {
  id: string; // Pridedame ID, kad galėtume perduoti turo duomenis
  image: any;
  title: string;
  rating: number;
  location: string;
}

export function TourCard({ id, image, title, rating, location }: TourCardProps) {
  const router = useRouter();

  const dispatch = useAppDispatch();
  const favorites = useAppSelector(selectFavorites);
  const isFavorite = favorites.some((route) => route.id === Number(id));

  // const handleFavoriteToggle = () => {
  //   if (isFavorite) {
  //     dispatch(removeFavorite(id));
  //   } else {
  //     dispatch(addFavorite(id));
  //   }
  // };

  return (
    <TouchableOpacity onPress={() => router.push(`/tour/${id}`)}> 
      <View style={styles.card}>
        {/* Nuotrauka su bookmark ikona */}
        <View style={styles.imageContainer}>
          <ImageViewer imgSource={image} />
          <Ionicons name="bookmark-outline" size={20} color="white" style={styles.bookmarkIcon} />
        </View>
        {/* <Button size="sm" mt="2" colorScheme={isFavorite ? "red" : "blue"} onPress={handleFavoriteToggle}>
          {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
        </Button> */}

        {/* Teksto dalis */}
        <View style={styles.textContainer}>
          <View style={styles.infoRow2}>
            <Text variant="bodyBold">{title}</Text>
            <View style={styles.infoRow}>
              <Ionicons name="star" size={16} color="#FACC15" />
              <Text variant="bodyGray">{rating.toFixed(1)}</Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={16} color="gray" />
            <Text variant="bodyGray">{location}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "auto",
    borderRadius: 24,
    backgroundColor: "#FFFCF9",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    alignSelf: "flex-start"
  },
  imageContainer: {
    position: "relative",
    padding: 14
  },
  bookmarkIcon: {
    position: "absolute",
    top: 24,
    right: 24,
    backgroundColor: "rgba(0,0,0,0.2)",
    padding: 5,
    borderRadius: 20,
  },
  textContainer: {
    paddingTop: 0,
    paddingRight: 20,
    paddingBottom: 20,
    paddingLeft: 20,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  infoRow2: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 5,
  },
});

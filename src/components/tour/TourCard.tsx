import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ImageViewer from "../ImageViewer";
import { useRouter } from "expo-router"; // Navigacijai


import { Box, Text, Image, Button } from "native-base";
import { useAppDispatch } from "@/src/data/hooks";
import { useWindowDimensions } from "react-native";
import { useBreakpointValue } from "native-base";

import FavoriteButton from '@/src/components/ui/btns/FavoriteButton';

interface TourCardProps {
  id: string; 
  image: any;
  title: string;
  rating: number;
  location: string;
}

export function TourCard({ id, image, title, rating, location }: TourCardProps) {
  const router = useRouter();
  const { width: screenW } = useWindowDimensions();
  const cardW = useBreakpointValue({
    base: 0.9 * screenW,  // xs-sm: beveik visas ekranas
    sm:   0.6 * screenW,  // ~2 kortelės
    md:   0.4 * screenW,  // ~3 kortelės
    lg:   0.3 * screenW,  // ~4 kortelės
    xl:   0.25 * screenW, // ~5 kortelių
  });

  // skirtingas nuotraukos santykis (jei reikia)
  const imgRatio = useBreakpointValue({
    base: 4 / 3,
    sm:   4 / 3,
    md:   16 / 11,
    lg:   16 / 9,
  });

  return (
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "/routes/[id]",
            params: {
              id,
              title,
              image: image.uri,
              rating: rating.toString(),
              location,
            },
          })
        }
      >

      <View style={[styles.card, { width: cardW }]}>

        {/* Nuotrauka su bookmark ikona */}
        <View style={styles.imageContainer}>
          <View
            style={[
              styles.imageWrapper,
              {width: "100%",},{ aspectRatio: imgRatio }
            ]}
          >
            <ImageViewer imgSource={image} />
          </View>
          {/* <Ionicons name="bookmark-outline" size={20} color="white" style={styles.bookmarkIcon} /> */}
          <FavoriteButton routeId={Number(id)} style={styles.bookmarkIcon}/>
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
  imageWrapper: {
    width: "100%",
    aspectRatio: 16 / 9, // Galima keisti į 4/3 arba pan.
    borderRadius: 12,
    overflow: "hidden",
  },
});

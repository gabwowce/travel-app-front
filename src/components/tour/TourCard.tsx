import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Text, useBreakpointValue } from "native-base";
import React from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
// 👇 pridėk
import PressableLog from "@/src/components/PressableLog";

import FavoriteButton from "@/src/components/ui/btns/FavoriteButton";
import ImageViewer from "../ImageViewer";
import RatingText from "../ui/RatingText";

interface TourCardProps {
  id: string;
  image: any;
  title: string;
  rating: number;
  location: string;
  accessibilityLabel?: string;
  isFavorite?: boolean;
}

export function TourCard({
  id,
  image,
  title,
  rating,
  location,
  accessibilityLabel,
  isFavorite,
}: TourCardProps) {
  const router = useRouter();
  const { width: screenW } = useWindowDimensions();

  const cardW = useBreakpointValue({
    base: 0.9 * screenW,
    sm: 0.6 * screenW,
    md: 0.4 * screenW,
    lg: 0.3 * screenW,
    xl: 0.25 * screenW,
  });

  const imgRatio = useBreakpointValue({
    base: 4 / 3,
    sm: 4 / 3,
    md: 16 / 11,
    lg: 16 / 9,
  });

  return (
    <PressableLog
      analyticsLabel={`Open tour: ${title}`}
      accessibilityRole="button"
      accessibilityLabel={
        accessibilityLabel ??
        `Open tour: ${title}, located in ${location}, rating ${rating} stars`
      }
      onPress={() =>
        router.push({
          pathname: "/routes/[id]",
          params: {
            id, // string ok
            title,
            image: image?.uri,
            rating: String(rating),
            location,
            is_favorite: isFavorite ? "1" : "0",
          },
        })
      }
      // pressed efektas kaip su TouchableOpacity activeOpacity
      style={({ pressed }) => [
        styles.card,
        { width: cardW },
        pressed && styles.pressed,
      ]}
      testID={`tour-card-${id}`}
    >
      {/* Nuotrauka + bookmark */}
      <View style={styles.imageContainer}>
        <View style={[styles.imageWrapper, { aspectRatio: imgRatio }]}>
          <ImageViewer imgSource={image} />
        </View>

        <FavoriteButton
          routeId={Number(id)}
          initialSelected={!!isFavorite}
          style={styles.bookmarkIcon}
        />
      </View>

      {/* Tekstas */}
      <View style={styles.textContainer}>
        <View style={styles.infoRow2}>
          <Text variant="bodyBold">{title}</Text>
          <View style={styles.infoRow}>
            <Ionicons
              name="star"
              size={16}
              color="#FACC15"
              importantForAccessibility="no"
              accessibilityElementsHidden
            />
            <RatingText
              value={rating}
              variant="bodyGray"
              accessibilityLabel={`Rating: ${rating} stars`}
            />
          </View>
        </View>
        <View style={styles.infoRow}>
          <Ionicons
            name="location-outline"
            size={16}
            color="gray"
            importantForAccessibility="no"
            accessibilityElementsHidden
          />
          <Text variant="bodyGray">{location}</Text>
        </View>
      </View>
    </PressableLog>
  );
}

const SHADOW = {
  shadowColor: "#000",
  shadowOpacity: 0.08,
  shadowOffset: { width: 1, height: 2 },
  shadowRadius: 2,
  elevation: 4,
};

const styles = StyleSheet.create({
  card: {
    margin: 5,
    width: "auto",
    borderRadius: 24,
    backgroundColor: "#FFFCF9",
    alignSelf: "flex-start",
    ...SHADOW,
  },
  pressed: { opacity: 0.9 },
  imageContainer: { position: "relative", padding: 14 },
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
    aspectRatio: 16 / 9,
    borderRadius: 12,
    overflow: "hidden",
  },
});

export default TourCard;

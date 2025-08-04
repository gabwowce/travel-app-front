// components/MiniTourCard.tsx
import React from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Route } from "@/src/store/travelApi";
import ImageViewer from "../components/ImageViewer";
import { Text } from "native-base";
import { IMAGES } from "@/src/config/images";

import { useBreakpointValue } from "native-base";
import RatingText from "./ui/RatingText";

interface MiniTourCardProps {
  tour: Route;
  onPress?: () => void;
}

export const MiniTourCard: React.FC<MiniTourCardProps> = ({
  tour,
  onPress,
}) => {
  const { width: screenW } = useWindowDimensions();
  const cardW = useBreakpointValue({
    base: screenW * 0.9, // xs-sm: viena kortelė per visą plotį
    sm: screenW * 0.4, // ~2 kortelės vienoje eilėje
    md: screenW * 0.28, // ~3 kortelės
    lg: screenW * 0.26, // ~4 kortelės
  });
  const handlePress =
    onPress ??
    (() =>
      router.push({
        pathname: "/routes/[id]",
        params: { id: tour.id },
      }));

  return (
    /* Išorinis sluoksnis ⇒ meta-šešėlis ir radius */
    <View style={[styles.shadowWrapper, { width: cardW }]}>
      {/* Vidinis sluoksnis ⇒ viskas inside + overflow:hidden */}
      <TouchableOpacity
        style={styles.card}
        onPress={handlePress}
        activeOpacity={0.9}
        accessibilityRole="button"
  accessibilityLabel={`Open tour: ${tour.name}, located in ${tour.city?.name}, ${tour.city?.country?.name}, rating ${tour.ratings_avg_rating ?? "unrated"} stars`}
      >
        {/* -------- Nuotrauka -------- */}
        <View style={styles.imageContainer}>
          <View style={styles.imageWrapper}>
            <ImageViewer imgSource={IMAGES.TRAKU_PILIS} />
          </View>
        </View>

        {/* -------- Tekstas -------- */}
        <View style={styles.textContainer}>
          <Text variant="bodyBoldsm" numberOfLines={1}>
            {tour.name}
          </Text>

          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={14} color="gray" importantForAccessibility="no"
  accessibilityElementsHidden/>
            <Text variant="bodyGraysm" ml={1} numberOfLines={1}>
              {tour.city?.name}, {tour.city?.country?.name}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="star" size={13} color="#FACC15" importantForAccessibility="no"
  accessibilityElementsHidden/>
            <RatingText value={tour.ratings_avg_rating} variant="bodyGraysm"  accessibilityLabel={`Rating: ${tour.ratings_avg_rating ?? "unrated"} stars`}/>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const SHADOW = {
  shadowColor: "#000",
  shadowOpacity: 0.08,
  shadowOffset: { width: 0, height: 4 },
  shadowRadius: 12,
  // Android
  elevation: 4,
};

const styles = StyleSheet.create({
  /* išorinis wrapperis – neprarandame šešėlio su overflow:hidden */
  shadowWrapper: {
    margin: 0,
    marginBottom: 20,
    borderRadius: 24,
    ...SHADOW,
  },
  /* vidinis kortelės turinys */
  card: {
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  },
  imageContainer: {
    position: "relative",
    padding: 14,
  },
  imageWrapper: {
    width: "100%",
    aspectRatio: 16 / 11,
    borderRadius: 12,
    overflow: "hidden",
  },
  ratingBadge: {
    position: "absolute",
    top: 24,
    left: 24,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.35)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
  },
  textContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
});

export default MiniTourCard;

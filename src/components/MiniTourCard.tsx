import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Route } from "@/src/data/features/routes/routesThunks";
const VINGIO_IMG = require("../assets/images/traku-pilis.jpg");

interface TourCardProps {
  tour: Route;
  onPress?: () => void;
}

const MiniTourCard: React.FC<TourCardProps> = ({ tour, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {tour.media?.length > 0 && (
        // <Image source={{ uri: tour.media[0]?.url }} style={styles.cardImage} />
        <Image
          source={VINGIO_IMG}
          style={styles.cardImage}
          resizeMode="cover"
        />
      )}
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{tour.name}</Text>
        <Text style={styles.cardLocation}>
          📍 {tour.city?.name}, {tour.city?.country?.name}
        </Text>
        <Text style={styles.cardRating}>
          ⭐ {tour.ratings_avg_rating ? tour.ratings_avg_rating.toFixed(1) : "N/A"}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "#fff",
    overflow: "hidden",
    marginBottom: 15,
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  cardImage: {
    width: "100%",
    height: 120,
  },
  cardContent: {
    padding: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  cardLocation: {
    fontSize: 14,
    color: "gray",
  },
  cardRating: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ff8c00",
  },
});

export default MiniTourCard;

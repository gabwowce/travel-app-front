import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getDistanceLabel } from "./getDistanceLabel";
import { TourPoint } from "../map/map";

interface Props {
  point: TourPoint;
  userLocation: { latitude: number; longitude: number };
  onSelect?: (point: TourPoint) => void;
}

export default function TourPointItem({
  point,
  userLocation,
  onSelect,
}: Props) {
  const distanceLabel = getDistanceLabel(userLocation, point.coords);

  return (
    <TouchableOpacity onPress={() => onSelect?.(point)} activeOpacity={0.8}>
      <View style={styles.container}>
        {/* Kairė pusė: ikonėlė ir tekstas */}
        <View style={styles.left}>
        <Ionicons name="location-sharp" color="#FF6347" size={20} style={styles.icon} />
          <View style={styles.textGroup}>
            <Text style={styles.title}>{point.title}</Text>
            <Text style={styles.address}>{point.address}</Text>
          </View>
        </View>

        {/* Dešinė pusė: atstumas */}
        <Text style={styles.distance}>{distanceLabel}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  left: {
    flexDirection: "row",
    alignItems: "flex-start",
    flex: 1,
  },
  icon: {
    marginRight: 10,
    marginTop: 2,
  },
  textGroup: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
  },
  address: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  distance: {
    fontSize: 14,
    fontWeight: "500",
    color: "#444",
    marginTop: 2,
    marginLeft: 8,
  },
});

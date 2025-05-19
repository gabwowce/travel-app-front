import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  Platform,
  StyleSheet,
  Share,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { TourPoint } from "../map/map";
import { getDistanceLabel } from "@/src/components/tour/getDistanceLabel";

interface Props {
  point: TourPoint;
  userLocation?: { latitude: number; longitude: number } | null;
}

export default function SelectedTourPointDetails({ point, userLocation }: Props) {
  const openNavigation = () => {
    const { latitude, longitude } = point.coords;
    const url = Platform.select({
      ios: `maps://?daddr=${latitude},${longitude}`,
      android: `google.navigation:q=${latitude},${longitude}`,
    });
    Linking.openURL(url!);
  };

  const handleShare = () => {
    Share.share({
      message: `${point.title} – ${point.url}`,
    });
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>{point.title}</Text>
      <Text style={styles.address}>{point.address}</Text>

      {userLocation && (
        <Text style={styles.distance}>
          📏 Distance: {getDistanceLabel(userLocation, point.coords)}
        </Text>
      )}

      <TouchableOpacity onPress={() => Linking.openURL(point.url)}>
        <Text style={styles.link}>{point.url}</Text>
      </TouchableOpacity>

      <View style={styles.buttons}>
        {/* <TouchableOpacity style={styles.button}>
          <Ionicons name="bookmark-outline" size={20} color="#666" />
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity> */}

        <TouchableOpacity style={styles.button} onPress={handleShare}>
          <Ionicons name="share-social-outline" size={20} color="#666" />
          <Text style={styles.buttonText}>Share</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={openNavigation}>
          <Ionicons name="navigate-outline" size={20} color="#1E90FF" />
          <Text style={styles.buttonText}>Navigate</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Photos</Text>
        {/* media render in future */}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.sectionText}>{point.description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
  },
  address: {
    fontSize: 14,
    color: "#555",
    marginBottom: 6,
  },
  distance: {
    backgroundColor: "#F0F0F0",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    fontSize: 13,
    color: "#333",
    marginBottom: 8,
  },
  link: {
    fontSize: 14,
    color: "#1E90FF",
    textDecorationLine: "underline",
    marginBottom: 16,
  },
  buttons: {
    flexDirection: "row",
    gap: 12,
    flexWrap: "wrap",
    marginBottom: 24,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#f3f3f3",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  section: {
    backgroundColor: "#FAFAFA",
    borderRadius: 12,
    borderColor: "#E0E0E0",
    borderWidth: 1,
    padding: 12,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  sectionText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#444",
  },
});

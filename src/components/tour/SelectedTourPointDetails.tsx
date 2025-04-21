import React from "react";
import { View, Text, TouchableOpacity, Linking, Platform, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { TourPoint } from "../map/map";

interface Props {
  point: TourPoint;
}

export default function SelectedTourPointDetails({ point }: Props) {
  const openNavigation = () => {
    const { latitude, longitude } = point.coords;
    const url = Platform.select({
      ios: `maps://?daddr=${latitude},${longitude}`,
      android: `google.navigation:q=${latitude},${longitude}`,
    });
    Linking.openURL(url!);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{point.title}</Text>
      <Text
        style={styles.link}
        onPress={() => Linking.openURL(point.url)}
      >
        {point.url}
      </Text>
      <Text style={styles.hint}>📍 Šis taškas pasirinktas</Text>

      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => Linking.openURL(point.url)}
        >
          <Ionicons name="information-circle-outline" size={22} color="#888" />
          <Text style={styles.iconLabel}>Info</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={openNavigation}
        >
          <Ionicons name="navigate-outline" size={22} color="#1E90FF" />
          <Text style={styles.iconLabel}>Naviguoti</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  link: {
    fontSize: 14,
    color: "#1E90FF",
    textDecorationLine: "underline",
  },
  hint: {
    marginTop: 8,
    fontSize: 12,
    color: "#888",
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 16,
    marginTop: 16,
  },
  iconButton: {
    alignItems: "center",
    flexDirection: "row",
    gap: 6,
    backgroundColor: "#f1f1f1",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  iconLabel: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
});

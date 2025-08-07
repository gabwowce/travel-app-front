import React from "react";
import * as SplashScreen from "expo-splash-screen";
import { Box, Center, Text } from "native-base";
import { LinearGradient } from "expo-linear-gradient";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import useAnnounceForAccessibility from "@/src/hooks/useAnnounceForAccessibility";

export default function LoadingScreen() {
  useAnnounceForAccessibility("Loading, please wait …");

  return (
    <LinearGradient
      importantForAccessibility="no"
      colors={["#90DAEE", "#C3F1D5"]}
      style={[StyleSheet.absoluteFillObject, styles.linearGradient]}
    >
      <ActivityIndicator
        size="large"
        color="#0C2736"
        accessibilityRole="progressbar"
        accessibilityLabel="Loading, please wait"
        accessibilityLiveRegion="assertive"
        accessibilityState={{ busy: true }}
        style={styles.spinner}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  spinner: {
    justifyContent: "center",
    alignItems: "center",
  },
});

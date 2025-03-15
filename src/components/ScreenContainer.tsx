import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ScreenContainerProps {
  children: React.ReactNode;
  style?: ViewStyle; // ✅ Priimame papildomą stilių
  variant?: "center" | "top"; // ✅ Pridedame variantą
}

export default function ScreenContainer({ children, style, variant = "center" }: ScreenContainerProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        variant === "top"
          ? { paddingTop: insets.top + 90, justifyContent: "flex-start" } // Top išdėstymas su padding
          : { paddingTop: insets.top + 0, justifyContent: "center" }, // Center išdėstymas
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingHorizontal: 32,
  },
});

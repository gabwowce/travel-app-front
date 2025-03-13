import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ScreenContainerProps {
  children: React.ReactNode;
  style?: ViewStyle; // ✅ Priimame papildomą stilių
}

export default function ScreenContainer({ children, style }: ScreenContainerProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 80 }, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
});

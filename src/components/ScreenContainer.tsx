import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

interface ScreenContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: "center" | "top";
  topOffset?: number;
}

export default function ScreenContainer({
  children,
  style,
  variant = "center",
  topOffset = 0,
}: ScreenContainerProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        variant === "top"
          ? { paddingTop: insets.top + topOffset, justifyContent: "flex-start" }
          : { paddingTop: insets.top, justifyContent: "center" },
      ]}
    >
      <View style={[styles.inner, style]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    alignItems: "center", 
    justifyContent: "center",
    paddingHorizontal:wp("3%")
  },
  inner: {
    width: "100%",
    alignSelf: "center",
    maxWidth: 600,
  },
  
});

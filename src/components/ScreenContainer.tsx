import React from "react";
import {
  View,
  StyleSheet,
  ViewStyle,
  ViewProps,
  AccessibilityRole,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

interface ScreenContainerProps extends ViewProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: "center" | "top";
  topOffset?: number;
  accessibilityRole?: AccessibilityRole;
}

export default function ScreenContainer({
  children,
  style,
  variant = "center",
  topOffset = 0,
  accessibilityRole,
  ...rest
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
      accessibilityRole={accessibilityRole}
      {...rest}
    >
      <View style={[styles.inner, style]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: wp("3%"),
  },
  inner: {
    width: "100%",
    alignSelf: "center",
    maxWidth: 600,
  },
});

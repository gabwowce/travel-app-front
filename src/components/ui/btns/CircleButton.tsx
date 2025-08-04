import React from "react";
import { Pressable, Text, StyleSheet, ViewStyle } from "react-native";
import { Box, Icon } from "native-base";
import { Ionicons } from "@expo/vector-icons";

type Variant = "back" | "apply" | "start" | "close" | "edit" | "filter" | "save" | "custom";

type Props = {
  onPress: () => void;
  variant?: Variant;

  // override’ai jei `variant="custom"`
  iconName?: string;
  label?: string;
  color?: string;
  bgColor?: string;
  size?: number;
  style?: ViewStyle;
   borderRadius?: number;
   width?: number;
};

export default function CircleButton({
  onPress,
  variant = "custom",
  iconName,
  label,
  color,
  bgColor,
  size,
  style,
  width
}: Props) {
  // default’ai pagal variantą
  const defaults: Record<Variant, Partial<Props>> = {
  back: { iconName: "chevron-back", color: "#181818", bgColor: "#F7F7F7", size: 44 },
  close: { iconName: "close", color: "#181818", bgColor: "#F7F7F7", size: 44 },
  start: { iconName: "map", color: "#0C2736", bgColor: "#F7F7F7", size: 44 },
  apply: { label: "Apply", color: "#3B82F6", bgColor: "transparent", size: 44, borderRadius: 0 },
  edit: { iconName: "create-outline", color: "#181818", bgColor: "#F7F7F7", size: 44 }, // Ionicons pavadinimas
  filter: { iconName: "options-outline", color: "#181818", bgColor: "#F7F7F7", size: 44 },
  save:   { label: "Save", color: "#3B82F6", bgColor: "transparent", borderRadius: 0, width: 58 },
  custom: {},
};

  const def = defaults[variant] ?? {};

   const final = {
  iconName: iconName ?? def.iconName,
  label: label ?? def.label,
  color: color ?? def.color ?? "#181818",
  bgColor: bgColor ?? def.bgColor ?? "#F7F7F7",
  size: size ?? def.size ?? 44,
  borderRadius: def.borderRadius ?? 24, // ← čia default fallback
  width: width ?? def.width ?? 44,
};

  // Nerenderinam tuščio mygtuko
  if (!final.iconName && !final.label) return null;

  return (
    <Box>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
  accessibilityLabel={final.label || final.iconName || "Button"}
  accessibilityHint={
    variant === "filter"
      ? "Opens filter options"
      : variant === "apply"
      ? "Applies selected filters"
      : variant === "close"
      ? "Closes the modal"
      : undefined
  }
  accessible={true}
        style={({ pressed }) => [
          {
            width: final.width ?? 44,
            height: 44,
            borderRadius: final.borderRadius ?? 24,
            backgroundColor: final.bgColor ?? "#F7F7F7",
            color: final.color ?? "#000",
            justifyContent: "center",
            alignItems: "center",
            shadowColor: "#000",
          },
          pressed && { opacity: 0.75 },
          style,
        ]}
        android_ripple={{ color: "#E0E0E0", borderless: true }}
      >
        {final.iconName ? (
          <Icon as={Ionicons} name={final.iconName} size="lg" color={final.color} />
        ) : final.label ? (
          <Text style={[styles.label, { color: final.color }]}>{final.label}</Text>
        ) : null}
      </Pressable>
    </Box>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: "600",
  },
});

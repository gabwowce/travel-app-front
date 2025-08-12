import React from "react";
import { Pressable } from "react-native";
import { HStack, Text } from "native-base";

export default function Chip({
  label,
  isActive,
  onPress,
  ariaLabel,
}: {
  label: string;
  isActive?: boolean;
  onPress?: () => void;
  ariaLabel?: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={ariaLabel ?? label}
      accessibilityState={{ selected: !!isActive }}
      onPress={onPress}
      style={{
        borderRadius: 999,
        paddingVertical: 8,
        paddingHorizontal: 14,
        backgroundColor: isActive ? "#2563EB" : "#E5E7EB",
      }}
    >
      <HStack alignItems="center" space={2}>
        <Text
          style={{ color: isActive ? "white" : "#111827", fontWeight: "600" }}
        >
          {label}
        </Text>
      </HStack>
    </Pressable>
  );
}

// components/ui/btns/StartButton.tsx
import { Ionicons } from "@expo/vector-icons";
import { Box, Icon } from "native-base";
import React from "react";
import PressableLog from "../../PressableLog";

type Props = {
  onPress: () => void;
  iconName?: string; // pvz. "map", "play"
};

export default function StartButton({ onPress, iconName = "map" }: Props) {
  return (
    <Box>
      <PressableLog
        analyticsLabel={
          iconName === "map"
            ? "Start tour"
            : iconName === "play"
              ? "Play audio"
              : "Start"
        }
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={
          iconName === "map"
            ? "Start tour"
            : iconName === "play"
              ? "Play audio"
              : "Start"
        }
        accessibilityHint="Activates the selected function"
        accessible={true}
        style={{
          width: 44,
          height: 44,
          borderRadius: 24,
          backgroundColor: "#F7F7F7",
          justifyContent: "center",
          alignItems: "center",
          shadowColor: "#000",
        }}
        android_ripple={{ color: "#E0E0E0", borderless: true }}
      >
        <Icon as={Ionicons} name={iconName} size="lg" color="#0C2736" />
      </PressableLog>
    </Box>
  );
}

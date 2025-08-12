// src/components/ui/forms/RatingStars.tsx
import React from "react";
import {
  View,
  Pressable,
  StyleSheet,
  GestureResponderEvent,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const ACCENT = "#001F3F";
const EMPTY = "#E6ECF2";

type Props = {
  value?: number; // galima 0.5 žingsniais
  onChange: (v: number | undefined) => void;
  max?: number;
  size?: number;
  gap?: number;
  allowClear?: boolean;
};

export default function RatingStars({
  value,
  onChange,
  max = 5,
  size = 44,
  gap = 18,
  allowClear = true,
}: Props) {
  const handlePress = (e: GestureResponderEvent, idx: number) => {
    const { locationX } = e.nativeEvent;
    const isHalf = locationX < size / 2;
    const newValue = idx - (isHalf ? 0.5 : 0);
    if (allowClear && value === newValue) {
      onChange(undefined);
    } else {
      onChange(newValue);
    }
  };

  return (
    <View style={[styles.row, { columnGap: gap }]}>
      {Array.from({ length: max }, (_, i) => {
        const idx = i + 1;
        let iconName: keyof typeof Ionicons.glyphMap = "star-outline";
        if ((value ?? 0) >= idx) {
          iconName = "star";
        } else if ((value ?? 0) >= idx - 0.5) {
          iconName = "star-half";
        }
        return (
          <Pressable
            key={idx}
            onPress={(e) => handlePress(e, idx)}
            android_ripple={{ color: "#00000012", borderless: false }}
            accessibilityRole="button"
            accessibilityLabel={`Minimum rating ${idx}`}
            accessibilityState={{ selected: (value ?? 0) >= idx }}
            style={{ width: size, alignItems: "center" }}
          >
            <Ionicons
              name={iconName}
              size={size}
              color={(value ?? 0) >= idx - 0.5 ? ACCENT : EMPTY}
            />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center" },
});

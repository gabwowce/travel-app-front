// src/components/ui/btns/FavoriteIconButton.tsx
import { MaterialIcons } from "@expo/vector-icons";
import { IconButton } from "native-base";
import React from "react";
import { StyleProp, ViewStyle } from "react-native";

type FavoriteIconButtonProps = {
  selected: boolean;
  busy?: boolean;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  size?: number; // icon size
  color?: string; // icon color
};

export default function FavoriteIconButton({
  selected,
  busy = false,
  onPress,
  style,
  size = 24,
  color = "white",
}: FavoriteIconButtonProps) {
  return (
    <IconButton
      style={style}
      icon={
        <MaterialIcons
          name={selected ? "bookmark" : "bookmark-border"}
          size={size}
          color={color}
        />
      }
      onPress={onPress}
      isDisabled={busy}
      accessibilityRole="button"
      accessibilityLabel={
        selected ? "Remove from favorites" : "Add to favorites"
      }
      accessibilityState={{ selected, busy }}
    />
  );
}

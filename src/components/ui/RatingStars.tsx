import React from "react";
import { HStack, Icon, Text } from "native-base";
import { FontAwesome } from "@expo/vector-icons";

interface RatingStarsProps {
  value?: number | string | null;
  color?: string;
  size?: "xs" | "sm" | "md" | "lg";
  showText?: boolean;
  accessibilityLabel?: string;
}

export default function RatingStars({
  value,
  color = "yellow.400",
  size = "sm",
  showText = true,
  accessibilityLabel
}: RatingStarsProps) {
  const rating = Number(value);
  const valid = !isNaN(rating);

  return (
    <HStack alignItems="center" space={1} accessibilityRole="text"
      accessibilityLabel={accessibilityLabel}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Icon
          key={i}
          as={FontAwesome}
          name={valid && i + 1 <= Math.round(rating) ? "star" : "star-o"}
          color={color}
          size={size}
        />
      ))}

      {showText && (
        <Text ml={1} color="white">
          {valid ? rating.toFixed(1) : "–"}
        </Text>
      )}
    </HStack>
  );
}

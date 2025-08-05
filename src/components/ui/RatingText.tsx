import React from "react";
import { Text } from "native-base";

interface RatingTextProps {
  value: string | number | undefined | null;
  variant?: string; // pvz. "bodyGray", "bodyGraysm", ir pan.
  accessibilityLabel?: string;
}

export default function RatingText({ value, variant = "bodyGray" }: RatingTextProps) {
  const numeric = Number(value);

  return (
    <Text variant={variant} accessibilityRole="text" accessibilityLabel={accessibilityLabel}>
      {!isNaN(numeric) ? numeric.toFixed(1) : "–"}
    </Text>
  );
}

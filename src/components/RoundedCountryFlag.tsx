import React from "react";
import CountryFlag from "react-native-country-flag";

interface RoundedCountryFlagProps {
  isoCode: string;
  size?: number;
  accessibilityLabel?: string;
}

export default function RoundedCountryFlag({
  isoCode,
  size = 20,
  accessibilityLabel,
}: RoundedCountryFlagProps) {
  return (
    <CountryFlag
      isoCode={isoCode}
      size={size}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        overflow: "hidden",
      }}
      accessibilityLabel={accessibilityLabel ?? `Flag of ${isoCode}`}
      accessibilityRole="image"
    />
  );
}

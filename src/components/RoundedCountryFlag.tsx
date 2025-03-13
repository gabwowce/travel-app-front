import React from "react";
import { Image } from "react-native";
import CountryFlag from "react-native-country-flag";

interface RoundedCountryFlagProps {
  isoCode: string;
  size?: number;
}

export default function RoundedCountryFlag({ isoCode, size = 20 }: RoundedCountryFlagProps) {
  return (
    <CountryFlag
      isoCode={isoCode}
      size={size}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2, // ✅ Padaro apvalią ikoną
        overflow: "hidden", // ✅ Užtikrina, kad vėliava nesikirstų su kraštais
      }}
    />
  );
}

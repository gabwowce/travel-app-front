import React from "react";
import { StyleSheet, ImageBackground, ImageBackgroundProps, useWindowDimensions } from "react-native";

// Įkeliam dvi skirtingas fono versijas
const BG_IMAGE_PHONE = require("../assets/images/background-blob.png");
const BG_IMAGE_TABLET = require("../assets/images/background-blob-tablet.png"); // <- sukurk šį failą

interface BackgroundProps extends ImageBackgroundProps {
  children: React.ReactNode;
}

export function Background({ children, style, ...props }: BackgroundProps) {
  const { width } = useWindowDimensions();

  const isLargeScreen = width >= 500; // arba kita tavo logika
  const backgroundSource = isLargeScreen ? BG_IMAGE_TABLET : BG_IMAGE_PHONE;

  return (
    <ImageBackground
      source={backgroundSource}
      style={[styles.bgImage, style]}
      resizeMode="cover"
      {...props}
    >
      {children}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bgImage: {
    flex: 1,
    backgroundColor: "#FFFCF9",
  },
});

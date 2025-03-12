import React from "react";
import { StyleSheet, ImageBackground, ImageBackgroundProps } from "react-native";

// Nurodome tą patį paveikslėlį, kuris bus fonas
const BG_IMAGE = require("../assets/images/background-blob.png");

// Apibrėžiame komponento „props“, kad galėtume perduoti children, stilių, ir t. t.
interface BackgroundProps extends ImageBackgroundProps {
  children: React.ReactNode;
}

export function Background({ children, style, ...props }: BackgroundProps) {
  return (
    <ImageBackground
      source={BG_IMAGE}
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
    backgroundColor:"#FFFCF9"
  },
});

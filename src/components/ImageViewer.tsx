import { Image } from "expo-image";
import { StyleSheet } from "react-native";

type Props = {
  imgSource: string | number; // leidžiam tiek URL, tiek `require(...)`
  alt?: string;               // galima nurodyti alternatyvų tekstą
};

export default function ImageViewer({ imgSource, alt = "Tour image" }: Props) {
  return (
    <Image
      source={imgSource}
      style={styles.image}
      accessibilityRole="image"
      accessibilityLabel={alt}
      contentFit="cover" // vietoj resizeMode
    />
  );
}

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: "100%",
  },
});

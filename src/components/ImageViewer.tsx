import { Image } from "expo-image";
import { StyleSheet } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

type Props = {
  imgSource: string;
};

export default function ImageViewer({ imgSource }: { imgSource: any }) {
  return (
    <Image
      source={imgSource}
      style={{ width: "100%", height: "100%", resizeMode: "cover" }}
      alt="tour image"
    />
  );
}


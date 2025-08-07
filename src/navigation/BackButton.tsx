// src/navigation/BackButton.tsx
import { router } from "expo-router"; // arba useNavigation()
import CircleButton from "@/src/components/ui/btns/CircleButton";

export default function BackButton({ style }: { style?: object }) {
  return (
    <CircleButton
      variant="back"
      style={style}
      onPress={() => router.back()} // grąžina į ankstesnį ekraną
    />
  );
}

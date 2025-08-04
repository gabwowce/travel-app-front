// results/_layout.tsx
import { Stack } from "expo-router";
import { defaultHeaderOptions } from "@/src/navigation/headerOptions";

export default function ResultLayout() {
  return (
    <Stack
      screenOptions={{ ...defaultHeaderOptions, headerShown: false }}
    />
  );
}

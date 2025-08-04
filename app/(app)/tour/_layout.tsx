// app/(app)/tour/_layout.tsx
import { Stack } from "expo-router";
import { defaultHeaderOptions } from "@/src/navigation/headerOptions";

export default function TourLayout() {
  return (
    <Stack
      screenOptions={{
        ...defaultHeaderOptions,
        headerTransparent: true,         // ⬅︎ žemėlapiui norim permatomo header’io
      }}
    >
      <Stack.Screen name="[id]" />       {/* title nustatys pats ekranas */}
    </Stack>
  );
}

import { Stack } from "expo-router";
import { defaultHeaderOptions } from "@/src/navigation/headerOptions";

export default function RoutesIdLayout() {
  return (
    <Stack screenOptions={{ ...defaultHeaderOptions }}>
      <Stack.Screen name="index" options={{  headerShown: false }} />
      <Stack.Screen name="map" />
    </Stack>
  );
}

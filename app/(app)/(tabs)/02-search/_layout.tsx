import { Stack } from "expo-router";
import { defaultHeaderOptions } from "@/src/navigation/headerOptions";

export default function SearchLayout() {
  return (
    <Stack screenOptions={{ ...defaultHeaderOptions }}>
      <Stack.Screen name="index" options={{ title: "Search" }} />
      <Stack.Screen name="filter" options={{ headerShown: false }} />
    </Stack>
  );
}

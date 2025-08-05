import { Stack } from "expo-router";
import { defaultHeaderOptions } from "@/src/navigation/headerOptions";

export default function ModalsLayout() {
  return (
    <Stack screenOptions={{ ...defaultHeaderOptions }}>
      <Stack.Screen name="filters" options={{ title: "Filters" }} />
    </Stack>
  );
}

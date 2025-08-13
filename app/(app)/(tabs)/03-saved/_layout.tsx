import { Stack } from "expo-router";
import { defaultHeaderOptions } from "@/src/navigation/headerOptions";

export default function SavedLayout() {
  return (
    <Stack screenOptions={{ ...defaultHeaderOptions }}>
      <Stack.Screen name="index" options={{ title: "Saved" }} />
      <Stack.Screen
        name="filters"
        options={{
          title: "Filters",
          presentation: "modal",
          animation: "slide_from_bottom",
          headerLeft: () => null,
        }}
      />
    </Stack>
  );
}

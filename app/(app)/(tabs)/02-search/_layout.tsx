import { defaultHeaderOptions } from "@/src/navigation/headerOptions";
import { Stack } from "expo-router";

export default function SearchLayout() {
  return (
    <Stack screenOptions={{ ...defaultHeaderOptions }}>
      <Stack.Screen name="index" options={{ title: "Search" }} />
      {/* <Stack.Screen
        name="filters"
        options={{
          title: "Filters",
          presentation: "modal",
          animation: "slide_from_bottom",
          headerLeft: () => null,
        }}
      /> */}
    </Stack>
  );
}

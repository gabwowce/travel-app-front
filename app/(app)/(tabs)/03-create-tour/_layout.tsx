import { Stack } from "expo-router";
import { defaultHeaderOptions } from "@/src/navigation/headerOptions";

export default function CreateTourLayout() {

  return (
    <Stack
      screenOptions={{
        ...defaultHeaderOptions,
      }}
    >
      <Stack.Screen name="index"  options={{ title: "Select a Country" }}/>
      <Stack.Screen name="city" />
      <Stack.Screen name="category" options={{ title: "Select Category" }} />
      <Stack.Screen name="tours" options={{ title: "Available Tours Based on Your Selection" }} />
    </Stack>
  );
}
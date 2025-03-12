import { Stack } from "expo-router";

export default function CreateTourLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="city" />
      <Stack.Screen name="category" />
      <Stack.Screen name="tours" />
    </Stack>
  );
}

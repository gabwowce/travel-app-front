import { Stack } from "expo-router";
import { useResetTour } from "@/src/hooks/useResetTour";

export default function CreateTourLayout() {
  useResetTour();
  return (
    <Stack
      screenOptions={{
        headerShown: false, 
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="city" options={{ headerShown: false }} />
      <Stack.Screen name="category" options={{ headerShown: false }} />
      <Stack.Screen name="tours" options={{ headerShown: false }} />
    </Stack>
  );
}
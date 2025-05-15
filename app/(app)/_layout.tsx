import React from "react";
import { Stack } from "expo-router";

export default function AppLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, 
      }}
    >
      {/* Your tabs as the base route */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      {/* A separate screen for the Tour, using [id] param */}
      <Stack.Screen name="results" options={{ headerShown: false }} />
      <Stack.Screen name="(modals)" options={{ headerShown: false }} />
      <Stack.Screen name="tour/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="category/[id]" options={{ headerShown: false }} />
    </Stack>
  );
}

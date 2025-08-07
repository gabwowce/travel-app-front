import React from "react";
import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();
export default function AppLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        {/* Your tabs as the base route */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        {/* A separate screen for the Tour, using [id] param */}
        <Stack.Screen name="results" options={{ headerShown: false }} />

        <Stack.Screen name="routes/[id]" options={{ headerShown: false }} />
      </Stack>
    </QueryClientProvider>
  );
}

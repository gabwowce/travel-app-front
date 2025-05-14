import { Stack } from "expo-router";

export default function SearchLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, 
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }}/>
      <Stack.Screen name="filter" options={{ headerShown: false }} />
    </Stack>
  );
}

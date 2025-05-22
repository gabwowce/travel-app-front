// app/index.tsx
import { Redirect } from "expo-router";
import { useAppSelector } from "@/src/data/hooks";

export default function Index() {
  // Tokį flagą jau turi₍iš authSlice₎
  const isAuthenticated = useAppSelector((state) => !!state.auth.token);

  return <Redirect href={isAuthenticated ? "/(app)/(tabs)/home" : "/(auth)"} />;
}

import { Stack } from "expo-router";
import { useAppSelector } from "@/src/data/hooks";
import { AppRoutes } from "@/src/config/routes";

export default function AppNavigator() {
  const isAuthenticated = useAppSelector((st) => !!st.auth.token);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <Stack.Screen name={AppRoutes.HOME} />
      ) : (
        <Stack.Screen name={AppRoutes.LOGIN} />
      )}
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

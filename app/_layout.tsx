// app/_layout.tsx
import "react-native-gesture-handler";
import "react-native-reanimated";
import React, { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NativeBaseProvider } from "native-base";
import { Provider as ReduxProvider } from "react-redux";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { StatusBar } from "expo-status-bar";
import { Stack } from "expo-router";

import theme from "@/src/config/theme";
import { store } from "@/src/data/store";
import  initAuth  from "@/src/data/features/auth/authSlice";
import { useAppSelector } from "@/src/data/hooks";

// 🎨 Custom splash component (replaces native one)
import SplashScreen from "@/src/components/screens/splash";
import ErrorScreen from "@/src/components/screens/error";
/**
 * A single place to register every async task that **must** finish
 * before the app becomes interactive.  Add new promises to `tasks`
 * and the custom splash screen will remain visible until they resolve.
 */
async function loadAppResources() {
  const tasks: Promise<unknown>[] = [
    // 🔐 1) Check auth state
    store.dispatch<any>(initAuth()),
    // 📦 2) Future: preload fonts, remote config, etc.
  ];

  await Promise.all(tasks);
}

function useAppInitializer() {
  const [ready, setReady] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        await loadAppResources();
      } catch (e) {
        console.error("App initialisation failed", e);
        setError((e as Error).message ?? "Something went wrong")
      } finally {
        setReady(true);
      }
    })();
  }, []);

  return {ready, error};
}

function AppNavigator() {
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <Stack.Screen name="(app)" />
      ) : (
        <Stack.Screen name="(auth)" />
      )}
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}


export default function RootLayout() {
  const {ready, error} = useAppInitializer();

  // Show custom splash while loading critical resources.
  if (!ready) {
    return <SplashScreen />;
  }
   if (error) {
    return <ErrorScreen message={error} />;
  }

return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ReduxProvider store={store}>
        <NativeBaseProvider theme={theme}>
          <BottomSheetModalProvider>
            <StatusBar style="dark" hidden={false} translucent />
            <AppNavigator />
          </BottomSheetModalProvider>
        </NativeBaseProvider>
      </ReduxProvider>
    </GestureHandlerRootView>
  );
}

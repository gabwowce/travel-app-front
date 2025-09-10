// RootLayout.tsx  (arba src/RootLayout.tsx)
import "react-native-gesture-handler";
import "react-native-reanimated";

import ErrorScreen from "@/src/components/screens/error";
import SplashScreen from "@/src/components/screens/splash";
import BusyOverlay from "@/src/components/ui/BusyOverlay";
import { ENV } from "@/src/config/env";
import theme from "@/src/config/theme";
import { initAuth } from "@/src/data/features/auth/authThunks";
import { store } from "@/src/data/store";
import { useAppInitializer } from "@/src/hooks/useAppInitializer";
import { installTimestampedConsole } from "@/src/setup/timestampedConsole";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Slot, usePathname } from "expo-router";
import * as SplashScreenExpo from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { NativeBaseProvider } from "native-base";
import React, { useEffect, useRef } from "react";
import { BackHandler, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider as ReduxProvider } from "react-redux";

if (__DEV__) {
  installTimestampedConsole();
}

// RN ≥ 0.72 BackHandler.removeEventListener polyfill
if (!(BackHandler as any).removeEventListener) {
  Object.defineProperty(BackHandler, "removeEventListener", {
    value: () => {},
  });
}

// laikom natyvinį splash, kol React pasiruošęs
// SplashScreenExpo.preventAutoHideAsync();

export default function RootLayout() {
  const { ready, error } = useAppInitializer(
    [() => store.dispatch(initAuth())],
    ENV.SPLASH_MIN_MS
  );

  const pathname = usePathname();
  const lastPathRef = useRef<string | null>(null);

  useEffect(() => {
    // Guard nuo dvigubų pranešimų dev režime (StrictMode)
    if (!pathname || pathname === lastPathRef.current) return;
    lastPathRef.current = pathname;

    // Pvz: [2025-08-28 10:32:12.480] 📍 [SCREEN] /(modals)/filters
    console.log(`📍 [SCREEN] ${pathname}`);
  }, [pathname]);
  // const onLayoutRootView = useCallback(async () => {
  //   await SplashScreenExpo.hideAsync();
  // }, [ready]);
  useEffect(() => {
    SplashScreenExpo.hideAsync(); // vieną kartą
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ReduxProvider store={store}>
        <NativeBaseProvider theme={theme}>
          <BottomSheetModalProvider>
            {!ready ? (
              <SplashScreen />
            ) : error ? (
              <ErrorScreen message={error} />
            ) : (
              <>
                <StatusBar style="dark" />
                <View style={{ flex: 1 }}>
                  <Slot />
                  <BusyOverlay />
                </View>
              </>
            )}
          </BottomSheetModalProvider>
        </NativeBaseProvider>
      </ReduxProvider>
    </GestureHandlerRootView>
  );
}

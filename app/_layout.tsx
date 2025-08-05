// RootLayout.tsx  (arba src/RootLayout.tsx)
import "react-native-gesture-handler";
import "react-native-reanimated";

import React, { useCallback, useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { BackHandler, View } from "react-native";
import * as SplashScreenExpo from "expo-splash-screen";
import { Provider as ReduxProvider } from "react-redux";
import { NativeBaseProvider } from "native-base";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Slot } from "expo-router";

import theme from "@/src/config/theme";
import { store } from "@/src/data/store";
import SplashScreen from "@/src/components/screens/splash";
import ErrorScreen from "@/src/components/screens/error";
import BusyOverlay from "@/src/components/ui/BusyOverlay";
import { useAppInitializer } from "@/src/hooks/useAppInitializer";

// RN ≥ 0.72 BackHandler.removeEventListener polyfill
if (!(BackHandler as any).removeEventListener) {
  Object.defineProperty(BackHandler, "removeEventListener", {
    value: () => {},
  });
}

// laikom natyvinį splash, kol React pasiruošęs
// SplashScreenExpo.preventAutoHideAsync();

export default function RootLayout() {
  const { ready, error } = useAppInitializer();

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
                <StatusBar
                  style="dark"
                  translucent
                  backgroundColor="transparent"
                />
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

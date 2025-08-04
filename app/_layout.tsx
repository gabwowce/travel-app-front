import "react-native-gesture-handler";
import "react-native-reanimated";

import React, { useCallback } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { BackHandler, View } from "react-native";
import * as SplashScreenExpo from "expo-splash-screen";
import { Provider as ReduxProvider } from "react-redux";
import { NativeBaseProvider } from "native-base";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

import theme from "@/src/config/theme";
import { store } from "@/src/data/store";
import Splash from "@/src/components/screens/splash";
import ErrorScreen from "@/src/components/screens/error";
import { useAppInitializer } from "@/src/hooks/useAppInitializer";
import AppNavigator from "@/src/navigation/AppNavigator";
import BusyOverlay from "@/src/components/ui/BusyOverlay";

// ─── RN ≥0.72 BackHandler.removeEventListener polyfill ─────────────────────
if (!(BackHandler as any).removeEventListener) {
  Object.defineProperty(BackHandler, "removeEventListener", { value: () => {} });
}

// Laikom natyvinį splash kol React pasiruošęs
SplashScreenExpo.preventAutoHideAsync();

export default function RootLayout() {
  const { ready, error } = useAppInitializer();

  const onLayout = useCallback(async () => {
    if (ready) await SplashScreenExpo.hideAsync();
  }, [ready]);

  if (!ready) return <Splash />;
  if (error) return <ErrorScreen message={error} />;

  return (
    <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayout}>
      <BottomSheetModalProvider>
        <ReduxProvider store={store}>
          <NativeBaseProvider theme={theme}>
            <StatusBar style="dark" translucent backgroundColor="transparent" />
            <View style={{ flex: 1 }}>
              <AppNavigator />
              <BusyOverlay />
            </View>
          </NativeBaseProvider>
        </ReduxProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

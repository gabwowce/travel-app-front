import React, { useState, useEffect } from 'react';
import { Stack, Slot } from 'expo-router';
import { Provider as ReduxProvider, useSelector, useDispatch } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NativeBaseProvider } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { store } from '@/src/data/store';
import theme from '@/src/styles/theme';
import Splash from '@/src/components/screens/splash';
import { RootState } from '@/src/data/store';
import {selectIsAuthenticated, selectAuthLoading} from "@/src/data/features/auth/authSelectors";

import { StatusBar } from "expo-status-bar";


export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ReduxProvider store={store}>
        <NativeBaseProvider theme={theme}>
            <StatusBar style="dark" />
            <MainNavigation />
        </NativeBaseProvider>
      </ReduxProvider>
    </GestureHandlerRootView>
  );
}

function MainNavigation() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectAuthLoading);
  
  
  const [onboardingDone, setOnboardingDone] = useState(false);
  const [ready, setReady] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      try {
        const done = await AsyncStorage.getItem('onboardingDone');
        setOnboardingDone(done === 'true'); 
      } catch (e) {
        console.warn(e);
      } finally {
        setReady(true);
      }
    })();
  }, []); 
  

  // useEffect(() => {
  //   AsyncStorage.removeItem('onboardingDone');
  // }, []);
  


  useEffect(() => {
    setTimeout(() => {
      setShowSplash(false);
    }, 3000);
  }, []);
 
  if (showSplash || isLoading) {
    return <Splash onFinish={() => setShowSplash(false)} />;
  }

  if (!ready) {
    return <Splash onFinish={() => setReady(true)} />;
  }

  if (!onboardingDone) {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(onboarding)" />
      </Stack>
    );
  }

  if (!isAuthenticated) {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)/index" />
      </Stack>
    );
  }

  return <Slot />;
}

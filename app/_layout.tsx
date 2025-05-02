// app/_layout.tsx
import React, { useState, useEffect } from 'react';
import { Stack, Slot } from 'expo-router';
import { Provider as ReduxProvider, useSelector, useDispatch } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NativeBaseProvider, View } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useRouter } from 'expo-router';

import { store } from '@/src/data/store';
import theme from '@/src/config/theme';
import Splash from '@/src/components/screens/splash';

import { StatusBar } from "expo-status-bar";

import { useAppSelector } from "@/src/data/hooks";
import { initAuth } from "@/src/data/features/auth/authThunks"; 
import { useAppDispatch } from '@/src/data/hooks';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
       <BottomSheetModalProvider>
        <ReduxProvider store={store}>
          <NativeBaseProvider theme={theme}>
            <StatusBar style="dark" translucent backgroundColor="transparent"/>
            <View style={{ flex: 1 }}> 
              <MainNavigation />
            </View>
          </NativeBaseProvider>
        </ReduxProvider>
       </BottomSheetModalProvider>
    
  </GestureHandlerRootView>
  
  );
}

function MainNavigation() {
  const isAuthenticated = useAppSelector( state => state.auth.isAuthenticated);
  const isLoading = useAppSelector(state => state.auth.loading);
  const dispatch = useAppDispatch();
  
  const [onboardingDone, setOnboardingDone] = useState(false);
  const [ready, setReady] = useState(true);
  const [showSplash, setShowSplash] = useState(true);


  // useEffect(() => {
  //   (async () => {
  //     try {
  //       const done = await AsyncStorage.getItem('onboardingDone');
  //       setOnboardingDone(done === 'true'); 
  //     } catch (e) {
  //       console.warn(e);
  //     } finally {
  //       setReady(true);
  //     }
  //   })();
  // }, []); 

  useEffect(() => {
    dispatch(initAuth()); // ✅ Dabar saugu naudoti
  }, []);

  const router = useRouter();

  // useEffect(() => {
  //   if (ready && isAuthenticated && onboardingDone) {
  //     router.replace('/(app)/(tabs)/home'); // arba '/(auth)/index' jei nori tiksliai
  //   }
  // }, [ready, isAuthenticated, onboardingDone]);


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

  // if (!onboardingDone) {
  //   return (
  //     <Stack screenOptions={{ headerShown: false }}>
  //       <Stack.Screen name="(onboarding)" />
  //     </Stack>
  //   );
  // }

  
  // if (!isAuthenticated) {
  //   return (
  //     <Stack screenOptions={{ headerShown: false }}>
  //       <Stack.Screen name="(auth)/index" />
  //     </Stack>
  //   );
  // }

  return (
    <View style={{ flex: 1 }}>
      <Slot />
    </View>
  );
  
}

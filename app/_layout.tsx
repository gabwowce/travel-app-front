// app/_layout.tsx
import React, { useState, useEffect } from 'react';
import { Stack, Slot } from 'expo-router';
import { Provider as ReduxProvider, useSelector, useDispatch } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NativeBaseProvider, View } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

import { store } from '@/src/data/store';
import theme from '@/src/config/theme';
import Splash from '@/src/components/screens/splash';

import { StatusBar } from "expo-status-bar";

import { useAppSelector } from "@/src/data/hooks";
import { initAuth } from "@/src/data/features/auth/authThunks"; 
import { useAppDispatch } from '@/src/data/hooks';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { setCredentials } from '@/src/data/features/auth/authSlice';
import { useLoginUserMutation } from '@/src/store/travelApi';
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
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => !!state.auth.token);

  const [ready, setReady] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [login, { isLoading }] = useLoginUserMutation();

  useEffect(() => {
    (async () => {
      const token = await SecureStore.getItemAsync('token');  
      const user  = await SecureStore.getItemAsync('user');
      if (token && user) {
        dispatch(setCredentials({ token, user: JSON.parse(user) }));
      }
      setReady(true);
    })();
  }, []);

  useEffect(() => {
    setTimeout(() => setShowSplash(false), 2000);
  }, []);

    if (showSplash || isLoading) {
    return <Splash onFinish={() => setShowSplash(false)} />;
  }

  if (!ready) {
    return <Splash onFinish={() => setReady(true)} />;
  }


  return (
    <Stack screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <Stack.Screen name="(app)" />
      ) : (
        <Stack.Screen name="(auth)/index" />
      )}
    </Stack>
  );
}
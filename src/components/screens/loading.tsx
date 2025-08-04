import React from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { Box, Center, Text } from "native-base";
import { LinearGradient } from 'expo-linear-gradient';
import {ActivityIndicator,} from 'react-native';

export default function LoadingScreen() {


  return (
    <Box flex={1}>
      <LinearGradient
        colors={['#90DAEE', '#C3F1D5']}
        style={{ flex: 1 }}
      >
        <Center flex={1}>
          <ActivityIndicator size="large" color="#444" />
        </Center>
      </LinearGradient>
    </Box>
  );
}
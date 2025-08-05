import React from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { Box, Center, Text } from "native-base";
import { LinearGradient } from 'expo-linear-gradient';
import {ActivityIndicator,} from 'react-native';
import useAnnounceForAccessibility from "@/src/hooks/useAnnounceForAccessibility"; 

export default function LoadingScreen() {
 useAnnounceForAccessibility("Loading, please wait …");

  return (
    <Box flex={1}>
      <LinearGradient
      mportantForAccessibility="no"
        colors={['#90DAEE', '#C3F1D5']}
        style={{ flex: 1 }}
      >
        <Center flex={1}>
          <ActivityIndicator size="large" color="#444" accessibilityRole="progressbar"
            accessibilityLabel="Loading, please wait"  accessibilityLiveRegion="assertive"
            accessibilityState={{ busy: true }} />
        </Center>
      </LinearGradient>
    </Box>
  );
}
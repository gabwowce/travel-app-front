import React, { useEffect, useState } from 'react';
import { Box, Center, Text } from "native-base";
import { LinearGradient } from 'expo-linear-gradient';

interface SplashProps {
  onFinish: () => void;
}

export default function Splash({ onFinish }: SplashProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onFinish) onFinish();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Box flex={1}>
      <LinearGradient
        colors={['#90DAEE', '#C3F1D5']}
        style={{ flex: 1 }}
      >
        <Center flex={1}>
          <Text fontSize="3xl" fontWeight="bold">TravelMate</Text>
        </Center>
      </LinearGradient>
    </Box>
  );
}

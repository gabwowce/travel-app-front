import React, { useEffect } from 'react';
import { Box, Center, Image, Text, VStack } from "native-base";

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
    <Box flex={1} bg="#FFFFFF">
      <Center flex={1}>
        <VStack space={4} alignItems="center">
          <Image
            source={require('@/src/assets/logo/logo-v1.png')}
            alt="Logo"
            width={150}
            height={150}
            resizeMode="contain"
          />
          <Text fontSize="3xl" fontWeight="bold" color="black">
            Elatray
          </Text>
        </VStack>
      </Center>
    </Box>
  );
}

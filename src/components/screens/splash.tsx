import React, { useEffect } from 'react';
import { AccessibilityInfo, Box, Center, Image, Text, VStack } from "native-base";

interface SplashProps {
  onFinish?: () => void;
}

export default function SplashScreen({ onFinish }: SplashProps) {
  useEffect(() => {
    let timer: NodeJS.Timeout;

    // ⏱️ Duodame kiek ilgesnį laiką, jei veikia VoiceOver/TalkBack
    AccessibilityInfo.isScreenReaderEnabled().then((enabled) => {
      timer = setTimeout(() => onFinish?.(), enabled ? 2000 : 1000);
    });

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <Box flex={1} bg="#FFFFFF">
      <Center flex={1}>
        <VStack space={4} alignItems="center">
          <Image 
            importantForAccessibility="no"
            accessibilityElementsHidden
            source={require('@/src/assets/logo/logo-v1.png')}
            alt="Logo"
            width={150}
            height={150}
            resizeMode="contain"
          />
          <Text fontSize="3xl" fontWeight="bold" color="black" accessibilityRole="header">
            Elatray
          </Text>
        </VStack>
      </Center>
    </Box>
  );
}

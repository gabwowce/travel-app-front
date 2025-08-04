import React from 'react';
import { Box, Center, Image, Text, VStack  } from "native-base";
import useAnnounceForAccessibility from "@/src/hooks/useAnnounceForAccessibility"; 

interface ErrorProps {
  message: string;
}

export default function ErrorScreen({ message }: ErrorProps) {
  useAnnounceForAccessibility(`${message}`);

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
             <Text fontSize="3xl" fontWeight="bold" color="black" accessibilityRole="alert">
               {message}
             </Text>
           </VStack>
         </Center>
       </Box>
     );
}

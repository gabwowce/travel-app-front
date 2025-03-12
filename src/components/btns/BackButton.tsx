import React from 'react';
import { Pressable } from 'react-native';
import { Icon, Box } from 'native-base';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  onPress: () => void;
};

export default function BackButton({ onPress }: Props) {
  return (
    <Box>
      <Pressable
        onPress={onPress}
        style={{
          width: 44,
          height: 44,
          borderRadius: 24, // Sukuria apskritimą
          backgroundColor: "#F7F7F7", // Švelniai pilkas fonas
          justifyContent: "center",
          alignItems: "center",
          shadowColor: "#000",
      
        }}
        android_ripple={{ color: "#E0E0E0", borderless: true }}
      >
        <Icon as={Ionicons} name="chevron-back" size="lg" color="#181818" />
      </Pressable>
    </Box>
  );
}

// components/ui/btns/StartButton.tsx
import React from 'react';
import { Pressable } from 'react-native';
import { Icon, Box } from 'native-base';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  onPress: () => void;
  iconName?: string; // pvz. "map", "play"
};

export default function StartButton({ onPress, iconName = "map" }: Props) {
  return (
    <Box>
      <Pressable
        onPress={onPress}
        style={{
          width: 44,
          height: 44,
          borderRadius: 24,
          backgroundColor: "#F7F7F7",
          justifyContent: "center",
          alignItems: "center",
          shadowColor: "#000",
        }}
        android_ripple={{ color: "#E0E0E0", borderless: true }}
      >
        <Icon as={Ionicons} name={iconName} size="lg" color="#0C2736" />
      </Pressable>
    </Box>
  );
}

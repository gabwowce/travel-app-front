// components/ui/StatChip.tsx
import React from "react";
import { HStack, Icon, Text } from "native-base";
import { FontAwesome } from "@expo/vector-icons";

export default function StatChip({
  icon,
  label,
  accessibilityLabel
}: {
  icon: string;
  label: string;
  accessibilityLabel?: string;
}) {
  return (
    <HStack
      alignItems="center"
      bg="primary.100"
      _dark={{ bg: "primary.800" }}
      px="3"
      py="1"
      rounded="md"
      mr="2"
      mb="2"
      accessibilityRole="text"
  accessibilityLabel={accessibilityLabel}
    >
      <Icon as={FontAwesome} name={icon} size="xs" mr="1" />
      <Text fontSize="xs">{label}</Text>
    </HStack>
  );
}

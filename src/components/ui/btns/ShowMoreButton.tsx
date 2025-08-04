// src/components/ui/btns/ShowMoreButton.tsx
import React from "react";
import { Button, HStack, Icon, Text } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";

type Props = {
  onPress: () => void;
  isLoading?: boolean;
};

export default function ShowMoreButton({ onPress, isLoading }: Props) {
  return (
    <Button
      onPress={onPress}
      isLoading={isLoading}
      borderRadius="full"
      accessibilityRole="button"
  accessibilityLabel="Load more items"
      px={6}
      py={3}
      bg="#001F3F"
      _pressed={{ bg: "primary.600" }}
      _text={{ fontWeight: "bold", color: "white" }}
      leftIcon={
        <Icon
          as={MaterialIcons}
          name="expand-more"
          size="md"
          color="white"
        />
      }
    >
      Show more
    </Button>
  );
}

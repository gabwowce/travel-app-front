import React from "react";
import { Box, Spinner, Text } from "native-base";

type SpinnerScreenProps = {
  size?: "sm" | "md" | "lg" | "xl";
  backgroundColor?: string;
  label?: string; // pasirinktinai, kas bus sakoma screen reader'iui
};

export default function SpinnerScreen({
  size = "lg",
  backgroundColor = "transparent",
  label = "Loading...",
}: SpinnerScreenProps) {
  return (
    <Box
      flex={1}
      justifyContent="center"
      alignItems="center"
      bg={backgroundColor}
      accessibilityRole="progressbar"
      accessibilityLabel={label}
    >
      <Spinner size={size} />
      <Text mt={4} color="gray.500" fontSize="sm" visuallyHidden>
        {label}
      </Text>
    </Box>
  );
}

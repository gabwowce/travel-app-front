import React from "react";
import { Box, Spinner } from "native-base";

type SpinnerScreenProps = {
  size?: "sm" | "md" | "lg" | "xl";
  backgroundColor?: string;
};

export default function SpinnerScreen({
  size = "lg",
  backgroundColor = "transparent",
}: SpinnerScreenProps) {
  return (
    <Box flex={1} justifyContent="center" alignItems="center" bg={backgroundColor}>
      <Spinner size={size} />
    </Box>
  );
}

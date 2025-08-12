import React from "react";
import { HStack, Text, Spacer } from "native-base";

interface Props {
  label: string;
  valueText: string | number;
}

export default function LabelHeader({ label, valueText }: Props) {
  return (
    <HStack alignItems="center" mb={1}>
      <Text
        fontSize="sm"
        bold
        color="coolGray.700"
        _dark={{ color: "coolGray.100" }}
      >
        {label}
      </Text>
      <Spacer />
      <Text
        fontSize="xs"
        color="coolGray.500"
        _dark={{ color: "coolGray.300" }}
      >
        {valueText}
      </Text>
    </HStack>
  );
}

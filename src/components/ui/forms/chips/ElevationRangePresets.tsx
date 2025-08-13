import React, { useState } from "react";
import {
  Wrap,
  Actionsheet,
  useDisclose,
  HStack,
  Input,
  Text,
} from "native-base";
import Chip from "./chips/Chip";

type Range = [number, number];
const PRESETS: Range[] = [
  [0, 200],
  [200, 500],
  [500, 1000],
  [1000, 2000],
];

export default function ElevationRangePresets({
  value,
  onChange,
}: {
  value?: Range;
  onChange: (v: Range | undefined) => void;
}) {
  const { isOpen, onOpen, onClose } = useDisclose();
  const isPreset =
    value && PRESETS.some(([a, b]) => a === value[0] && b === value[1]);
  const [from, setFrom] = useState<number>(value?.[0] ?? 0);
  const [to, setTo] = useState<number>(value?.[1] ?? 500);

  const applyCustom = () => {
    onChange([Math.min(from, to), Math.max(from, to)]);
    onClose();
  };

  return (
    <>
      <Wrap direction="row" space={2} alignItems="center">
        <Chip
          label="Any"
          isActive={!value}
          onPress={() => onChange(undefined)}
        />
        {PRESETS.map((r, i) => (
          <Chip
            key={i}
            label={`${r[0]}–${r[1]} m`}
            isActive={!!value && r[0] === value[0] && r[1] === value[1]}
            onPress={() => onChange(r)}
          />
        ))}
        <Chip
          label={isPreset ? "Custom…" : `Custom ${from}–${to} m`}
          onPress={onOpen}
        />
      </Wrap>

      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content>
          <HStack space={3} alignItems="center" mt={2}>
            <Input
              keyboardType="numeric"
              value={String(from)}
              w="24"
              onChangeText={(t) =>
                setFrom(Number(t.replace(/[^\d]/g, "")) || 0)
              }
              InputRightElement={<Text mr={3}>m</Text>}
              accessibilityLabel="Min elevation"
            />
            <Text>–</Text>
            <Input
              keyboardType="numeric"
              value={String(to)}
              w="24"
              onChangeText={(t) => setTo(Number(t.replace(/[^\d]/g, "")) || 0)}
              InputRightElement={<Text mr={3}>m</Text>}
              accessibilityLabel="Max elevation"
            />
          </HStack>
          <Chip label="Apply" isActive onPress={applyCustom} />
        </Actionsheet.Content>
      </Actionsheet>
    </>
  );
}

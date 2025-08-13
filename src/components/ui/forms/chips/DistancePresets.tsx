import React, { useState } from "react";
import {
  HStack,
  Wrap,
  Actionsheet,
  useDisclose,
  Input,
  IconButton,
  Text,
} from "native-base";
import { Ionicons } from "@expo/vector-icons";
import Chip from "./chips/Chip";

const PRESETS = [undefined, 1, 3, 5, 10, 20] as (number | undefined)[];

export default function DistancePresets({
  value,
  onChange,
}: {
  value?: number;
  onChange: (v: number | undefined) => void;
}) {
  const { isOpen, onOpen, onClose } = useDisclose();
  const [tmp, setTmp] = useState<number>(value ?? 5);

  const applyCustom = () => {
    onChange(tmp || undefined);
    onClose();
  };

  return (
    <>
      <Wrap direction="row" space={2} alignItems="center">
        {PRESETS.map((km, i) => (
          <Chip
            key={i}
            label={km === undefined ? "Any" : `${km} km`}
            isActive={value === km || (km === undefined && value === undefined)}
            onPress={() => onChange(km)}
          />
        ))}
        <Chip label="Custom…" onPress={onOpen} />
      </Wrap>

      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content>
          <HStack space={2} alignItems="center" mt={2}>
            <IconButton
              onPress={() => setTmp((v) => Math.max(0, (v ?? 0) - 1))}
              icon={<Ionicons name="remove" size={20} color="#111" />}
            />
            <Input
              keyboardType="numeric"
              value={String(tmp ?? "")}
              w="32"
              onChangeText={(t) => setTmp(Number(t.replace(/[^\d]/g, "")) || 0)}
              InputRightElement={<Text mr={3}>km</Text>}
            />
            <IconButton
              onPress={() => setTmp((v) => (v ?? 0) + 1)}
              icon={<Ionicons name="add" size={20} color="#111" />}
            />
          </HStack>
          <Chip label="Apply" isActive onPress={applyCustom} />
        </Actionsheet.Content>
      </Actionsheet>
    </>
  );
}

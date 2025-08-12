import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Box, Slider } from "native-base";
import LabelHeader from "./LabelHeader";

interface Props {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  onChange: (v: number) => void;
  onSlideStart?: () => void; // NEW
  onSlideEnd?: () => void; // NEW
}

export default function SingleSlider({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  unit = "",
  onChange,
  onSlideStart,
  onSlideEnd,
}: Props) {
  const [internal, setInternal] = useState(value);
  useEffect(() => setInternal(value), [value]);

  return (
    <>
      <LabelHeader label={label} valueText={`${unit} ${internal}`} />

      <Box px={4} py={2}>
        {/* Šitas wrapper’is pagauna gestą ir neleidžia jam „nutekėti“ į ScrollView */}
        <View
          onStartShouldSetResponderCapture={() => true}
          onMoveShouldSetResponderCapture={() => true}
          onTouchStart={onSlideStart}
          onTouchEnd={onSlideEnd}
          pointerEvents="box-only"
        >
          <Slider
            value={internal}
            minValue={min}
            maxValue={max}
            step={step}
            onChange={setInternal}
            onChangeEnd={onChange}
            w="100%"
            accessibilityLabel={label}
            accessibilityRole="adjustable"
            mt={1}
            mb={2}
          >
            <Slider.Track
              bg="coolGray.200"
              _dark={{ bg: "coolGray.700" }}
              h="6"
              borderRadius={3}
            >
              <Slider.FilledTrack bg="primary.500" />
            </Slider.Track>

            <Slider.Thumb
              // didesnis „grab“ jausmas
              style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                backgroundColor: "#3B82F6",
                borderWidth: 2,
                borderColor: "#fff",
                elevation: 2,
                shadowColor: "#000",
                shadowOpacity: 0.1,
                shadowRadius: 4,
                shadowOffset: { width: 0, height: 2 },
              }}
              hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
              _pressed={{ style: { width: 32, height: 32, borderRadius: 16 } }}
            />
          </Slider>
        </View>
      </Box>
    </>
  );
}

// src/components/ui/form/CustomSlider.tsx
import React from "react";
import { VStack, Slider, Text } from "native-base";
import { AccessibilityProps } from "react-native";

interface CustomSliderProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (val: number) => void;
}

export default function CustomSlider({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  onChange,
}: CustomSliderProps) {
  return (
    <VStack
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel={label}
      accessibilityValue={{ min, max, now: value }}
      accessibilityHint={`Adjust ${label} between ${min} and ${max}`}
    >
      <Text>
        {label}: {value}
      </Text>
      <Slider
        minValue={min}
        maxValue={max}
        step={step}
        value={value}
        onChange={onChange}
        accessibilityLabel={label}
        accessibilityHint={`Double tap and swipe to change ${label}`}
        accessibilityRole="adjustable"
        accessibilityValue={{
          min,
          max,
          now: value,
        }}
      >
        <Slider.Track>
          <Slider.FilledTrack />
        </Slider.Track>
        <Slider.Thumb />
      </Slider>
    </VStack>
  );
}

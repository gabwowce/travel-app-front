// src/components/ui/form/CustomSlider.tsx
import React from "react";
import { VStack, Slider, Text } from "native-base";

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
    <VStack>
      <Text>{label}: {value}</Text>
      <Slider
        minValue={min}
        maxValue={max}
        step={step}
        value={value}
        onChange={onChange}
      >
        <Slider.Track>
          <Slider.FilledTrack />
        </Slider.Track>
        <Slider.Thumb />
      </Slider>
    </VStack>
  );
}

// src/components/ui/forms/CustomRangeSlider.tsx
import React from "react";
import { VStack, Text } from "native-base";
import MultiSlider from "@ptomasroos/react-native-multi-slider";

interface CustomRangeSliderProps {
  label: string;
  values: [number, number];
  min?: number;
  max?: number;
  step?: number;
  onValuesChange: (vals: [number, number]) => void;
}

export default function CustomRangeSlider({
  label,
  values,
  min = 0,
  max = 5000,
  step = 50,
  onValuesChange,
}: CustomRangeSliderProps) {
  return (
    <VStack space={2} accessible accessibilityRole="adjustable">
      <Text bold fontSize="sm">
        {label}: {values[0]} – {values[1]}
      </Text>
      <MultiSlider
        values={values}
        sliderLength={280}
        min={min}
        max={max}
        step={step}
        snapped
        onValuesChange={(arr) =>
          onValuesChange([arr[0] as number, arr[1] as number])
        }
        containerStyle={{ height: 40 }}
        trackStyle={{ height: 6, backgroundColor: "#E2E8F0" }}
        selectedStyle={{ backgroundColor: "#3B82F6" }}
        markerStyle={{
          height: 24,
          width: 24,
          backgroundColor: "#FFFFFF",
          borderWidth: 2,
          borderColor: "#3B82F6",
        }}
        pressedMarkerStyle={{
          height: 28,
          width: 28,
          backgroundColor: "#3B82F6",
        }}
      />
    </VStack>
  );
}

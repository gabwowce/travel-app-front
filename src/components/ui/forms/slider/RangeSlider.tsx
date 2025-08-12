import React, { useEffect, useState } from "react";
import { useWindowDimensions } from "react-native";
import { VStack, Box } from "native-base";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import LabelHeader from "./LabelHeader";

interface Props {
  label: string;
  values: [number, number];
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  onValuesChange: (v: [number, number]) => void;
  onSlideStart?: () => void; // NEW
  onSlideEnd?: () => void; // NEW
}

export default function RangeSlider({
  label,
  values,
  min = 0,
  max = 1000,
  step = 1, // mažesnis step -> „smoother“
  unit = "",
  onValuesChange,
  onSlideStart,
  onSlideEnd,
}: Props) {
  const { width } = useWindowDimensions();
  const horizontalPadding = 32;
  const sliderLen = Math.max(0, width - horizontalPadding * 2);

  const [internal, setInternal] = useState(values);
  useEffect(() => setInternal(values), [values]);

  const markerBase = {
    height: 28,
    width: 28,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#3B82F6",
    borderRadius: 14,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  } as const;

  return (
    <VStack>
      <LabelHeader
        label={label}
        valueText={`${unit} ${internal[0]} – ${unit} ${internal[1]}`}
      />
      <Box px={horizontalPadding / 2} py={2}>
        <MultiSlider
          values={internal}
          sliderLength={sliderLen}
          min={min}
          max={max}
          step={step}
          snapped={false} // palik false dėl „smoother“; jei reikia snap – true
          onValuesChange={([l, r]) => setInternal([l as number, r as number])}
          onValuesChangeFinish={([l, r]) =>
            onValuesChange([l as number, r as number])
          }
          onValuesChangeStart={onSlideStart} // <-- išjungiam scroll
          onValuesChangeFinish={(vals) => {
            // <-- įjungiam scroll
            onSlideEnd?.();
            const [l, r] = vals as number[];
            onValuesChange([l, r]);
          }}
          containerStyle={{ height: 56, alignSelf: "center" }}
          trackStyle={{
            height: 6,
            borderRadius: 3,
            backgroundColor: "#E2E8F0",
          }}
          selectedStyle={{ backgroundColor: "#3B82F6" }}
          markerStyle={markerBase}
          pressedMarkerStyle={{
            ...markerBase,
            height: 32,
            width: 32,
            borderRadius: 16,
          }}
          touchDimensions={{
            height: 56,
            width: 56,
            borderRadius: 28,
            slipDisplacement: 250,
          }}
          allowOverlap={false}
          enableLabel={false}
          slipDisplacement={250} // mažiau reaguoja į vertikalius „slips“
        />
      </Box>
    </VStack>
  );
}

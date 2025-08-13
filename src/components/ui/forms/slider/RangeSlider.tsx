import React, { useEffect, useMemo, useState } from "react";
import { View, LayoutChangeEvent, StyleSheet } from "react-native";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import { RangeSliderConfig, distanceCfg } from "@/src/config/distanceRange";

type Props = {
  values: [number, number];

  // callback'ai
  onValuesChange: (v: [number, number]) => void; // "live" į viršų
  onValuesChangeStart?: () => void;
  onValuesChangeFinish?: (v: [number, number]) => void; // "finish" į viršų

  // alias'ai (nebūtina naudot)
  onChange?: (v: [number, number]) => void;
  onSlidingStart?: () => void;
  onSlidingComplete?: (v: [number, number]) => void;

  // dalinis konfigo override (jei nori)
  config?: Partial<RangeSliderConfig>;
};

export default function RangeSlider({
  values,
  onValuesChange,
  onValuesChangeStart,
  onValuesChangeFinish,
  onChange,
  onSlidingStart,
  onSlidingComplete,
  config,
}: Props) {
  const cfg: RangeSliderConfig = useMemo(() => {
    // giliai sujungiame colors + pavienius laukus
    return {
      ...distanceCfg,
      ...(config ?? {}),
      colors: {
        ...distanceCfg.colors,
        ...(config?.colors ?? {}),
      },
      trackHeight: config?.trackHeight ?? distanceCfg.trackHeight,
      trackRadius: config?.trackRadius ?? distanceCfg.trackRadius,
      horizontalPadding:
        config?.horizontalPadding ?? distanceCfg.horizontalPadding,
      touchSize: config?.touchSize ?? distanceCfg.touchSize,
      slipTolerance: config?.slipTolerance ?? distanceCfg.slipTolerance,
      baseTrackColor: config?.baseTrackColor ?? distanceCfg.baseTrackColor,
    };
  }, [config]);

  const {
    min,
    max,
    step = 1,
    colors,
    trackHeight = 6,
    trackRadius = 999,
    horizontalPadding = 16,
    touchSize = 140,
    slipTolerance = 10000,
    baseTrackColor = "#E5E7EB",
  } = cfg;

  const activeTrackColor = colors.active;
  const inactiveTrackColor = colors.inactive;
  const thumbColor = colors.thumb;
  const thumbBorderColor = colors.thumbBorder;

  const [internal, setInternal] = useState<[number, number]>(values);
  const [sliderLen, setSliderLen] = useState(0);

  useEffect(() => setInternal(values), [values[0], values[1]]);

  const onLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    setSliderLen(Math.max(0, w - horizontalPadding * 2));
  };

  const markerBase = {
    height: 30,
    width: 30,
    backgroundColor: thumbColor,
    borderWidth: 2,
    borderColor: thumbBorderColor,
    borderRadius: 15,
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  } as const;

  return (
    <View
      style={[styles.wrap, { paddingHorizontal: horizontalPadding }]}
      onLayout={onLayout}
    >
      {/* bazinė pilka juosta po apačia */}
      <View
        pointerEvents="none"
        style={[StyleSheet.absoluteFillObject, { justifyContent: "center" }]}
      >
        <View
          style={{
            height: trackHeight,
            borderRadius: trackRadius,
            backgroundColor: baseTrackColor,
            marginHorizontal: horizontalPadding,
          }}
        />
      </View>

      {sliderLen > 0 && (
        <MultiSlider
          values={internal}
          sliderLength={sliderLen}
          min={min}
          max={max}
          step={step}
          // spalvos
          trackStyle={{
            height: trackHeight,
            borderRadius: trackRadius,
            backgroundColor: inactiveTrackColor,
          }}
          selectedStyle={{ backgroundColor: activeTrackColor }}
          unselectedStyle={{ backgroundColor: inactiveTrackColor }}
          markerStyle={markerBase}
          pressedMarkerStyle={{
            ...markerBase,
            height: 34,
            width: 34,
            borderRadius: 17,
          }}
          enableLabel={false}
          allowOverlap={false}
          snapped={false}
          // didelis hitbox + didelė slip tolerancija → drag nesibaigia iki atleidimo
          touchDimensions={{
            height: touchSize,
            width: touchSize,
            borderRadius: touchSize / 2,
            slipDisplacement: slipTolerance,
          }}
          // LIVE → į viršų
          onValuesChange={([l, r]) => {
            const v: [number, number] = [l as number, r as number];
            setInternal(v);
            onValuesChange(v);
            onChange?.(v);
          }}
          onValuesChangeStart={() => {
            onValuesChangeStart?.();
            onSlidingStart?.();
          }}
          onValuesChangeFinish={([l, r]) => {
            const v: [number, number] = [l as number, r as number];
            onValuesChangeFinish?.(v);
            onSlidingComplete?.(v);
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { height: 56, justifyContent: "center" },
});

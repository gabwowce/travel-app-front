// src/components/ui/forms/DistanceRange.tsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, LayoutChangeEvent } from "react-native";
import RangeSlider from "../forms/slider/RangeSlider";

export type DistanceRangeConfig = {
  min: number;
  max: number;
  step?: number;
  unit?: string;
  precision?: number;
  live?: boolean; // default FALSE — commit tik pabaigoj
  showBubbles?: boolean;
  showEdgeLabels?: boolean;
  colors?: {
    active?: string;
    inactive?: string;
    thumb?: string;
    thumbBorder?: string;
  };
};

type Props = {
  value: [number, number];
  onChange: (v: [number, number]) => void; // commit (dažn. finish)
  onChangeLive?: (v: [number, number]) => void; // jei nori gauti „live“
  config: DistanceRangeConfig;
  onDragStart?: () => void;
  onDragEnd?: () => void;
};

const DEFAULT = "#001F3F";
const BUBBLE_MIN_W = 56;

const clamp = (n: number, a: number, b: number) => Math.min(Math.max(n, a), b);

export default function DistanceRange({
  value,
  onChange,
  onChangeLive,
  config,
  onDragStart,
  onDragEnd,
}: Props) {
  const {
    min,
    max,
    step = 1,
    unit = "km",
    precision = 0,
    live = false, // ← svarbu: smooth by default
    showBubbles = true,
    showEdgeLabels = true,
    colors,
  } = config;

  const activeColor = colors?.active ?? DEFAULT;
  const inactiveColor = colors?.inactive ?? "transparent";
  const thumbColor = colors?.thumb ?? "#fff";
  const thumbBorder = colors?.thumbBorder ?? activeColor;

  // vietinis draft — čia piešiam „live“
  const [draft, setDraft] = useState<[number, number]>(value);
  useEffect(() => setDraft(value), [value[0], value[1], min, max]);

  const [trackW, setTrackW] = useState(0);
  const [minBW, setMinBW] = useState(BUBBLE_MIN_W);
  const [maxBW, setMaxBW] = useState(BUBBLE_MIN_W);

  const [minKm, maxKm] = useMemo(() => {
    const a = clamp(draft[0], min, max);
    const b = clamp(draft[1], min, max);
    return a <= b ? [a, b] : [b, a];
  }, [draft, min, max]);

  const pct = useCallback(
    (v: number) => (v - min) / Math.max(1, max - min),
    [min, max]
  );

  const onTrackLayout = (e: LayoutChangeEvent) =>
    setTrackW(e.nativeEvent.layout.width);

  const minLeft = Math.min(
    Math.max(pct(minKm) * trackW - minBW / 2, 0),
    Math.max(0, trackW - minBW)
  );
  const maxLeft = Math.min(
    Math.max(pct(maxKm) * trackW - maxBW / 2, 0),
    Math.max(0, trackW - maxBW)
  );

  const format = useCallback(
    (n: number) => `${n.toFixed(precision)} ${unit}`,
    [precision, unit]
  );

  const toSortedClamped = (vals: [number, number]) => {
    const [a, b] = vals;
    const lo = clamp(Math.min(a, b), min, max);
    const hi = clamp(Math.max(a, b), min, max);
    return [lo, hi] as [number, number];
  };

  const noop = () => {};

  return (
    <View style={styles.wrap}>
      {/* Burbuliukai – juda 1:1 su thumb'ais */}
      {showBubbles && (
        <View style={styles.bubblesRow} pointerEvents="none">
          <View
            style={[styles.bubble, { left: minLeft }]}
            onLayout={(e) =>
              setMinBW(Math.max(BUBBLE_MIN_W, e.nativeEvent.layout.width))
            }
          >
            <Text style={styles.bubbleTxt}>{format(minKm)}</Text>
          </View>
          <View
            style={[styles.bubble, { left: maxLeft }]}
            onLayout={(e) =>
              setMaxBW(Math.max(BUBBLE_MIN_W, e.nativeEvent.layout.width))
            }
          >
            <Text style={styles.bubbleTxt}>{format(maxKm)}</Text>
          </View>
        </View>
      )}

      <View style={styles.sliderRow} onLayout={onTrackLayout}>
        <RangeSlider
          min={min}
          max={max}
          step={step}
          values={[minKm, maxKm]}
          activeTrackColor={activeColor}
          inactiveTrackColor={inactiveColor}
          thumbColor={thumbColor}
          thumbBorderColor={thumbBorder}
          // LIVE: tik vietinis + optional hook į viršų
          onValuesChange={(vals) => {
            const v = toSortedClamped(vals);
            setDraft(v);
            onChangeLive?.(v);
            if (live) onChange(v); // jei būtinai nori live commit'o
          }}
          onValuesChangeStart={onDragStart ?? noop}
          onValuesChangeFinish={(vals) => {
            const v = toSortedClamped(vals);
            setDraft(v);
            if (!live) onChange(v); // default – commit tik finish
            (onDragEnd ?? noop)();
          }}
        />
      </View>

      {showEdgeLabels && (
        <View style={styles.labelsRow} pointerEvents="none">
          <Text style={styles.labelTxt}>{format(min)}</Text>
          <Text style={styles.labelTxt}>{format(max)}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 8 },
  bubblesRow: { height: 0, position: "relative" },
  bubble: {
    position: "absolute",
    top: 0,
    minWidth: 56,
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: "#fff",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  bubbleTxt: { fontWeight: "700", color: "#0F172A", fontSize: 15 },
  sliderRow: { position: "relative", paddingTop: 30 }, // vieta burbuliukams
  labelsRow: {
    marginTop: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  labelTxt: { fontSize: 12, color: "#64748B" },
});

// src/components/ui/forms/DistanceRange.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import RangeSlider from "../forms/slider/RangeSlider";

const ACCENT = "#001F3F";

type Props = {
  value?: [number, number]; // km
  onChange: (v: [number, number]) => void;
  min?: number;
  max?: number;
  step?: number;
  onDragStart?: () => void;
  onDragEnd?: () => void;
};

export default function DistanceRange({
  value = [0, 50],
  onChange,
  min = 0,
  max = 200,
  step = 1,
  onDragStart,
  onDragEnd,
}: Props) {
  const [minKm, maxKm] = value;
  const handleChange = (vals: number[] | [number, number]) => {
    const [a, b] = vals as [number, number];
    onChange([Math.min(a, b), Math.max(a, b)]);
  };

  const noop = () => {};

  return (
    <View style={styles.wrap}>
      <View style={styles.headerRow}>
        <Pill>{minKm} km</Pill>
        <Text style={styles.dash}>–</Text>
        <Pill>{maxKm} km</Pill>
      </View>

      <RangeSlider
        min={min}
        max={max}
        step={step}
        values={[minKm, maxKm]}
        thumbColor={ACCENT}
        activeTrackColor={ACCENT}
        // ✅ Visada paduodam funkciją – kad viduje nekristų
        onValuesChange={handleChange}
        onValuesChangeStart={onDragStart ?? noop}
        onValuesChangeFinish={(vals: any) => {
          handleChange(vals ?? [minKm, maxKm]);
          (onDragEnd ?? noop)();
        }}
        // ✅ Papildomi alias’ai, jei tavo RangeSlider naudoja kitus pavadinimus
        onChange={handleChange}
        onSlidingStart={onDragStart ?? noop}
        onSlidingComplete={(vals: any) => {
          handleChange(vals ?? [minKm, maxKm]);
          (onDragEnd ?? noop)();
        }}
      />

      <View style={styles.scaleRow}>
        <Text style={styles.scaleTxt}>{min} km</Text>
        <Text style={styles.scaleTxt}>{max} km</Text>
      </View>
    </View>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return <Text style={styles.pill}>{children}</Text>;
}

const styles = StyleSheet.create({
  wrap: { gap: 10 },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  dash: { fontSize: 16, color: "#0F172A" },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    color: "#0F172A",
    fontWeight: "600",
  },
  scaleRow: {
    marginTop: 2,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  scaleTxt: { fontSize: 12, color: "#64748B" },
});

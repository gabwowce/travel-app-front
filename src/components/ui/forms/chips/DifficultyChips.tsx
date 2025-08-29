// src/components/ui/forms/DifficultyChips.tsx
import PressableLog from "@/src/components/PressableLog";
import { DifficultyLevel } from "@/src/data/features/types/routeFilters";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const ACCENT = "#001F3F";
const BORDER = "#E5E7EB";

export default function DifficultyChips({
  value,
  onChange,
}: {
  value?: DifficultyLevel;
  onChange: (v: DifficultyLevel) => void;
}) {
  const items: { label: string; value: DifficultyLevel }[] = [
    { label: "All", value: "" as DifficultyLevel },
    { label: "Easy", value: "easy" as DifficultyLevel },
    { label: "Moderate", value: "moderate" as DifficultyLevel },
    { label: "Challenging", value: "challenging" as DifficultyLevel },
    { label: "Difficult", value: "difficult" as DifficultyLevel },
  ];

  return (
    <View style={styles.row}>
      {items.map((it) => {
        const selected = (value ?? "") === it.value;
        return (
          <PressableLog
            analyticsLabel={`Difficulty ${it.label}`}
            key={it.value || "all"}
            onPress={() => onChange(it.value)}
            style={[styles.chip, selected && styles.chipActive]}
            android_ripple={{ color: "#00000010", borderless: false }}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            accessibilityLabel={`Difficulty ${it.label}`}
          >
            <Text style={[styles.txt, selected && styles.txtActive]}>
              {it.label}
            </Text>
          </PressableLog>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  chip: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12, // švelnesnis kampas (kaip input’ų)
    paddingHorizontal: 16,
    height: 44, // kaip Select
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F7FA",
  },
  chipActive: {
    backgroundColor: "#001F3F",
    borderColor: "#001F3F",
  },
  txt: { color: "#001F3F", fontSize: 15, fontWeight: "700" },
  txtActive: { color: "#FFF" },
});

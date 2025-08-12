// src/components/ui/forms/DifficultyChips.tsx
import { DifficultyLevel } from "@/src/data/features/types/routeFilters";
import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

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
    { label: "All", value: "" },
    { label: "Easy", value: "easy" },
    { label: "Moderate", value: "moderate" },
    { label: "Challenging", value: "challenging" },
    { label: "Difficult", value: "difficult" },
    { label: "Hard", value: "hard" },
  ];

  return (
    <View style={styles.row}>
      {items.map((it) => {
        const selected = (value ?? "") === it.value;
        return (
          <Pressable
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
          </Pressable>
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

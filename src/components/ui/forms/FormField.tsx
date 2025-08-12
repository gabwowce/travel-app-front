// src/components/ui/forms/FormField.tsx
import React, { PropsWithChildren } from "react";
import { View, Text, StyleSheet } from "react-native";

const ACCENT = "#001F3F";

type Props = {
  label: string;
  required?: boolean;
  hint?: string;
  spacing?: number; // vertical gap under the control
};

export default function FormField({
  label,
  required,
  hint,
  spacing = 16,
  children,
}: PropsWithChildren<Props>) {
  return (
    <View style={{ marginBottom: spacing }}>
      <Text style={styles.label}>
        {label}
        {required ? <Text style={styles.required}> *</Text> : null}
      </Text>

      {children}

      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 13,
    color: "#334155", // slate-700
    marginBottom: 6,
    fontWeight: "500",
    letterSpacing: 0.2,
  },
  required: { color: ACCENT },
  hint: {
    marginTop: 6,
    fontSize: 12,
    color: "#64748B", // slate-500
  },
});

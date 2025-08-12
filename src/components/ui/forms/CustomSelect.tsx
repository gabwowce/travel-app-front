// src/components/ui/forms/CustomSelect.tsx
import React from "react";
import { StyleSheet, View, ViewStyle, TextStyle } from "react-native";
import { Select } from "native-base";
import { Ionicons } from "@expo/vector-icons";

const ACCENT = "#001F3F";
const BORDER = "#E5E7EB";

interface CustomSelectProps {
  placeholder?: string;
  selectedValue?: string; // "" = „All“ (laikome NE aktyvia)
  onValueChange: (value: string) => void;
  options: { label: string; value: string }[];
  isDisabled?: boolean;

  containerStyle?: ViewStyle;
  textColor?: string; // dropdown list selected text
  borderColor?: string;
  placeholderTextColor?: string;
  inputTextStyle?: TextStyle; // papildomas trigger teksto stilius
}

export default function CustomSelect({
  placeholder,
  selectedValue,
  onValueChange,
  options,
  isDisabled = false,
  containerStyle,
  textColor = ACCENT,
  borderColor = BORDER,
  placeholderTextColor = "#94A3B8",
  inputTextStyle,
}: CustomSelectProps) {
  // aktyvus tik jei reali reikšmė (ne undefined/null/tuščia)
  const isActive =
    selectedValue !== undefined &&
    selectedValue !== null &&
    selectedValue !== "";

  return (
    <View
      style={[
        styles.container,
        { borderColor },
        isActive ? styles.chipActive : styles.chipInactive,
        isDisabled && styles.disabled,
        containerStyle,
      ]}
      pointerEvents={isDisabled ? "none" : "auto"}
    >
      <Select
        selectedValue={selectedValue}
        placeholder={placeholder ?? "Select option"}
        onValueChange={onValueChange}
        variant="unstyled"
        minH={44}
        px={0}
        py={0}
        // 👇 Trigger teksto spalva nustatoma tiesiog su `color`
        color={isActive ? "#FFFFFF" : "#0F172A"}
        // papildomas svoris/dydis per _text
        _text={{
          fontSize: 15,
          fontWeight: isActive ? "700" : "600",
          ...(inputTextStyle ?? {}),
        }}
        dropdownIcon={
          <Ionicons
            name="chevron-down"
            size={18}
            color={isActive ? "#FFFFFF" : "#6B7280"}
            style={{ marginTop: -2 }}
          />
        }
        _actionSheetContent={{ bg: "white" }}
        // pažymėtas item dropdown'e
        _selectedItem={{
          bg: "transparent",
          _text: { color: textColor, fontWeight: "700" },
          endIcon: <Ionicons name="checkmark" size={18} color={ACCENT} />,
        }}
        placeholderTextColor={placeholderTextColor}
      >
        {options.map((o) => (
          <Select.Item
            key={o.value}
            label={o.label}
            value={o.value}
            // paliekam tamsų tekstą sąraše
            _text={{ color: "#0F172A", fontSize: 15 }}
          />
        ))}
      </Select>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    height: 44,
    borderWidth: 1,
    borderRadius: 14,
    paddingLeft: 14,
    paddingRight: 16,
    justifyContent: "center",
  },
  chipInactive: {
    backgroundColor: "#F5F7FA",
    borderColor: BORDER,
  },
  chipActive: {
    backgroundColor: ACCENT,
    borderColor: ACCENT,
  },
  disabled: {
    opacity: 0.5,
  },
});

import React from "react";
import { Box, Select, Text } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";

interface CustomSelectProps {
  label?: string;
  placeholder?: string;
  selectedValue: string | undefined;
  onValueChange: (value: string) => void;
  options: { label: string; value: string }[];
  isDisabled?: boolean;
}

export default function CustomSelect({
  label,
  placeholder,
  selectedValue,
  onValueChange,
  options,
  isDisabled = false,
}: CustomSelectProps) {
  return (
    <>
      {label && <Text mb={1}>{label}</Text>}
     <Select
  selectedValue={selectedValue}
  placeholder={placeholder ?? "Select option"}
  onValueChange={onValueChange}
  isDisabled={isDisabled}
  style={styles.selectStyle}
  borderColor="gray.300"
  fontSize="sm"
  accessibilityLabel={label ?? placeholder ?? "Dropdown menu"}
  accessibilityHint="Double tap to open the list of options"
  accessibilityRole="menu"
  accessible={true}
  dropdownIcon={
    <Box mr={4}>
      <Ionicons name="chevron-down" size={16} color="#6b7280" />
    </Box>
  }
  _selectedItem={{
    bg: "primary.100",
    endIcon: <Ionicons name="checkmark" size={18} color="#3b82f6" />,
  }}
>
  {options.map((opt) => (
    <Select.Item
      key={opt.value}
      label={opt.label}
      value={opt.value}
      accessibilityLabel={opt.label}
      accessibilityRole="menuitem"
    />
  ))}
</Select>

    </>
  );
}

const styles = StyleSheet.create({
  selectStyle: {
    borderRadius: 24,
  },

});

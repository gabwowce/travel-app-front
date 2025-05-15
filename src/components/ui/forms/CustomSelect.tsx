// src/components/ui/form/CustomSelect.tsx
import React from "react";
import { Select, Text } from "native-base";

interface CustomSelectProps {
  label?: string;
  placeholder?: string;
  selectedValue: string | undefined;
  onValueChange: (value: string) => void;
  options: { label: string; value: string }[];
  isDisabled?: boolean; // 👈 PADARYTI OPTIONAL
}

export default function CustomSelect({
  label,
  placeholder,
  selectedValue,
  onValueChange,
  options,
  isDisabled = false, // 👈 DEFAULT FALSE
}: CustomSelectProps) {
  return (
    <>
      {label && <Text mb={1}>{label}</Text>}
      <Select
        selectedValue={selectedValue}
        placeholder={placeholder ?? "Select option"}
        onValueChange={onValueChange}
        isDisabled={isDisabled} // 👈 PRITAIKOM ČIA
      >
        {options.map((opt) => (
          <Select.Item key={opt.value} label={opt.label} value={opt.value} />
        ))}
      </Select>
    </>
  );
}

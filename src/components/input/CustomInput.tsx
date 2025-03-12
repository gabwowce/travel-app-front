import React from "react";
import { Input, IInputProps } from "native-base";
import { KeyboardTypeOptions } from "react-native";

interface CustomInputProps extends IInputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
}

const CustomInput: React.FC<CustomInputProps> = ({
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType = "default",
  ...props
}) => {
  return (
    <Input
      variant="filled"
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      autoCapitalize="none"
      autoCorrect={false}
      mb={3}
      {...props}
    />
  );
};

export default CustomInput;

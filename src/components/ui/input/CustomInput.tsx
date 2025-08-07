import React, { forwardRef } from "react";
import {
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInputProps,
} from "react-native";
import { Text, useTheme } from "native-base";
import { Ionicons } from "@expo/vector-icons";

/* ----- Props tipas ----- */
export interface CustomInputProps extends TextInputProps {
  label?: string;
  error?: string;
  onForgotPassword?: () => void;
  accessibilityLabel?: string;
}

/* ----- Komponentas su forwardRef (be generics call-site) ----- */
const CustomInput = forwardRef(
  (
    {
      label,
      error,
      secureTextEntry,
      onForgotPassword,
      accessibilityLabel,
      multiline = false,
      numberOfLines = 1,
      ...props
    }: CustomInputProps,
    ref: React.ForwardedRef<TextInput>
  ) => {
    const theme = useTheme();
    const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);

    const showToggle = !!secureTextEntry;

    return (
      <View style={styles.container}>
        {label && <Text style={styles.label}>{label}</Text>}

        <View style={styles.inputWrapper}>
          <TextInput
            ref={ref}
            accessible
            accessibilityLabel={
              accessibilityLabel ?? label ?? props.placeholder
            }
            accessibilityHint={props.placeholder}
            accessibilityState={{ disabled: props.editable === false }}
            style={[
              styles.input,
              multiline && styles.textArea,
              error && styles.inputError,
            ]}
            placeholderTextColor={theme.colors.gray[400]}
            secureTextEntry={showToggle && !isPasswordVisible}
            multiline={multiline}
            numberOfLines={numberOfLines}
            textAlignVertical={multiline ? "top" : "center"}
            {...props}
          />

          {showToggle && (
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setIsPasswordVisible((p) => !p)}
            >
              <Ionicons
                name={isPasswordVisible ? "eye-off" : "eye"}
                size={20}
                color="#666"
              />
            </TouchableOpacity>
          )}
        </View>

        {error && <Text style={styles.error}>{error}</Text>}

        {secureTextEntry && onForgotPassword && (
          <TouchableOpacity onPress={onForgotPassword}>
            <Text
              style={styles.forgotPassword}
              accessibilityRole="button"
              accessibilityLabel="Forgot Password"
            >
              Forgot Password?
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }
);

export default CustomInput;

/* ----- stiliai ----- */
const styles = StyleSheet.create({
  container: { marginBottom: 24, width: "100%" },
  label: { fontSize: 14, fontWeight: "500", color: "#333", marginBottom: 8 },
  inputWrapper: { flexDirection: "row", alignItems: "center" },
  input: {
    backgroundColor: "#f0f0f0",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 16,
    width: "100%",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    fontSize: 15,
  },
  textArea: { minHeight: 100, paddingVertical: 12 },
  inputError: { borderColor: "red" },
  error: { color: "red", marginTop: 4, fontSize: 12 },
  eyeIcon: { position: "absolute", right: 12, padding: 4 },
  forgotPassword: {
    textAlign: "right",
    marginTop: 6,
    fontSize: 13,
    color: "#0C2736",
  },
});

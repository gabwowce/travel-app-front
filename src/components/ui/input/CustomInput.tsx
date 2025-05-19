import React, { useState } from "react";
import {
  TextInput,
  View,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
} from "react-native";
import { Text, useTheme } from "native-base";
import { Ionicons } from "@expo/vector-icons";

type Props = TextInputProps & {
  label?: string;
  error?: string;
  onForgotPassword?: () => void;
};

export default function CustomInput({
  label,
  error,
  secureTextEntry,
  onForgotPassword,
  ...props
}: Props) {
  const theme = useTheme();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const shouldShowToggle = !!secureTextEntry;


  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View style={styles.inputWrapper}>
        <TextInput
          style={[styles.input, error && styles.inputError]}
          placeholderTextColor={theme.colors.gray[400]}
          secureTextEntry={shouldShowToggle && !isPasswordVisible}
          {...props}
        />

        {shouldShowToggle && (
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setIsPasswordVisible((prev) => !prev)}
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
          <Text style={styles.forgotPassword} color="primary.500">
            Forget Password?
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    width: "100%",
  },
   inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  eyeIcon: {
    position: "absolute",
    right: 12,
    padding: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#eaeaea",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 18,
    width: "100%",
    borderWidth: 1,                // 👈 pridėta
  borderColor: "#eaeaea",
  },
  inputError: {
    borderWidth: 1,
    borderColor: "red",
  },
  error: {
    color: "red",
    marginTop: 4,
    fontSize: 12,
  },
  
  forgotPassword: {
    textAlign: "right",
    marginTop: 6,
    fontSize: 13,
  },
});

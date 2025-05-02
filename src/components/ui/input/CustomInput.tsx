import React from "react";
import { TextInput, View, StyleSheet, TextInputProps, TouchableOpacity } from "react-native";
import { Text, useTheme } from "native-base"; // 🔹 Importuojam useTheme

type Props = TextInputProps & {
  label?: string;
  error?: string;
  onForgotPassword?: () => void;
};

export default function CustomInput({ label, error, secureTextEntry, onForgotPassword, ...props }: Props) {
  const theme = useTheme(); // 🔹 Gauname dinamišką temą

  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, error && styles.inputError]}
        placeholderTextColor={theme.colors.gray[400]}
        secureTextEntry={secureTextEntry}
        {...props}
      />
      {error && <Text style={styles.error}>{error}</Text>}

      {/* Rodyti "Forget Password?", jei tai slaptažodžio laukas */}
      {secureTextEntry && onForgotPassword && (
        <TouchableOpacity onPress={onForgotPassword}>
          <Text variant="body" color="primary" style={[styles.forgotPassword]}>
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
  input: {
    backgroundColor: "#eaeaea",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 18,
    width: "100%",
  },
  inputError: {
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
  },
});

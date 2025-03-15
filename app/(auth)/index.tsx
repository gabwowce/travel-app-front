import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "native-base";
import Button from "@/src/components/btns/Button";
import { useRouter } from "expo-router";
import { login, clearErrors } from "@/src/data/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/src/data/hooks";
import CustomInput from "@/src/components/input/CustomInput";
import KeyboardWrapper from "@/src/components/KeyboardWrapper"; // 🔹 Importuojam naują komponentą
import ScreenContainer from "@/src/components/ScreenContainer";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state) => state.auth.loading);
  const errors = useAppSelector((state) => state.auth.errors);
  

  const handleLogin = async () => {
    const resultAction = await dispatch(login({ email, password }));
    if (login.fulfilled.match(resultAction)) {
      router.push("/(app)/(tabs)/home");
    }
  };

  return (
    <KeyboardWrapper>
      <ScreenContainer variant="center">
        <View style={styles.text}>
          <Text variant="header1">Sign in now</Text>
          <Text variant="bodyGray">Please sign in to continue</Text>
        </View>
  
        <CustomInput
          label="Email"
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          error={errors.email}
        />
        <CustomInput
          label="Password"
          placeholder="Enter your password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          error={errors.password}
          onForgotPassword={() => router.push("/(auth)/forgotPassword")} 
        />
  
        {errors.general && <Text style={{ color: "red", textAlign: "center" }}>{errors.general}</Text>}
  
        <Button label={loading ? "Signing in..." : "Sign in"} onPress={handleLogin} />
  
        <Text
          onPress={() => {
            dispatch(clearErrors());
            router.push("/register");
          }}
          style={{ textAlign: "center", marginTop: 20 }}
        >
          Don't have an account? Register
        </Text>
      </ScreenContainer>
    </KeyboardWrapper>
  );
}

const styles = StyleSheet.create({
  text: {
    alignItems: "center",
    marginBottom: 20,
  },
});

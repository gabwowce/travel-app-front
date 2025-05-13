// LoginScreen.tsx
import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "native-base";
import Button from "@/src/components/ui/btns/Button";
import { Link, useRouter } from "expo-router";

import {
  useLoginUserMutation,          // ← sugeneruotas hook’as
} from "@/src/store/travelApi";

import CustomInput from "@/src/components/ui/input/CustomInput";
import KeyboardWrapper from "@/src/components/KeyboardWrapper";
import ScreenContainer from "@/src/components/ScreenContainer";

export default function LoginScreen() {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  /* --- RTK Query --- */
  const [login, { isLoading, error, reset }] = useLoginUserMutation();

  /* --- Padeda rodyti backend’o klaidas --- */
  const apiErrors = (error as any)?.data?.errors ?? {};      // { email: ['msg'], password: [...] }
  const general   = (error as any)?.data?.message;           // pvz. “Invalid credentials”

 const handleLogin = async () => {
  try {
    await login({                    // ← argumentas
      loginRequest: { email, password }
    }).unwrap();                     // sėkmės atveju
    router.push("/(app)/(tabs)/home");
  } catch {
    /* error jau laikomas hook’o state */
  }
};


  /* Navigacija į registraciją – pakanka „reset()“, kad nuvalytume klaidų būseną */
  const gotoRegister = () => {
    reset();
    router.push("/register");
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
          error={apiErrors.email?.[0]}
        />
        <CustomInput
          label="Password"
          placeholder="Enter your password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          error={apiErrors.password?.[0]}
          onForgotPassword={() => router.push("/(auth)/forgotPassword")}
        />

        {general && (
          <Text style={{ color: "red", textAlign: "center", paddingBottom: 20 }}>
            {general}
          </Text>
        )}

        <Button
          label={isLoading ? "Signing in..." : "Sign in"}
          onPress={handleLogin}
        />

        <Text onPress={gotoRegister} style={styles.link}>
          Don't have an account? Register
        </Text>
        <Text
          onPress={() => router.push("/(legal)/privacy")}
          style={[styles.link, { textDecorationLine: "underline" }]}
        >
          Privacy & Terms
        </Text>
      </ScreenContainer>
    </KeyboardWrapper>
  );
}

const styles = StyleSheet.create({
  text: { alignItems: "center", marginBottom: 20 },
  link: { textAlign: "center", marginTop: 20 },
});

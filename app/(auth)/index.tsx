import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "native-base";
import Button from "@/src/components/ui/btns/Button";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Formik } from "formik";

import CustomInput from "@/src/components/ui/input/CustomInput";
import KeyboardWrapper from "@/src/components/KeyboardWrapper";
import ScreenContainer from "@/src/components/ScreenContainer";
import { loginSchema } from "@/src/validation/loginSchema";

import { useLoginUserMutation } from "@/src/store/travelApi";

const persistAuth = async (token: string, user: any) => {
  await SecureStore.setItemAsync("token", token);
  await SecureStore.setItemAsync("user", JSON.stringify(user));
  await AsyncStorage.setItem("token", token);
  await AsyncStorage.setItem("user", JSON.stringify(user));
};

export default function LoginScreen() {
  const router = useRouter();
  const [login, { isLoading, error, reset }] = useLoginUserMutation();

  const apiErrors = (error as any)?.data?.errors ?? {};
  const general = (error as any)?.data?.message;

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

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={loginSchema}
          onSubmit={async (values, { setErrors }) => {
            try {
              const res = await login({ loginRequest: values }).unwrap();
              const { token, user } = res.data;

              await persistAuth(token, user);
              router.push("/(app)/(tabs)/home");
            } catch (err: any) {
              const backendErrors = err?.data?.errors;
              if (backendErrors) setErrors(backendErrors);
            }
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleSubmit,
          }) => (
            <>
              <CustomInput
                label="Email"
                placeholder="Email"
                autoCapitalize="none"
                keyboardType="email-address"
                value={values.email}
                onChangeText={handleChange("email")}
                error={touched.email && errors.email ? errors.email : undefined}
              />
              <CustomInput
                label="Password"
                placeholder="Enter your password"
                secureTextEntry
                value={values.password}
                onChangeText={handleChange("password")}
                error={touched.password && errors.password ? errors.password : undefined}
                onForgotPassword={() => router.push("/(auth)/forgotPassword")}
              />

              {general && (
                <Text style={styles.generalError}>
                  {general}
                </Text>
              )}

              <Button
                label={isLoading ? "Signing in..." : "Sign in"}
                onPress={() => handleSubmit()}
              />
            </>
          )}
        </Formik>

        <Text onPress={gotoRegister} style={styles.link}>
          Don't have an account? Register
        </Text>
      </ScreenContainer>
    </KeyboardWrapper>
  );
}

const styles = StyleSheet.create({
  text: { alignItems: "center", marginBottom: 20 },
  link: { textAlign: "center", marginTop: 20 },
  generalError: {
    color: "red",
    textAlign: "center",
    paddingBottom: 20,
  },
});

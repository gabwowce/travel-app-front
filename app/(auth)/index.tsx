import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, AccessibilityInfo, TextInput } from "react-native";
import { Text } from "native-base";
import { useRouter } from "expo-router";
import { Formik } from "formik";

import CustomButton from "@/src/components/ui/btns/Button";
import CustomInput from "@/src/components/ui/input/CustomInput";
import KeyboardWrapper from "@/src/components/KeyboardWrapper";
import ScreenContainer from "@/src/components/ScreenContainer";
import { loginSchema } from "@/src/validation/loginSchema";
import { useLoginUserMutation } from "@/src/store/travelApi";
import { useAuthActions } from "@/src/hooks/useAuthActions";
import { AppRoutes } from "@/src/config/routes";
import useAnnounceForAccessibility from "@/src/hooks/useAnnounceForAccessibility";

export default function LoginScreen() {
  // Pagrindinis pranešimas atidarius ekraną
  useAnnounceForAccessibility("Login screen opened");
  const passwordRef = useRef<TextInput>(null);
  const router = useRouter();
  const [generalError, setGeneralError] = useState("");
  const { login } = useAuthActions();
  const [loginUser, { isLoading, reset }] = useLoginUserMutation();

  // 🔈 Klaidos paskelbimas – ne hookas, o tiesiog Accessibility API
  useEffect(() => {
    if (generalError) {
      AccessibilityInfo.announceForAccessibility(generalError);
    }
  }, [generalError]);

  const gotoRegister = () => {
    reset();
    router.push(AppRoutes.REGISTER);
  };

  return (
    <KeyboardWrapper style={styles.wrapper}>
      <ScreenContainer variant="center">
        <View style={styles.text}>
          <Text variant="header1" accessibilityRole="header">
            Sign in now
          </Text>
          <Text variant="bodyGray">Please sign in to continue</Text>
        </View>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={loginSchema}
          onSubmit={async (values) => {
            try {
              await login({ loginRequest: values });
              router.push("/(app)/(tabs)/home");
            } catch (err: any) {
              const message = err?.data?.message ?? "Unknown error";
              setGeneralError(message);
            }
          }}
        >
          {({ values, errors, touched, handleChange, handleSubmit }) => (
            <>
              <CustomInput
                label="Email"
                placeholder="Email"
                value={values.email}
                onChangeText={handleChange("email")}
                /* UX + autofill */
                inputMode="email"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                textContentType="emailAddress"
                importantForAutofill="yes"
                returnKeyType="next"
                error={touched.email && errors.email ? errors.email : undefined}
                onSubmitEditing={() => passwordRef.current?.focus()}
              />

              <CustomInput
                ref={passwordRef}
                label="Password"
                placeholder="Enter your password"
                value={values.password}
                onChangeText={handleChange("password")}
                /* UX + autofill */
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="password"
                textContentType="password"
                importantForAutofill="yes"
                returnKeyType="go"
                enablesReturnKeyAutomatically
                onSubmitEditing={() => handleSubmit()}
                error={
                  touched.password && errors.password
                    ? errors.password
                    : undefined
                }
                onForgotPassword={() => router.push(AppRoutes.FORGOT_PASSWORD)}
              />
              {generalError && (
                <Text
                  style={styles.generalError}
                  accessibilityLiveRegion="assertive"
                  accessibilityRole="alert"
                >
                  {generalError}
                </Text>
              )}

              <CustomButton
                label={isLoading ? "Signing in..." : "Sign in"}
                onPress={() => handleSubmit()}
              />
            </>
          )}
        </Formik>

        <Text
          onPress={gotoRegister}
          accessibilityRole="link"
          accessibilityLabel="Don't have an account? Register here"
          style={styles.link}
        >
          Don't have an account? Register
        </Text>
      </ScreenContainer>
    </KeyboardWrapper>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "#FFF",
  },
  text: { alignItems: "center", marginBottom: 20 },
  link: { textAlign: "center", marginTop: 20 },
  generalError: {
    color: "red",
    textAlign: "center",
    paddingBottom: 10,
  },
});

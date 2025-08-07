import React, { useRef, useState, useEffect } from "react";
import { View, StyleSheet, AccessibilityInfo, TextInput } from "react-native";
import { Checkbox, Text } from "native-base";
import Button from "@/src/components/ui/btns/Button";
import { useRouter } from "expo-router";

import CustomInput from "@/src/components/ui/input/CustomInput";
import KeyboardWrapper from "@/src/components/KeyboardWrapper";
import ScreenContainer from "@/src/components/ScreenContainer";
import { Formik } from "formik";
import { registerSchema } from "@/src/validation/registerSchema";
import { useAuthActions } from "@/src/hooks/useAuthActions";
import { AppRoutes } from "@/src/config/routes";
import useAnnounceForAccessibility from "@/src/hooks/useAnnounceForAccessibility";

export default function RegisterScreen() {
  useAnnounceForAccessibility("Registration screen opened");

  /* ─── Refs sekančiam laukeliui fokusui ─── */
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmRef = useRef<TextInput>(null);

  const [agreed, setAgreed] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const router = useRouter();
  const { register } = useAuthActions();

  useEffect(() => {
    if (generalError) AccessibilityInfo.announceForAccessibility(generalError);
  }, [generalError]);

  return (
    <KeyboardWrapper>
      <ScreenContainer variant="center">
        <View style={styles.text}>
          <Text variant="header1" accessibilityRole="header">
            Create an Account
          </Text>
          <Text variant="bodyGray">Fill in the details to register</Text>
        </View>

        <Formik
          initialValues={{
            name: "",
            email: "",
            password: "",
            password_confirmation: "",
          }}
          validationSchema={registerSchema}
          onSubmit={async (values, { setErrors }) => {
            if (!agreed) {
              alert("You must agree to the Privacy Policy & Terms");
              return;
            }
            try {
              await register({ registerRequest: values });
              router.push(AppRoutes.HOME);
            } catch (err: any) {
              setErrors(err?.data?.errors ?? {});
              setGeneralError(err?.data?.message ?? "Unknown error");
            }
          }}
        >
          {({ values, handleChange, handleSubmit, errors, touched }) => (
            <>
              {/* Full name */}
              <CustomInput
                label="Full Name"
                placeholder="Full Name"
                value={values.name}
                onChangeText={handleChange("name")}
                returnKeyType="next"
                onSubmitEditing={() => emailRef.current?.focus()}
                autoComplete="name" // Android
                textContentType="name" // iOS
                error={touched.name && errors.name ? errors.name : undefined}
              />

              {/* Email */}
              <CustomInput
                ref={emailRef}
                label="Email"
                placeholder="Email"
                value={values.email}
                onChangeText={handleChange("email")}
                keyboardType="email-address"
                inputMode="email"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current?.focus()}
                autoComplete="email"
                textContentType="emailAddress"
                importantForAutofill="yes"
                error={touched.email && errors.email ? errors.email : undefined}
              />

              {/* Password */}
              <CustomInput
                ref={passwordRef}
                label="Password"
                placeholder="Password"
                value={values.password}
                onChangeText={handleChange("password")}
                secureTextEntry
                returnKeyType="next"
                onSubmitEditing={() => confirmRef.current?.focus()}
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="new-password"
                textContentType="newPassword" // iOS – naujo pwd
                importantForAutofill="yes"
                error={
                  touched.password && errors.password
                    ? errors.password
                    : undefined
                }
              />

              {/* Confirm password */}
              <CustomInput
                ref={confirmRef}
                label="Confirm Password"
                placeholder="Confirm Password"
                value={values.password_confirmation}
                onChangeText={handleChange("password_confirmation")}
                secureTextEntry
                returnKeyType="go"
                onSubmitEditing={() => handleSubmit()}
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="new-password"
                textContentType="newPassword"
                importantForAutofill="yes"
                error={
                  touched.password_confirmation && errors.password_confirmation
                    ? errors.password_confirmation
                    : undefined
                }
              />

              {/* Agree to Privacy & Terms */}
              <View style={styles.checkboxRow}>
                <Checkbox
                  isChecked={agreed}
                  onChange={setAgreed}
                  value="agree"
                  accessibilityLabel="Agree to Privacy Policy and Terms"
                  accessibilityState={{ checked: agreed }}
                />
                <Text ml={2}>
                  I agree to the{" "}
                  <Text
                    onPress={() => router.push(AppRoutes.PRIVACY_POLICY)}
                    style={{ textDecorationLine: "underline" }}
                    accessibilityRole="link"
                    accessibilityLabel="View Privacy Policy and Terms"
                  >
                    Privacy & Terms
                  </Text>
                </Text>
              </View>

              {/* klaida */}
              {generalError && (
                <Text
                  style={styles.generalError}
                  accessibilityLiveRegion="assertive"
                  accessibilityRole="alert"
                >
                  {generalError}
                </Text>
              )}

              <Button label="Register" onPress={() => handleSubmit()} />
            </>
          )}
        </Formik>

        <Text
          onPress={() => router.push("/")}
          style={{ textAlign: "center", marginTop: 20 }}
          accessibilityRole="link"
          accessibilityLabel="Already have an account? Log in"
        >
          Have an account? Login
        </Text>
      </ScreenContainer>
    </KeyboardWrapper>
  );
}

const styles = StyleSheet.create({
  text: { alignItems: "center", marginBottom: 20 },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  generalError: { color: "red", textAlign: "center", paddingBottom: 10 },
});

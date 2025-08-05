import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "native-base";
import { useRouter } from "expo-router";
import { Formik } from "formik";

import Button from "@/src/components/ui/btns/Button";
import CustomInput from "@/src/components/ui/input/CustomInput";
import KeyboardWrapper from "@/src/components/KeyboardWrapper";
import ScreenContainer from "@/src/components/ScreenContainer";
import { loginSchema } from "@/src/validation/loginSchema";
import { useLoginUserMutation } from "@/src/store/travelApi";
import { useAuthActions } from "@/src/hooks/useAuthActions";
import { AppRoutes } from "@/src/config/routes";

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuthActions();
  const [loginUser, { isLoading, error, reset }] = useLoginUserMutation();

  const apiErrors = (error as any)?.data?.errors ?? {};
  const general = (error as any)?.data?.message;

  const gotoRegister = () => {
    reset();
    router.push(AppRoutes.REGISTER);
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
              await login({ loginRequest: values });
              router.push("/(app)/(tabs)/home");
            } catch (err: any) {
              const backendErrors = err?.data?.errors;
              if (backendErrors) setErrors(backendErrors);
            }
          }}
        >
          {({ values, errors, touched, handleChange, handleSubmit }) => (
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
                error={
                  touched.password && errors.password
                    ? errors.password
                    : undefined
                }
                onForgotPassword={() => router.push(AppRoutes.FORGOT_PASSWORD)}
              />

              {general && <Text style={styles.generalError}>{general}</Text>}

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

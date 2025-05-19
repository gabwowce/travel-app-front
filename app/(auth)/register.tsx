import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Checkbox, Text } from "native-base";
import Button from "@/src/components/ui/btns/Button";
import { useRouter } from "expo-router";
import { useDispatch } from "react-redux";
import * as SecureStore from 'expo-secure-store';

import { AppDispatch } from "@/src/data/store";
import { useAppSelector } from "@/src/data/hooks";
import { setCredentials } from "@/src/data/features/auth/authSlice";

import CustomInput from "@/src/components/ui/input/CustomInput";
import KeyboardWrapper from "@/src/components/KeyboardWrapper";
import ScreenContainer from "@/src/components/ScreenContainer";
import { Formik } from "formik";
import { registerSchema } from "@/src/validation/registerSchema";
import { useRegisterUserMutation } from "@/src/store/travelApi";

export default function RegisterScreen() {
  const [agreed, setAgreed] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [register, { isLoading }] = useRegisterUserMutation();

  return (
    <KeyboardWrapper>
      <ScreenContainer variant="center">
        <View style={styles.text}>
          <Text variant="header1">Create an Account</Text>
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
              const result = await register({ registerRequest: values }).unwrap();

           dispatch(setCredentials({
            user: result.data?.user ?? null,
            token: result.data?.token ?? '',
          }));


              await SecureStore.setItemAsync("token", result.data?.token ?? '');
              await SecureStore.setItemAsync("user", JSON.stringify(result.data?.user ?? null));

              router.push("/(app)/(tabs)/home");
            } catch (err: any) {
              const details = err?.data?.errors;
              if (details) setErrors(details);
            }
          }}
        >
          {({
            values,
            handleChange,
            handleBlur,
            handleSubmit,
            errors,
            touched,
            isValid,
            dirty,
          }) => (
            <>
              <CustomInput
                label="Full Name"
                placeholder="Full Name"
                value={values.name}
                onChangeText={handleChange("name")}
                onBlur={handleBlur("name")}
                error={touched.name && errors.name ? errors.name : undefined}
              />
              <CustomInput
                label="Email"
                placeholder="Email"
                value={values.email}
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                autoCapitalize="none"
                keyboardType="email-address"
                error={touched.email && errors.email ? errors.email : undefined}
              />
              <CustomInput
                label="Password"
                placeholder="Password"
                value={values.password}
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                secureTextEntry
                error={touched.password && errors.password ? errors.password : undefined}
              />
              <CustomInput
                label="Confirm Password"
                placeholder="Confirm Password"
                value={values.password_confirmation}
                onChangeText={handleChange("password_confirmation")}
                onBlur={handleBlur("password_confirmation")}
                secureTextEntry
                error={
                  touched.password_confirmation && errors.password_confirmation
                    ? errors.password_confirmation
                    : undefined
                }
              />

              <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 10 }}>
                <Checkbox isChecked={agreed} onChange={setAgreed} value="agree" />
                <Text ml={2}>
                  I agree to the{" "}
                  <Text
                    onPress={() => router.push("/(legal)/privacy")}
                    style={{ textDecorationLine: "underline" }}
                  >
                    Privacy & Terms
                  </Text>
                </Text>
              </View>

              <Button
                label={isLoading ? "Creating account..." : "Register"}
                onPress={() => handleSubmit()}
                isDisabled={!dirty || !isValid}
              />
            </>
          )}
        </Formik>

        <Text
          onPress={() => {
            router.push("/");
          }}
          style={{ textAlign: "center", marginTop: 20 }}
        >
          Have an account? Login
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

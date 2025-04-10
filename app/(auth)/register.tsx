import React, { useState } from "react";
import {
  View,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  StyleSheet,
} from "react-native";
import { Text } from "native-base";
import Button from "@/src/components/btns/Button";
import { useDispatch } from "react-redux";
import { register } from "../../src/data/features/auth/authThunks";
import {clearErrors} from "@/src/data/features/auth/authSlice";
import { useRouter } from "expo-router";
import { AppDispatch } from "../../src/data/store";
import { useAppSelector } from "@/src/data/hooks";
import CustomInput from "@/src/components/input/CustomInput"; // 🔹 Importuojame CustomInput
import KeyboardWrapper from "@/src/components/KeyboardWrapper"; // 🔹 Importuojam komponentą
import ScreenContainer from "@/src/components/ScreenContainer";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const loading = useAppSelector((state)=> state.auth.loading);
  const errors = useAppSelector((state)=> state.auth.errors);

  const handleRegister = async () => {
    const resultAction = await dispatch(
      register({
        name: name,
        email: email,
        password: password,
        password_confirmation: confirmPassword,
      })
    );
    if (register.fulfilled.match(resultAction)) {
      router.replace("/(app)/(tabs)/home");
    }
  };

  return (
    <KeyboardWrapper>
      <ScreenContainer variant="center">
        <View style={styles.text}>
          <Text variant="header1">Create an Account</Text>
          <Text variant="bodyGray">Fill in the details to register</Text>
        </View>

        <CustomInput
          label="Full Name"
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
          error={errors.name}
        />
        <CustomInput
          label="Email"
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          error={errors.email}
        />
        <CustomInput
          label="Password"
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          error={errors.password}
        />
        <CustomInput
          label="Confirm Password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        {errors.general && <Text style={{ color: "red", textAlign: "center" }}>{errors.general}</Text>}

        <Button label={loading ? "Creating account..." : "Register"} onPress={handleRegister} />

        <Text
          onPress={() => {
            dispatch(clearErrors());
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
  inputContainer: {},
});

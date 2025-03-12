import React, { useState } from "react";
import {
  View,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
} from "react-native";
import { Text } from "native-base";
import Button from "@/src/components/btns/Button";
import { useRouter } from "expo-router";
import { login, clearErrors  } from "@/src/data/features/auth/authSlice";

import { useAppDispatch, useAppSelector } from "@/src/data/hooks";
import { selectAuthErrors, selectAuthLoading } from "@/src/data/features/auth/authSelectors";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const dispatch = useAppDispatch();

  const loading = useAppSelector((state)=>(state.auth.loading));
  const errors = useAppSelector((state)=>(state.auth.errors));

  const handleLogin = async () => {
    const resultAction = await dispatch(login({ email, password }));
    console.log("resultAction: ", resultAction);
      if (login.fulfilled.match(resultAction)) {
        router.push("/(app)/(tabs)/home");
      }
  };
  
  
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.text}>
          <Text variant="header1">Sign in now</Text>
          <Text variant="bodyGray">Please sign in to continue</Text>
        </View>

        <KeyboardAvoidingView style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            autoCapitalize="none"
            placeholderTextColor="#969696"
            keyboardType="email-address"
            onChangeText={setEmail}
          />
          {errors.email && <Text style={{ color: "red", textAlign: "center" }}>{errors.email}</Text>}

          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            placeholderTextColor="#969696"
            onChangeText={setPassword}
            secureTextEntry
          />
          {errors.password && <Text style={{ color: "red", textAlign: "center" }}>{errors.password}</Text>}
        </KeyboardAvoidingView>

        {errors.general && <Text style={{ color: "red", textAlign: "center" }}>{errors.general}</Text>}
        <Button label={loading ? "Signing in..." : "Sign in"} onPress={handleLogin}  />

        <Text 
          onPress={() => {
            dispatch(clearErrors()); 
            router.push("/register");
          }}
          style={{ textAlign: "center", marginTop: 10 }}
        >
          Don't have an account? Register
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  text: {
    alignItems: "center",
    marginBottom: 20,
  },
  inputContainer: {},
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 12,
    borderRadius: 4,
    paddingHorizontal: 10,
    height: 40,
  },
});

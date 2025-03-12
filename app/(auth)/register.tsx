import React, { useState } from "react";
import {
  View,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  StyleSheet,
} from "react-native";
import { Text } from "native-base";
import Button from "@/src/components/btns/Button";
import { useDispatch } from "react-redux";
import { register, clearErrors } from "../../src/data/features/auth/authSlice";
import { useRouter } from "expo-router";
import { AppDispatch } from "../../src/data/store"; 
import { useAppSelector } from "@/src/data/hooks";
import { selectAuthErrors, selectAuthLoading } from "@/src/data/features/auth/authSelectors";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const dispatch = useDispatch<AppDispatch>(); 
  const router = useRouter();
  
  const loading = useAppSelector(selectAuthLoading);
  const errors = useAppSelector(selectAuthErrors);

  const handleRegister = async () => {
    
    const resultAction = await dispatch(register({
      name: name,
      email: email,
      password: password,
      password_confirmation: confirmPassword,
    }));
    

    if (register.fulfilled.match(resultAction)) {
      router.replace('/(app)/(tabs)/home');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.text}>
          <Text variant="header1">Create an Account</Text>
          <Text variant="bodyGray">Fill in the details to register</Text>
        </View>

        <KeyboardAvoidingView
          style={styles.inputContainer}
          behavior={Platform.OS === "ios" ? "height" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
        >
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor="#969696"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            placeholderTextColor="#969696"
            autoCapitalize="none"
            keyboardType="email-address"
          />
          {errors.email && <Text style={{ color: "red", textAlign: "center" }}>{errors.email}</Text>}
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            placeholderTextColor="#969696"
            secureTextEntry
          />
          {errors.password && <Text style={{ color: "red", textAlign: "center" }}>{errors.password}</Text>}
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            value={confirmPassword}
            placeholderTextColor="#969696"
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
        </KeyboardAvoidingView>

        {errors.general && <Text style={{ color: "red", textAlign: "center" }}>{errors.general}</Text>}
        <Button label={loading ? "Creating account..." : "Register"} onPress={handleRegister} />
        <Text 
          onPress={() => {
            dispatch(clearErrors()); 
            router.push("/");
          }}
          style={{ textAlign: "center", marginTop: 10 }}
        >
          Have an account? Login
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

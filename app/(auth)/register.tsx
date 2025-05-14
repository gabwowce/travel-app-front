import React, { useState } from "react";
import {
  View,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  StyleSheet,
} from "react-native";
import { Checkbox, Text } from "native-base";
import Button from "@/src/components/ui/btns/Button";
import { useDispatch } from "react-redux";
import { register } from "../../src/data/features/auth/authThunks";
import {clearErrors} from "@/src/data/features/auth/authSlice";
import { Link, useRouter } from "expo-router";
import { AppDispatch } from "../../src/data/store";
import { useAppSelector } from "@/src/data/hooks";
import CustomInput from "@/src/components/ui/input/CustomInput"; // 🔹 Importuojame CustomInput
import KeyboardWrapper from "@/src/components/KeyboardWrapper"; // 🔹 Importuojam komponentą
import ScreenContainer from "@/src/components/ScreenContainer";
import {
    useRegisterUserMutation,        
  } from "@/src/store/travelApi";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const loading = useAppSelector((state)=> state.auth.loading);
  const errors = useAppSelector((state)=> state.auth.errors);
  const [agreed, setAgreed] = useState(false);

  const [register, { isLoading, error, reset }] = useRegisterUserMutation();
  const getFieldError = (field: string) =>
  (error as any)?.data?.errors?.[field]?.[0] ?? "";

  
  const handleRegister = async () => {
     if (!agreed) {
      alert("You must agree to the Privacy Policy & Terms");
      return;
    }
     try {
      await register({
        registerRequest:{
          name,
          email, 
          password,
          confirmPassword
        }
      }).unwrap();                     // sėkmės atveju
      router.push("/(app)/(tabs)/home");
    } catch {
      /* error jau laikomas hook’o state */
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
          error={getFieldError("name")}

        />
        <CustomInput
          label="Email"
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          error={getFieldError("email")}
        />
        <CustomInput
          label="Password"
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          error={getFieldError("password")}
        />
        <CustomInput
          label="Confirm Password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        {error && (
          <Text style={{ color: "red", textAlign: "center", marginVertical: 5 }}>
            {(error as any)?.data?.message || "Registration failed. Try again."}
          </Text>
        )}


        <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 10 }}>
          <Checkbox isChecked={agreed} onChange={setAgreed} value="agree" accessibilityLabel="Agree to terms" />
          <Text ml={2}>
            I agree to the{" "}
            <Text
              onPress={() => router.push("/(legal)/privacy")}
              style={{ textAlign: "center", textDecorationLine: "underline" }}
            >
              Privacy & Terms
            </Text>

          </Text>
        </View>


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

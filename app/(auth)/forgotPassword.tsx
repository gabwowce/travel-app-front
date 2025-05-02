import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Text, IconButton, ArrowBackIcon } from "native-base";
import { useRouter } from "expo-router";
import CustomInput from "@/src/components/ui/input/CustomInput";
import Button from "@/src/components/ui/btns/Button";
import KeyboardWrapper from "@/src/components/KeyboardWrapper";
import Header from "@/src/components/Header";
import ScreenContainer from "@/src/components/ScreenContainer";
import FlexContainer from "@/src/components/layout/FlexContainer";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleResetPassword = () => {
    if (!email) {
      setError("Email is required");
      return;
    }
    console.log("Password reset link sent to:", email);
  };

  return (
    <KeyboardWrapper>
     <FlexContainer gap={16} px={wp("3%")}>
        <Header onBackPress={() => router.back()} transparent />

        <Text variant="header1" style={styles.title}>
          Forgot password
        </Text>
        <Text variant="bodyGray" style={styles.subtitle}>
          Enter your email account to reset your password
        </Text>

        {/* Email įvedimo laukas */}
        <CustomInput
          label="Email"
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          error={error}
        />

        {/* Slaptažodžio atstatymo mygtukas */}
        <Button label="Reset Password" onPress={handleResetPassword} />
      </FlexContainer>
    </KeyboardWrapper>
  );
}

const styles = StyleSheet.create({
  backButton: {
    position: "absolute",
    top: 20,
    left: 10,
  },
  title: {
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 20,
  },
});

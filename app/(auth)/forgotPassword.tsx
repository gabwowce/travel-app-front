import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { Text } from "native-base";
import { useRouter } from "expo-router";
import CustomInput from "@/src/components/ui/input/CustomInput";
import Button from "@/src/components/ui/btns/Button";
import KeyboardWrapper from "@/src/components/KeyboardWrapper";
import Header from "@/src/components/Header";
import ScreenContainer from "@/src/components/ScreenContainer";
import useAnnounceForAccessibility from "@/src/hooks/useAnnounceForAccessibility";

export default function ForgotPasswordScreen() {
  useAnnounceForAccessibility("Forgot password screen opened");
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
      <ScreenContainer variant="center">
        {/* <Header onBackPress={() => router.back()} transparent /> */}

        <Text variant="header1" accessibilityRole="header" style={styles.title}>
          Forgot password
        </Text>
        <Text variant="bodyGray" style={styles.subtitle}>
          Enter your email account to reset your password
        </Text>

        {/* Email įvedimo laukas */}
        <CustomInput
          /* ─── Etiketės / placeholder ─────────────────────────── */
          label="Email"
          placeholder="Email"
          /* ─── Klaviatūra ir automatiniai pataisymai ──────────── */
          keyboardType="email-address"
          inputMode="email" // RN 0.70+: tikslesnė klaviatūra
          autoCapitalize="none"
          autoCorrect={false}
          /* ─── Autofill & OS hint’ai ──────────────────────────── */
          autoComplete="email" // Android & iOS (RN 0.68+)
          textContentType="emailAddress" // iOS (leidžia iCloud Keychain)
          importantForAutofill="yes" // Android
          /* ─── UX smulkmenos ─────────────────────────────────── */
          autoFocus // iškart atidaro klaviatūrą
          returnKeyType="send" // rodo „Send“ mygtuką
          enablesReturnKeyAutomatically
          onSubmitEditing={handleResetPassword}
          /* ─── Reikalingi tau valdikliai ─────────────────────── */
          value={email}
          onChangeText={setEmail}
          error={error}
        />
        {/* {error && (
          <Text
            color="red.500"
            accessibilityLiveRegion="assertive"
            accessibilityRole="alert"
            style={{ textAlign: "center", marginTop: 10 }}
          >
            {error}
          </Text>
        )} */}
        {/* Slaptažodžio atstatymo mygtukas */}
        <Button
          label="Reset Password"
          accessibilityLabel="Send password reset email"
          onPress={handleResetPassword}
        />
      </ScreenContainer>
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

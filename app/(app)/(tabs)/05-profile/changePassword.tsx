// screens/ChangePasswordScreen.tsx
import { router, useNavigation } from "expo-router";
import { Formik } from "formik";
import {
  Avatar,
  Divider,
  Heading,
  ScrollView,
  Text,
  VStack,
} from "native-base";
import React from "react";

import FlexContainer from "@/src/components/layout/FlexContainer";
import Button from "@/src/components/ui/btns/Button";
import CustomInput from "@/src/components/ui/input/CustomInput";
import Spinner from "@/src/components/ui/Spinner";
import useAnnounceForAccessibility from "@/src/hooks/useAnnounceForAccessibility";
import { passwordSchema } from "@/src/validation/passwordSchema";

import { showToast } from "@/src/components/ui/notify/Toast";
import {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
} from "@/src/store/travelApi";

/* ------------------------------------------------------------------------- */
/* 🔹 D Y N A M I N I S   'S A V E'   M Y G T U K A S   A P P  B A R ' e      */
/* ------------------------------------------------------------------------- */
function SaveActionHeader({
  dirty,
  isValid,
  handleSubmit,
  saving,
}: {
  dirty: boolean;
  isValid: boolean;
  handleSubmit: () => void;
  saving: boolean;
}) {
  useAnnounceForAccessibility("Change password screen opened");
  const navigation = useNavigation();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        dirty && isValid ? (
          <Text onPress={handleSubmit} color="blue.500" mr={3}>
            {saving ? "Saving…" : "Save"}
          </Text>
        ) : null,
    });
  }, [navigation, dirty, isValid, saving, handleSubmit]);

  return null; // UI-neko nerenderinam
}

/* ------------------------------------------------------------------------- */
/* 🖥️  P A G R I N D I N I S   E K R A N A S                                  */
/* ------------------------------------------------------------------------- */
export default function ChangePasswordScreen() {
  const navigation = useNavigation();

  /* 👉  Užkraunam vartotojo profilį */
  const { data: response, isLoading } = useGetUserProfileQuery();
  const user = response?.data;
  const [updateProfile, { isLoading: saving }] = useUpdateUserProfileMutation();

  if (isLoading) return <Spinner />;
  if (!user)
    return (
      <Text textAlign="center" mt={8}>
        Error loading user.
      </Text>
    );

  return (
    <Formik
      initialValues={{
        password: "",
        password_confirmation: "",
      }}
      validationSchema={passwordSchema}
      onSubmit={async (values, { setErrors, resetForm, setStatus }) => {
        setStatus(null);
        try {
          await updateProfile({ userUpdateRequest: values }).unwrap();
          setStatus({ success: true });
          resetForm();

          showToast({
            title: "Password updated",
            description: "Your password has been changed successfully.",
            status: "success",
          });

          setTimeout(() => {
            router.back(); // leiskim toast’ui pasimatyt 1 s
          }, 1000);
        } catch (err: any) {
          const details = err?.data?.errors;
          if (details) {
            setErrors(details);
            showToast({
              title: "Could not update password",
              description: "There was an issue updatig your password.",
              status: "error",
            });
          } else {
            setStatus({ error: "Something went wrong" });
          }
        }
      }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isValid,
        dirty,
        status,
      }) => (
        <>
          {/* 🔑 HeaderRight logika */}
          <SaveActionHeader
            dirty={dirty}
            isValid={isValid}
            handleSubmit={handleSubmit}
            saving={saving}
          />

          <FlexContainer>
            <ScrollView keyboardShouldPersistTaps="handled">
              <VStack px={5} space={4}>
                {/* Profile avatar + name */}
                <VStack alignItems="center" mt={5} space={4}>
                  <Avatar
                    size="xl"
                    source={require("@/src/assets/avatar.png")}
                    accessibilityLabel={`Profile avatar of ${user.name}`}
                  >
                    {user.name?.charAt(0).toUpperCase()}
                  </Avatar>
                  <Heading fontSize="lg" accessibilityRole="header">
                    {user.name}
                  </Heading>
                </VStack>

                <Divider my={4} />

                <Text
                  mb={4}
                  fontSize="sm"
                  textAlign="center"
                  color="gray.500"
                  accessibilityLiveRegion="polite"
                >
                  Enter a new password below.
                </Text>

                {/* New password */}
                <CustomInput
                  label="New Password"
                  accessibilityLabel="New password input field"
                  secureTextEntry
                  placeholder="Enter new password"
                  value={values.password}
                  onBlur={handleBlur("password")}
                  onChangeText={handleChange("password")}
                  error={
                    touched.password && errors.password
                      ? errors.password
                      : undefined
                  }
                />

                {/* Confirmation */}
                <CustomInput
                  label="Confirm New Password"
                  accessibilityLabel="Confirm password input field"
                  secureTextEntry
                  placeholder="Confirm new password"
                  value={values.password_confirmation}
                  onBlur={handleBlur("password_confirmation")}
                  onChangeText={handleChange("password_confirmation")}
                  error={
                    touched.password_confirmation &&
                    errors.password_confirmation
                      ? errors.password_confirmation
                      : undefined
                  }
                />

                {/* Status messages */}
                {status?.error && (
                  <Text
                    color="red.500"
                    textAlign="center"
                    accessibilityLiveRegion="assertive"
                    accessibilityRole="alert"
                  >
                    {status.error}
                  </Text>
                )}
                {status?.success && (
                  <Text
                    color="green.500"
                    textAlign="center"
                    accessibilityLiveRegion="polite"
                  >
                    Password updated successfully!
                  </Text>
                )}

                {/* Atsarginis mygtukas apačioje (mažiems ekranams) */}
                {dirty && isValid && (
                  <Button
                    label={saving ? "Saving…" : "Save"}
                    onPress={handleSubmit}
                  />
                )}
              </VStack>
            </ScrollView>
          </FlexContainer>
        </>
      )}
    </Formik>
  );
}

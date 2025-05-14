// screens/ChangePasswordScreen.tsx
import React from 'react';
import {
  VStack,
  Heading,
  Text,
  Divider,
  Spinner,
  Box,
  ScrollView,
} from 'native-base';
import { useRouter } from 'expo-router';
import { Formik } from 'formik';
import * as Yup from 'yup';

import ScreenContainer from '@/src/components/ScreenContainer';
import Header from '@/src/components/Header';
import CustomInput from '@/src/components/ui/input/CustomInput';
import Button from '@/src/components/ui/btns/Button';
import {passwordSchema} from "@/src/validation/passwordSchema";


import {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
} from '@/src/store/travelApi';

/* ────────────────────── Yup schema ────────────────────── */
// const passwordSchema = Yup.object({
//   password: Yup.string()
//     .min(6, 'Password must be at least 6 characters')
//     .required('New password is required'),
//   password_confirmation: Yup.string()
//     .oneOf([Yup.ref('password')], 'Passwords do not match')
//     .required('Please confirm the password'),
// });

/* ───────────────────  Component  ──────────────────────── */
export default function ChangePasswordScreen() {
  const router = useRouter();

  const { data: user, isLoading } = useGetUserProfileQuery();
  const [updateProfile, { isLoading: saving }] =
    useUpdateUserProfileMutation();

  if (isLoading)
    return (
      <Box flex={1} justifyContent="center" alignItems="center">
        <Spinner size="lg" />
      </Box>
    );
  if (!user)
    return (
      <Text textAlign="center" mt={8}>
        Error loading user.
      </Text>
    );

  return (
    <Formik
      initialValues={{ password: '', password_confirmation: '' }}
      validationSchema={passwordSchema}
      onSubmit={async (values, { setErrors, resetForm, setStatus }) => {
        setStatus(null);

        try {
          await updateProfile(values).unwrap();
          setStatus({ success: true });
          resetForm();
          // Optionally navigate back:
          // router.back();
        } catch (err: any) {
          const details = err?.data?.error?.details;
          if (details) setErrors(details as any); // 422 validation errors
          else setStatus({ error: 'Something went wrong' });
        }
      }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleSubmit,
        isValid,
        dirty,
        status,
      }) => (
        <ScreenContainer variant="top">
          <Header
            title="Change Password"
            onBackPress={() => router.back()}
            rightIcon={
              dirty && isValid ? (
                <Text onPress={() => handleSubmit()} color="blue.500">
                  {saving ? 'Saving...' : 'Save'}
                </Text>
              ) : null
            }
          />

          <ScrollView keyboardShouldPersistTaps="handled">
            <VStack px={5} space={4}>
              <VStack alignItems="center" mt={4}>
                <Heading fontSize="lg">{user.name}</Heading>
                <Text color="gray.500">{user.email}</Text>
              </VStack>

              <Divider my={4} />

              <Text
                mb={4}
                fontSize="sm"
                textAlign="center"
                color="gray.500"
              >
                Enter a new password below.
              </Text>

              <CustomInput
                label="New Password"
                secureTextEntry
                placeholder="Enter new password"
                value={values.password}
                onChangeText={handleChange('password')}
                error={touched.password && (errors.password as string)}
              />
              <CustomInput
                label="Confirm New Password"
                secureTextEntry
                placeholder="Confirm new password"
                value={values.password_confirmation}
                onChangeText={handleChange('password_confirmation')}
                error={
                  touched.password_confirmation &&
                  (errors.password_confirmation as string)
                }
              />

              {status?.error && (
                <Text color="red.500" textAlign="center">
                  {status.error}
                </Text>
              )}
              {status?.success && (
                <Text color="green.500" textAlign="center">
                  Password updated successfully!
                </Text>
              )}

              {/* Extra button for small devices */}
              {dirty && isValid && (
                <Button
                  label={saving ? 'Saving...' : 'Save'}
                  onPress={() => handleSubmit()}
                />
              )}
            </VStack>
          </ScrollView>
        </ScreenContainer>
      )}
    </Formik>
  );
}

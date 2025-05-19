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
  Avatar,
} from 'native-base';
import { useRouter } from 'expo-router';
import { Formik } from 'formik';
import * as Yup from 'yup';

import ScreenContainer from '@/src/components/ScreenContainer';
import Header from '@/src/components/Header';
import CustomInput from '@/src/components/ui/input/CustomInput';
import Button from '@/src/components/ui/btns/Button';
import {passwordSchema} from "@/src/validation/passwordSchema";
import { useToast } from 'native-base';


import {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
} from '@/src/store/travelApi';
import FlexContainer from '@/src/components/layout/FlexContainer';

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
  const toast = useToast();
  const router = useRouter();

  const { data: response, isLoading } = useGetUserProfileQuery();
  const user = response?.data;
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
      initialValues={{
        // current_password: '',
        password: '',
        password_confirmation: '',
      }}
      validationSchema={passwordSchema}
     onSubmit={async (values, { setErrors, resetForm, setStatus }) => {
          setStatus(null);
          try {
            await updateProfile({ userUpdateRequest: values }).unwrap();
            setStatus({ success: true });
            resetForm();

            toast.show({
              title: "Password updated",
              description: "Your password has been changed successfully.",
              status: "success", 
              placement: "top",
            } as any);

            setTimeout(() => {
              router.back(); // grįžtam po 1s (kad matytų toast'ą)
            }, 1000);

          } catch (err: any) {
            const details = err?.data?.errors;
            if (details) {
              console.log('⚠️ Server validation errors:', details);
              setErrors(details);
            } else {
              setStatus({ error: 'Something went wrong' });
            }
          }
        }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleSubmit,
        handleBlur,
        isValid,
        dirty,
        status,
      }) => (
        <FlexContainer>
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
               <VStack alignItems="center" mt={5} space={4}>
                <Avatar size="xl" source={{ uri: 'https://via.placeholder.com/150' }}>
                  {user.name?.charAt(0).toUpperCase()}
                </Avatar>
                <Heading fontSize="lg">{user.name}</Heading>

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

              {/* <CustomInput
                label="Current Password"
                secureTextEntry
                placeholder="Enter current password"
                value={values.current_password}
                onChangeText={handleChange('current_password')}
                error={
                  touched.current_password && errors.current_password
                    ? errors.current_password
                    : undefined
                }
              /> */}
              {/* {touched.current_password && errors.current_password && (
                <Text color="red.500" fontSize="xs" mt={-3} mb={1}>
                  {errors.current_password}
                </Text>
              )} */}

              <CustomInput
                label="New Password"
                secureTextEntry
                placeholder="Enter new password"
                value={values.password}
                onBlur={handleBlur('password')}
                onChangeText={handleChange('password')}
                error={
                  touched.password && errors.password
                    ? errors.password
                    : undefined
                }
              />

              <CustomInput
                label="Confirm New Password"
                secureTextEntry
                placeholder="Confirm new password"
                value={values.password_confirmation}
                onBlur={handleBlur('password_confirmation')}
                onChangeText={handleChange('password_confirmation')}
                error={
                  touched.password_confirmation && errors.password_confirmation
                    ? errors.password_confirmation
                    : undefined
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
        </FlexContainer>
      )}
    </Formik>
  );
}

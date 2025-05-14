// screens/EditProfileScreen.tsx
import React from 'react';
import {
  Avatar,
  VStack,
  Heading,
  Text,
  ScrollView,
  Spinner,
  Box,
} from 'native-base';
import { useRouter } from 'expo-router';
import { Formik } from 'formik';
import * as Yup from 'yup';

import Header from '@/src/components/Header';
import ScreenContainer from '@/src/components/ScreenContainer';
import CustomInput from '@/src/components/ui/input/CustomInput';
import Button from '@/src/components/ui/btns/Button';

import {editProfileSchema} from "@/src/validation/editProfileSchema";

import {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
} from '@/src/store/travelApi';

/* ─────────────────────────  Yup schema  ───────────────────────── */
// const editProfileSchema = Yup.object({
//   name: Yup.string().trim().required('Name is required'),
//   profile: Yup.object({
//     location: Yup.string().nullable(),
//     bio: Yup.string().max(160, 'Bio is too long').nullable(),
//     website: Yup.string().url('Invalid URL').nullable(),
//   }),
// });

/* ───────────────────────  Component  ──────────────────────────── */
export default function EditProfileScreen() {
  const router = useRouter();

  /* Fetch current user */
  const {
    data: user,
    isLoading: loading,
    isError,
    refetch,
  } = useGetUserProfileQuery();

  /* Mutation */
  const [updateProfile, { isLoading: isSaving }] =
    useUpdateUserProfileMutation();

  if (loading)
    return (
      <Box flex={1} justifyContent="center" alignItems="center">
        <Spinner size="lg" />
      </Box>
    );
  if (isError || !user)
    return (
      <Text textAlign="center" mt={8}>
        Error loading profile.
      </Text>
    );

  /* Initial values from API */
  const initialValues = {
    name: user.name ?? '',
    profile: {
      location: user.profile?.location ?? '',
      bio: user.profile?.bio ?? '',
      website: user.profile?.website ?? '',
    },
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={editProfileSchema}
      enableReinitialize
      onSubmit={async (values, { setErrors }) => {
        try {
          await updateProfile(values).unwrap();
          router.back(); // ✅ go back to Profile
        } catch (err: any) {
          // Laravel 422 => { error: { details: { field: ["msg"] } } }
          const details = err?.data?.error?.details;
          if (details) setErrors(details as any);
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
      }) => (
        <ScreenContainer>
          <Header
            title="Edit Profile"
            onBackPress={() => router.back()}
            rightIcon={
              dirty && isValid ? (
                <Text onPress={() => handleSubmit()} color="blue.500">
                  {isSaving ? 'Saving...' : 'Save'}
                </Text>
              ) : null
            }
          />

          <ScrollView keyboardShouldPersistTaps="handled">
            <VStack alignItems="center" mt={5} space={4}>
              <Avatar
                size="xl"
                source={{ uri: 'https://via.placeholder.com/150' }}
              >
                {values.name.charAt(0).toUpperCase()}
              </Avatar>
              <Heading size="md">{values.name}</Heading>
            </VStack>

            <VStack space={4} mt={6} px={5}>
              <CustomInput
                label="Full Name"
                value={values.name}
                onChangeText={handleChange('name')}
                error={touched.name && (errors.name as string)}
              />
              <CustomInput
                label="Location"
                value={values.profile.location}
                onChangeText={handleChange('profile.location')}
                error={
                  touched.profile?.location &&
                  (errors.profile?.location as string)
                }
              />
              <CustomInput
                label="Bio"
                value={values.profile.bio}
                onChangeText={handleChange('profile.bio')}
                error={
                  touched.profile?.bio && (errors.profile?.bio as string)
                }
              />
              <CustomInput
                label="Website"
                value={values.profile.website}
                onChangeText={handleChange('profile.website')}
                error={
                  touched.profile?.website &&
                  (errors.profile?.website as string)
                }
              />

              {/* Fallback button for small screens */}
              {dirty && isValid && (
                <Button
                  label={isSaving ? 'Saving...' : 'Save'}
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

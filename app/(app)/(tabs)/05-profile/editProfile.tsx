// screens/EditProfileScreen.tsx
import React from 'react';
import {
  Avatar,
  VStack,
  Heading,
  Text,
  ScrollView,
  Box,
  Divider,
} from 'native-base';
import { useRouter } from 'expo-router';
import { Formik, FormikErrors } from 'formik';

import Header from '@/src/components/Header';
import ScreenContainer from '@/src/components/ScreenContainer';
import CustomInput from '@/src/components/ui/input/CustomInput';
import Button from '@/src/components/ui/btns/Button';
import Spinner from "@/src/components/ui/Spinner";
import { editProfileSchema } from "@/src/validation/editProfileSchema";

import {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
} from '@/src/store/travelApi';
import type { User, UserUpdateRequest } from '@/src/store/travelApi'; 
import FlexContainer from '@/src/components/layout/FlexContainer';
import CircleButton from '@/src/components/ui/btns/CircleButton';

export default function EditProfileScreen() {
  const router = useRouter();

  const {
    data: response,
    isLoading: loading,
    isError,
    refetch
  } = useGetUserProfileQuery();

  const user = response?.data;

  const [updateProfile, { isLoading: isSaving }] =
    useUpdateUserProfileMutation();


  if (loading)
    return <Spinner />
             

  if (isError || !user)
    return (
      <Text textAlign="center" mt={8}>
        Error loading profile.
      </Text>
    );

  return (
    <Formik<User>
      initialValues={user}
      validationSchema={editProfileSchema}
      enableReinitialize
      onSubmit={async (values, { setErrors }) => {
        try {
          const cleanedValues: UserUpdateRequest = {
            name: values.name,
            email: values.email,
            profile: {
              bio: values.profile?.bio ?? undefined,
              location: values.profile?.location ?? undefined,
              website: values.profile?.website ?? undefined,
            },
          };

          await updateProfile({ userUpdateRequest: cleanedValues }).unwrap();
          await refetch();
          router.back();
        } catch (err: any) {
          const details = err?.data?.error?.details;
          if (details) setErrors(details as FormikErrors<User>);
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
        <FlexContainer>
         <Header
            title="Edit Profile"
            onBackPress={() => router.back()}
            rightIcon={
              dirty && isValid ? (
                <CircleButton
                  variant="save"
                  label={isSaving ? "Saving..." : "Save"}
                  onPress={() => handleSubmit()}
                />
              ) : null
            }
          />


          <ScrollView keyboardShouldPersistTaps="handled">
             <VStack space={4} mt={6} px={5}>
            <VStack alignItems="center">
              <Avatar size="xl" source={{ uri: 'https://via.placeholder.com/150' }}>
                {values.name?.charAt(0).toUpperCase()}
              </Avatar>
              <Heading size="md" pt={4}>{values.name}</Heading>
            </VStack>
            <Divider my={4} />

              <Text
                mb={4}
                fontSize="sm"
                textAlign="center"
                color="gray.500"
              >
                Update your profile info below.
              </Text>
           
              <CustomInput
                label="Full Name"
                value={values.name || ''}
                onChangeText={handleChange('name')}
                error={touched.name && errors.name ? errors.name : undefined}
              />

              <CustomInput
                label="Location"
                placeholder="Enter location"
                value={values.profile?.location || ''}
                onChangeText={handleChange('profile.location')}/>


              <CustomInput
                label="Bio"
                placeholder="Enter bio"
                value={values.profile?.bio || ''}
                onChangeText={handleChange('profile.bio')}
                
              />

              <CustomInput
                label="Website"
                placeholder="Enter website"
                value={values.profile?.website || ''}
                onChangeText={handleChange('profile.website')}
                
              />

              {dirty && isValid && (
                <Button
                  label={isSaving ? 'Saving...' : 'Save'}
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

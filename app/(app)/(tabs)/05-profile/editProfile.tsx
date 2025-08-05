// screens/EditProfileScreen.tsx
import React from "react";
import {
  Avatar,
  VStack,
  Heading,
  Text,
  ScrollView,
  Divider,
  useToast,
} from "native-base";
import { router, useNavigation } from "expo-router";
import { Formik, FormikErrors } from "formik";

import FlexContainer from "@/src/components/layout/FlexContainer";
import Spinner from "@/src/components/ui/Spinner";
import CustomInput from "@/src/components/ui/input/CustomInput";
import Button from "@/src/components/ui/btns/Button";
import CircleButton from "@/src/components/ui/btns/CircleButton";
import { editProfileSchema } from "@/src/validation/editProfileSchema";
import useAnnounceForAccessibility from "@/src/hooks/useAnnounceForAccessibility";
import {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
} from "@/src/store/travelApi";
import type { User, UserUpdateRequest } from "@/src/store/travelApi";

/* ------------------------------------------------------------------------- */
/* 🔹  ‘SAVE’ mygtukas Header’yje                                             */
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
  useAnnounceForAccessibility("Edit profile screen opened");
  const navigation = useNavigation();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        dirty && isValid ? (
          <CircleButton
            variant="save"
            label={saving ? "Saving..." : "Save"}
            onPress={handleSubmit}
          />
        ) : null,
    });
  }, [navigation, dirty, isValid, saving, handleSubmit]);

  return null;
}

/* ------------------------------------------------------------------------- */
/* 🖥️  Pagrindinis profilį redaguojantis ekranas                              */
/* ------------------------------------------------------------------------- */
export default function EditProfileScreen() {
  const toast = useToast();

  /* 1) --- Užkraunam vartotoją */
  const { data, isLoading, isError, refetch } = useGetUserProfileQuery();
  const user = data?.data;

  /* 2) --- Mutacija profilio atnaujinimui */
  const [updateProfile, { isLoading: saving }] = useUpdateUserProfileMutation();

  if (isLoading) return <Spinner />;
  if (isError || !user)
    return (
      <Text
        textAlign="center"
        mt={8}
        accessibilityRole="alert"
        accessibilityLiveRegion="assertive"
      >
        Error loading profile.
      </Text>
    );

  return (
    <Formik<User>
      initialValues={{
        ...user,
        profile: user.profile ?? {
          bio: "",
          location: "",
          website: "",
        },
      }}
      enableReinitialize
      validationSchema={editProfileSchema}
      onSubmit={async (values, { setErrors }) => {
        try {
          /* Išvalome nereikalingus laukus prieš siųsdami į API */
          const cleaned: UserUpdateRequest = {
            name: values.name,
            email: values.email,
            profile: {
              bio: values.profile?.bio ?? undefined,
              location: values.profile?.location ?? undefined,
              website: values.profile?.website ?? undefined,
            },
          };

          await updateProfile({ userUpdateRequest: cleaned }).unwrap();
          await refetch();
          toast.show({
            title: "Profile updated",
            status: "success",
            placement: "top",
          } as any);
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
              <VStack space={4} mt={6} px={5}>
                {/* Avatar + vardas */}
                <VStack alignItems="center">
                  <Avatar
                    size="xl"
                    source={{ uri: "https://via.placeholder.com/150" }}
                    accessibilityLabel={`Profile avatar of ${values.name}`}
                  >
                    {values.name?.charAt(0).toUpperCase()}
                  </Avatar>
                  <Heading accessibilityRole="header" size="md" pt={4}>
                    {values.name}
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
                  Update your profile info below.
                </Text>

                {/* Form fields */}
                <CustomInput
                  label="Full Name"
                  accessibilityLabel="Full Name input field"
                  value={values.name || ""}
                  onChangeText={handleChange("name")}
                  error={touched.name && errors.name ? errors.name : undefined}
                />

                <CustomInput
                  label="Location"
                  accessibilityLabel="Location input field"
                  placeholder="Enter location"
                  value={values.profile?.location || ""}
                  onChangeText={handleChange("profile.location")}
                />

                <CustomInput
                  label="Bio"
                  accessibilityLabel="Bio input field"
                  multiline
                  numberOfLines={6}
                  value={values.profile?.bio || ""}
                  onChangeText={handleChange("profile.bio")}
                />

                <CustomInput
                  label="Website"
                  accessibilityLabel="Website input field"
                  placeholder="Enter website"
                  value={values.profile?.website || ""}
                  onChangeText={handleChange("profile.website")}
                />

                {/* Atsarginis mygtukas apačioje mažiems ekranams */}
                {dirty && isValid && (
                  <Button
                    label={saving ? "Saving..." : "Save"}
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

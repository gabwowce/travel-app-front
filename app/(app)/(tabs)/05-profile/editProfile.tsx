import React, { useState } from "react";
import {
  Avatar,
  VStack,
  Heading,
  Text,
  Button,
} from "native-base";
import { useRouter } from "expo-router";
import { useAppSelector, useAppDispatch } from "@/src/data/hooks";
import { selectUser } from "@/src/data/features/user/userSelectors";
import { updateUser } from "@/src/data/features/user/userSlice";
import {
  View,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Header from "@/src/components/Header";
import ScreenContainer from "@/src/components/ScreenContainer";
import CustomInput from "@/src/components/input/CustomInput"; // 🔹 Importuojame CustomInput

export default function EditProfileScreen() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const router = useRouter();

  if (!user) {
    return <Text>Loading...</Text>; // Užtikriname, kad 'user' nėra null
  }

  const [firstName, setFirstName] = useState(user.name?.split(" ")[0] || "");
  const [lastName, setLastName] = useState(user.name?.split(" ")[1] || "");
  const [location, setLocation] = useState(user.profile?.location || "");
  const [bio, setBio] = useState(user.profile?.bio || "");
  const [website, setWebsite] = useState(user.profile?.website || "");

  const handleSave = () => {
    const updatedData = {
      name: `${firstName} ${lastName}`,
      profile: {
        location,
        bio,
        website,
      },
    };

    dispatch(updateUser(updatedData))
      .unwrap()
      .then(() => router.back());
  };

  return (
    <ScreenContainer>
      <Header title="Edit Profile" onBackPress={() => router.back()} rightIcon={<Text onPress={handleSave} color="blue.500">Done</Text>} />
      
      <VStack alignItems="center" mt={5}>
        <Avatar size="xl" source={{ uri: user.profile?.avatar || "https://via.placeholder.com/150" }}>
          {user.name?.[0]}
        </Avatar>
        <TouchableOpacity>
          <Text color="blue.500" mt={2}>Change Profile Picture</Text>
        </TouchableOpacity>
      </VStack>
      
      <VStack space={4} mt={5} px={5}>
        <CustomInput label="First Name" value={firstName} onChangeText={setFirstName} placeholder="Enter first name" />
        <CustomInput label="Last Name" value={lastName} onChangeText={setLastName} placeholder="Enter last name" />
        <CustomInput label="Location" value={location} onChangeText={setLocation} placeholder="Enter location" />
        <CustomInput label="Bio" value={bio} onChangeText={setBio} placeholder="Enter your bio" />
        <CustomInput label="Website" value={website} onChangeText={setWebsite} placeholder="Enter website URL" />
      </VStack>
    </ScreenContainer>
  );
}

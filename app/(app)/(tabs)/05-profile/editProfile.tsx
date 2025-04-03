import React, { useEffect, useState } from "react";
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
import { setUser, updateUser } from "@/src/data/features/user/userSlice";
import {
  View,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Header from "@/src/components/Header";
import ScreenContainer from "@/src/components/ScreenContainer";
import CustomInput from "@/src/components/input/CustomInput"; // 🔹 Importuojame CustomInput
import { UserResponse } from "@/src/data/features/user/userTypes";

export default function EditProfileScreen() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [website, setWebsite] = useState("");
  const [isModified, setIsModified] = useState(false);


  useEffect(() => {
    if (user) {
      const nameParts = user.name?.split(" ") || [];
      setFirstName(nameParts[0] || "");
      setLastName(nameParts[1] || "");
      setLocation(user.profile?.location || "");
      setBio(user.profile?.bio || "");
      setWebsite(user.profile?.website || "");
    }
  }, [user]);
  
  useEffect(() => {
    if (!user) return;
  
    const nameParts = user.name?.split(" ") || [];
    const initialFirst = nameParts[0] || "";
    const initialLast = nameParts[1] || "";
    const initialLocation = user.profile?.location || "";
    const initialBio = user.profile?.bio || "";
    const initialWebsite = user.profile?.website || "";
  
    const hasChanged =
      firstName !== initialFirst ||
      lastName !== initialLast ||
      location !== initialLocation ||
      bio !== initialBio ||
      website !== initialWebsite;
  
    setIsModified(hasChanged);
  }, [firstName, lastName, location, bio, website, user]);
  
  

  if (!user) {
    return <Text>Loading...</Text>; // Užtikriname, kad 'user' nėra null
  }

  

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
    .then((res: UserResponse) => {
      dispatch(setUser(res.data.user)); 
      router.back();
    });
  };

  return (
    <ScreenContainer>
      <Header title="Edit Profile" 
          onBackPress={() => router.back()} rightIcon={
          isModified ? (
            <Text onPress={handleSave} color="blue.500">
              Save
            </Text>
          ) : null
        }
      />
      
      <VStack alignItems="center" mt={5}>
        <Avatar size="xl" source={{ uri:  "https://via.placeholder.com/150" }}>
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

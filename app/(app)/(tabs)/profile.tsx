import React, { useState, useEffect } from "react";
import { Box, Text, Button, Avatar, VStack, HStack, Divider, Heading, Modal } from "native-base";
import LoadingScreen from "@/src/components/screens/loading";
import { logout } from "@/src/data/features/auth/authSlice";
import { useRouter } from "expo-router";

import { useAppSelector, useAppDispatch } from "@/src/data/hooks";
import { selectUser, selectUserLoading } from "@/src/data/features/user/userSelectors";
import { updateUser, fetchUserProfile } from "@/src/data/features/user/userSlice";

import {
  View,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
} from "react-native";

type EditableFields = "name" | "email" | "password" | "profile[bio]" | "profile[location]" | "profile[website]";

export default function ProfileScreen() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const loading = useAppSelector(selectUserLoading);
  const router = useRouter();

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  const [editField, setEditField] = useState<EditableFields | null>(null);
  const [fieldValue, setFieldValue] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  if (loading || !user) {
    return <LoadingScreen />;
  }

  const openEditModal = (field: EditableFields, currentValue: string | null) => {
    setEditField(field);
    setFieldValue(currentValue ?? "");
  };

  const handleLogout = () => {
    dispatch(logout()); // Iškviečiame atsijungimo veiksmą
    router.push("/"); // Perkeliame vartotoją į prisijungimo puslapį
  };
  

  const handleSave = () => {
    if (!editField) return;

    let updatedData: any = {};

    if (editField === "password") {
      if (password !== confirmPassword) {
        alert("❌ Slaptažodžiai nesutampa!");
        return;
      }
      updatedData = { password, password_confirmation: confirmPassword };
    } else if (editField === "name" || editField === "email") {
      updatedData = { [editField]: fieldValue };
    } else {
      updatedData = { profile: { [editField.replace("profile[", "").replace("]", "")]: fieldValue } };
    }

    dispatch(updateUser(updatedData))
      .unwrap()
      .then(() => {
        dispatch(fetchUserProfile());
        setEditField(null);
      });
  };

  return (
    <Box flex={1} bg="coolGray.50" px={4} py={6} alignItems="center">
      <Avatar size="2xl" source={{ uri: user.profile?.avatar || "https://via.placeholder.com/150" }}>{user.name?.[0]}</Avatar>

      <Heading mt={3} fontSize="xl">{user.name}</Heading>
      <Text color="gray.500">{user.email}</Text>

      <Divider my={4} />

      <VStack space={4} width="100%">
        {["name", "email", "profile[bio]", "profile[location]", "profile[website]"].map((field) => (
          <HStack key={field} justifyContent="space-between" alignItems="center">
            <Text fontSize="md">{field.replace("profile[", "").replace("]", "").toUpperCase()}:</Text>
            <Text>
              {field === "name" && user.name}
              {field === "email" && user.email}
              {field === "profile[bio]" && user.profile?.bio}
              {field === "profile[location]" && user.profile?.location}
              {field === "profile[website]" && user.profile?.website}
            </Text>
            <Button size="sm" variant="ghost" onPress={() => openEditModal(field as EditableFields, user.profile?.bio)}>Keisti</Button>
          </HStack>
        ))}
        <HStack justifyContent="space-between" alignItems="center">
          <Text fontSize="md">Slaptažodis:</Text>
          <Button size="sm" colorScheme="red" onPress={() => openEditModal("password", "")}>Keisti slaptažodį</Button>
        </HStack>
      </VStack>

      <Button mt={6} colorScheme="red" onPress={handleLogout}>Atsijungti</Button>

      <Modal isOpen={!!editField} onClose={() => setEditField(null)}>
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>{editField === "password" ? "Keisti slaptažodį" : `Keisti ${editField}`}</Modal.Header>
          <Modal.Body>
            {editField === "password" ? (
              <VStack space={3}>
                <TextInput placeholder="Slaptažodis" secureTextEntry value={password} onChangeText={setPassword} />
                <TextInput placeholder="Pakartoti slaptažodį" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />
              </VStack>
            ) : (
              <TextInput placeholder={`Naujas ${editField}`} value={fieldValue} onChangeText={setFieldValue} />
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button onPress={handleSave}>Išsaugoti</Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Box>
  );
}

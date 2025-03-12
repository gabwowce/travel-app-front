import React, { useState, useEffect } from "react";
import { Box, Text, Button, Avatar, VStack, HStack, Divider, Heading, Modal, Input } from "native-base";
import LoadingScreen from "@/src/components/screens/loading";
import { logout } from "@/src/data/features/auth/authSlice";
import { useRouter } from "expo-router";

import {
  View,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
} from "react-native";

import { useAppSelector, useAppDispatch } from "@/src/data/hooks";
import { selectUser, selectUserLoading } from "@/src/data/features/user/userSelectors";
import { updateUser, fetchUserProfile } from "@/src/data/features/user/userSlice";

export default function ProfileScreen() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const loading = useAppSelector(selectUserLoading);
  const router = useRouter();

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  const [editField, setEditField] = useState(null);
  const [fieldValue, setFieldValue] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  if (loading || !user) {
    return <LoadingScreen />;
  }

  // Atidaryti modalą redagavimui
  const openEditModal = (field, currentValue) => {
    setEditField(field);
    setFieldValue(currentValue);
  };

  // Išsaugoti atnaujintą lauką
  const handleSave = () => {
    if (editField === "password") {
      if (password !== confirmPassword) {
        alert("❌ Slaptažodžiai nesutampa!");
        return;
      }

      dispatch(updateUser({ password, password_confirmation: confirmPassword }))
        .unwrap()
        .then(() => {
          dispatch(fetchUserProfile());
          setEditField(null);
        });
    } else {
      dispatch(updateUser({ [editField]: fieldValue }))
        .unwrap()
        .then(() => {
          dispatch(fetchUserProfile());
          setEditField(null);
        });
    }
  };

  return (
    <Box flex={1} bg="coolGray.50" px={4} py={6} alignItems="center">
      {/* Profilio nuotrauka */}
      <Avatar
        size="2xl"
        source={{
          uri: user.profile?.avatar || "https://via.placeholder.com/150",
        }}
      >
        {user.name?.[0]}
      </Avatar>

      <Heading mt={3} fontSize="xl">
        {user.name}
      </Heading>
      <Text color="gray.500">{user.email}</Text>

      <Divider my={4} />

      <VStack space={4} width="100%">
        <HStack justifyContent="space-between" alignItems="center">
          <Text fontSize="md">Vardas:</Text>
          <Text fontWeight="bold">{user.name}</Text>
          <Button size="sm" variant="ghost" onPress={() => openEditModal("name", user.name)}>Keisti</Button>
        </HStack>

        <HStack justifyContent="space-between" alignItems="center">
          <Text fontSize="md">El. paštas:</Text>
          <Text>{user.email}</Text>
          <Button size="sm" variant="ghost" onPress={() => openEditModal("email", user.email)}>Keisti</Button>
        </HStack>

        <HStack justifyContent="space-between" alignItems="center">
          <Text fontSize="md">Bio:</Text>
          <Text>{user.profile?.bio || "Nėra aprašymo"}</Text>
          <Button size="sm" variant="ghost" onPress={() => openEditModal("profile[bio]", user.profile?.bio)}>Keisti</Button>
        </HStack>

        <HStack justifyContent="space-between" alignItems="center">
          <Text fontSize="md">Vietovė:</Text>
          <Text>{user.profile?.location || "Nėra vietovės"}</Text>
          <Button size="sm" variant="ghost" onPress={() => openEditModal("profile[location]", user.profile?.location)}>Keisti</Button>
        </HStack>

        <HStack justifyContent="space-between" alignItems="center">
          <Text fontSize="md">Svetainė:</Text>
          <Text>{user.profile?.website || "Nėra"}</Text>
          <Button size="sm" variant="ghost" onPress={() => openEditModal("profile[website]", user.profile?.website)}>Keisti</Button>
        </HStack>

        <HStack justifyContent="space-between" alignItems="center">
          <Text fontSize="md">Slaptažodis:</Text>
          <Button size="sm" variant="solid" colorScheme="red" onPress={() => openEditModal("password", "")}>
            Keisti slaptažodį
          </Button>
        </HStack>
      </VStack>

      {/* Atsijungimo mygtukas */}
      <Button mt={6} colorScheme="red" onPress={handleLogout}>
        Atsijungti
      </Button>

      {/* MODALAS PROFILIO KEITIMUI */}
      <Modal isOpen={!!editField} onClose={() => setEditField(null)}>
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>
            {editField === "password" ? "Keisti slaptažodį" : `Keisti ${editField}`}
          </Modal.Header>
          <Modal.Body>
            {editField === "password" ? (
              <VStack space={3}>
                <TextInput
                  placeholder="Naujas slaptažodis"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
                <TextInput
                  placeholder="Pakartokite slaptažodį"
                  secureTextEntry
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
              </VStack>
            ) : (
              <TextInput
                placeholder={`Naujas ${editField}`}
                value={fieldValue}
                onChangeText={setFieldValue}
              />
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="ghost" onPress={() => setEditField(null)}>Atšaukti</Button>
            <Button onPress={handleSave}>Išsaugoti</Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Box>
  );
}

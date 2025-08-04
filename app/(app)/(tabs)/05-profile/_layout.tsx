import React from "react";
import { Stack, useRouter } from "expo-router";
import { defaultHeaderOptions } from "@/src/navigation/headerOptions";
import { IconButton } from "native-base";
import { AntDesign } from "@expo/vector-icons";

export default function ProfileLayout() {
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        ...defaultHeaderOptions,          
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Profile",
          headerRight: () => (
            <IconButton
              variant="ghost"
              _pressed={{ opacity: 0.6 }}
              icon={<AntDesign name="edit" size={24} color="black" />}
              onPress={() => router.push("/05-profile/editProfile")}
            />
          ),
        }}
      />

      <Stack.Screen
        name="editProfile"
        options={{ title: "Edit Profile" }}
      />
      <Stack.Screen
        name="changePassword"
        options={{ title: "Change Password" }}
      />
    </Stack>
  );
}

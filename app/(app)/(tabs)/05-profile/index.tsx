import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  Avatar,
  VStack,
  HStack,
  Divider,
  Heading,
  IconButton,
  ScrollView,
} from "native-base";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAppSelector, useAppDispatch } from "@/src/data/hooks";
import { logout } from "@/src/data/features/auth/authThunks";
import { fetchUserProfile } from "@/src/data/features/user/userSlice";
import {
  View,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import LoadingScreen from "@/src/components/screens/loading";
import Header from "@/src/components/Header";
import ScreenContainer from "@/src/components/ScreenContainer";

import { Linking, Platform } from "react-native";



export default function ProfileScreen() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.auth.user);
  const loading = useAppSelector(state => state.auth.loading);
  const router = useRouter();

  const openNotificationSettings = () => {
    if (Platform.OS === "ios") {
      Linking.openURL("app-settings:");
    } else {
      Linking.openSettings();
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
  };

  useEffect(() => {
    if (!user) {
      dispatch(fetchUserProfile());
    }
  }, [user, dispatch]);
  

  if (loading || !user) {
    return <LoadingScreen />;
  }

  interface MenuItem {
    title: string;
    icon: string;
    color?: string;
    action?: () => void;
  }
  
  const menuItems: { title: string; options: MenuItem[] }[] = [
    {
      title: "Preferences & Customization",
      options: [
        // { title: "Interests & Categories", icon: "category" },
        { title: "Favorites", icon: "favorite-border", action: () => router.push("/(app)/(tabs)/saved")  },
        // { title: "Visited Places", icon: "place" },
        // { title: "Preferred Map Type", icon: "map" },
        { title: "Notification Settings", icon: "notifications", action: openNotificationSettings },
      ],
    },
    {
      title: "Security & Privacy",
      options: [
        { title: "Edit Profile", icon: "person", action: () => router.push("/05-profile/editProfile") },
        { title: "Change Password", icon: "lock", action: () => router.push("/05-profile/changePassword") },
        // { title: "Enable GPS Tracking", icon: "location-on" },
        // { title: "Enable Audio Guide", icon: "hearing" },
        // { title: "Privacy Settings", icon: "privacy-tip" },
      ],
    },
    {
      title: "Account Management",
      options: [
        { title: "Logout", icon: "logout", color: "red", action: handleLogout },
        // { title: "Delete Account", icon: "delete", color: "red", action: () => console.log("Delete Account") },
      ],
    },
  ];
  

  return (
    <ScreenContainer style={styles.container} variant="top">
      <Header 
        title="Profile" 
        rightIcon={<IconButton 
          icon={<AntDesign name="edit" size={24} color="black" />} 
          onPress={() => router.push("/05-profile/editProfile")}
        />}
      />
      
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <VStack alignItems="center" mt={5}>
          <Avatar size="xl" source={{ uri: "https://via.placeholder.com/150" }}>
            {user.name}
          </Avatar>
          <Heading mt={3} fontSize="lg">{user.name}</Heading>
          <Text color="gray.500">{user.email}</Text>
        </VStack>
        
        <Divider my={4} />

        {menuItems.map((section, index) => (
          <VStack key={index} space={3}>
            <Text style={styles.itemsTitle} fontSize="md" fontWeight="bold">{section.title}</Text>
            {section.options.map((item, idx) => (
              <TouchableOpacity key={idx} style={styles.listItem} onPress={item.action || (() => {})}>
                <HStack alignItems="center">
                  <MaterialIcons name={item.icon as any} size={24} color={item.color || "black"} />
                  <Text ml={3} style={{ color: item.color || "black" }}>{item.title}</Text>
                </HStack>
                {/* Rodyklė nerodoma tik "Account Management" sekcijoje */}
                {section.title !== "Account Management" && (
                  <MaterialIcons name="keyboard-arrow-right" size={24} color="gray" />
                )}
              </TouchableOpacity>
            ))}
          </VStack>
        ))}

      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  itemsTitle:{
    paddingTop:30
  },
  container:{
    paddingBottom:30
  }
});

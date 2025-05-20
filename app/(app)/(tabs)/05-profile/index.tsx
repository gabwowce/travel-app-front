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
import { useFocusEffect, useRouter } from "expo-router";
import { useAppSelector, useAppDispatch } from "@/src/data/hooks";
import {
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import LoadingScreen from "@/src/components/screens/loading";
import Header from "@/src/components/Header";
import ScreenContainer from "@/src/components/ScreenContainer";

import { Linking, Platform } from "react-native";
import FlexContainer from "@/src/components/layout/FlexContainer";

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { useGetUserProfileQuery, useLogoutUserMutation, useGetCurrentUserQuery  } from '@/src/store/travelApi';
import CircleButton from "@/src/components/ui/btns/CircleButton";


export default function ProfileScreen() {
  const dispatch = useAppDispatch();
  
  const router = useRouter();

  const {
    data,
    isLoading: loading,
    isError,
    refetch,
  } = useGetCurrentUserQuery();
  
  const user = data?.data; // <- Čia tikras user objektas
   const profile = user?.profile;
  
  const [logoutUser, { isLoading: loggingOut }] = useLogoutUserMutation();
  
  const openNotificationSettings = () => {
    if (Platform.OS === "ios") {
      Linking.openURL("app-settings:");
    } else {
      Linking.openSettings();
    }
  };

const handleLogout = async () => {
  try {
    await logoutUser().unwrap(); 
  } catch (e) {
    console.warn("Logout failed or was already invalid:", e);
  }

  router.replace("/(auth)");
};


useFocusEffect(
  React.useCallback(() => {
    refetch();
  }, [refetch])
);


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
  
  const initial = user.name?.charAt(0)?.toUpperCase() ?? "?";

  return(
            <FlexContainer>
              <Header
                title="Profile"
                rightIcon={
                  <CircleButton
                    variant="edit"
                    onPress={() => router.push("/05-profile/editProfile")}
                  />
                }
              />

    
              <ScrollView keyboardShouldPersistTaps="handled">
                 <VStack space={4} mt={6} px={5}>
                    <VStack alignItems="center">
                      <Avatar size="xl" source={{ uri: "https://via.placeholder.com/150" }}>
                        {initial}
                      </Avatar>
                    
                      <Heading mt={hp("4%")} fontSize="lg">{user?.name}</Heading>
                      
                      <Text color="gray.500">{user?.email}</Text>
                    </VStack>
                    <Divider my={4} />
    
                    {profile?.bio && (
                        <Text mt={2} fontStyle="italic" textAlign="center" maxW="80%">
                          {profile.bio}
                        </Text>
                      )}
                    
                      {profile?.location && (
                        <Text mt={1} color="gray.500">
                          📍 {profile.location}
                        </Text>
                      )}
                    
                      {profile?.website && (
                        <Text
                          mt={1}
                          color="blue.500"
                          textDecorationLine="underline"
                          onPress={() => Linking.openURL(profile.website)}
                        >
                          {profile.website}
                        </Text>
                      )}
                </VStack>

                <VStack  pb={5}>

                  {/* Meniu sekcijos */}
                {menuItems.map((section, index) => (
                  <VStack key={index} space={hp("2%")}>
                    <Text style={styles.itemsTitle} fontSize="md" fontWeight="bold">{section.title}</Text>
                    {section.options.map((item, idx) => (
                      <TouchableOpacity key={idx} style={styles.listItem} onPress={item.action || (() => {})}>
                        <HStack alignItems="center">
                          <MaterialIcons name={item.icon as any} size={24} color={item.color || "black"} />
                          <Text ml={3} style={{ color: item.color || "black" }}>{item.title}</Text>
                        </HStack>
                        {section.title !== "Account Management" && (
                          <MaterialIcons name="keyboard-arrow-right" size={24} color="gray" />
                        )}
                      </TouchableOpacity>
                    ))}
                  </VStack>
                ))}

                </VStack>
                
                
              </ScrollView>
            </FlexContainer>
  );
}

const styles = StyleSheet.create({
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: wp("3%"),
    marginHorizontal: wp("3%"),
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 0,

  },
  
  itemsTitle: {
    paddingTop: 30,
    marginHorizontal: wp("3%"),
  },
  
  container:{
    
  }
});

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
import { useGetUserProfileQuery, useLogoutUserMutation  } from '@/src/store/travelApi';


export default function ProfileScreen() {
  const dispatch = useAppDispatch();
  // const user = useAppSelector(state => state.auth.user);
  // const loading = useAppSelector(state => state.auth.loading);
  const router = useRouter();

  const {
    data: user,
    isLoading: loading,
    isError,
    refetch,
  } = useGetUserProfileQuery();
  const [logoutUser, { isLoading: loggingOut }] = useLogoutUserMutation();
  
  const openNotificationSettings = () => {
    if (Platform.OS === "ios") {
      Linking.openURL("app-settings:");
    } else {
      Linking.openSettings();
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push("/(auth)");
  };
  

  // useEffect(() => {
  //   if (!user) {
  //     dispatch(fetchUserProfile());
  //   }
  // }, [user, dispatch]);
  

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
        { title: "Favorites", icon: "favorite-border", action: () => router.push("/(app)/(tabs)/search")  },
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
<ScrollView style={{ backgroundColor: "#FFF" }} keyboardShouldPersistTaps="handled">
  <FlexContainer gap={16} >
    <Header
      title="Profile"
      rightIcon={
        <IconButton
          icon={<AntDesign name="edit" size={24} color="black" />}
          onPress={() => router.push("/05-profile/editProfile")}
        />
      }
    />

    {/* Profilio info (avatar, vardas, el.paštas) */}
    <VStack alignItems="center" mb={hp("1%")}>
      <Avatar size="xl" source={{ uri: "https://via.placeholder.com/150" }}>
        {initial}
      </Avatar>
      <Heading mt={hp("4%")} fontSize="lg">{user.name}</Heading>
      <Text color="gray.500">{user.email}</Text>
    </VStack>

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
  </FlexContainer>
</ScrollView>

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

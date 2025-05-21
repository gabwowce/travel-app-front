import { useFocusEffect, useRouter } from "expo-router";
import { useCallback } from "react";
import { Platform, Linking } from "react-native";
import { useAppDispatch } from "@/src/data/hooks";
import {
  useGetCurrentUserQuery,
  useGetUserProfileQuery,
  useLogoutUserMutation,
} from "@/src/store/travelApi";
import { AppRoutes } from "@/src/config/routes";

export function useProfileData() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { data, isLoading, isError, refetch } = useGetCurrentUserQuery();
  const user = data?.data;

  const { data: profileData } = useGetUserProfileQuery();
  const profile = profileData?.data?.profile;

  const [logoutUser, { isLoading: loggingOut }] = useLogoutUserMutation();

  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();
    } catch (e) {
      console.warn("Logout failed or was already invalid:", e);
    }
    router.replace(AppRoutes.LOGIN);
  };

  const openNotificationSettings = () => {
    if (Platform.OS === "ios") {
      Linking.openURL("app-settings:");
    } else {
      Linking.openSettings();
    }
  };

  useFocusEffect(
    useCallback(() => {
      refetch();
      return undefined;
    }, [refetch])
  );

  return {
    user,
    profile,
    isLoading,
    loggingOut,
    handleLogout,
    openNotificationSettings,
  };
}

import { Divider, ScrollView, VStack } from "native-base";
import FlexContainer from "@/src/components/layout/FlexContainer";
import Header from "@/src/components/Header";
import CircleButton from "@/src/components/ui/btns/CircleButton";
import LoadingScreen from "@/src/components/screens/loading";
import { AppRoutes } from "@/src/config/routes";
import ProfileMenu from "@/src/components/profile/ProfileMenu";
import ProfileHeaderInfo from "@/src/components/profile/ProfileHeaderInfo";
import ProfileDetails from "@/src/components/profile/ProfileDetails";
import { useProfileData } from "@/src/hooks/useProfileData";
import { useRouter } from "expo-router";
import useAnnounceForAccessibility from "@/src/hooks/useAnnounceForAccessibility";

export default function ProfileScreen() {
  useAnnounceForAccessibility("Profile screen opened");
  const { user, profile, isLoading, handleLogout, openNotificationSettings } =
    useProfileData();

  if (isLoading || !user) {
    return <LoadingScreen />;
  }
  const router = useRouter();
  const menuItems = [
    {
      title: "Preferences & Customization",
      options: [
        {
          title: "Favorites",
          icon: "favorite-border",
          action: () => router.push(AppRoutes.FAVORITES),
        },
        {
          title: "Notification Settings",
          icon: "notifications",
          action: openNotificationSettings,
        },
      ],
    },
    {
      title: "Security & Privacy",
      options: [
        {
          title: "Edit Profile",
          icon: "person",
          action: () => router.push(AppRoutes.EDIT_PROFILE),
        },
        {
          title: "Change Password",
          icon: "lock",
          action: () => router.push(AppRoutes.CHANGE_PASSWORD),
        },
      ],
    },
    {
      title: "Account Management",
      options: [
        { title: "Logout", icon: "logout", color: "red", action: handleLogout },
      ],
    },
  ];

  return (
    <FlexContainer>
      {/* <Header
        title="Profile"
        rightIcon={
          <CircleButton
            variant="edit"
            onPress={() => router.push(AppRoutes.EDIT_PROFILE)}
          />
        }
      /> */}

      <ScrollView keyboardShouldPersistTaps="handled">
        <VStack space={4} mt={6} px={5}>
          <ProfileHeaderInfo user={user} />
          <Divider my={4} />
          <ProfileDetails profile={profile} />
        </VStack>

        <ProfileMenu menuItems={menuItems} />
      </ScrollView>
    </FlexContainer>
  );
}

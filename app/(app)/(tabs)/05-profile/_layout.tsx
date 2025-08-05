import { Stack, useRouter } from "expo-router";
import { defaultHeaderOptions } from "@/src/navigation/headerOptions";
import CircleButton from "@/src/components/ui/btns/CircleButton";
import { AppRoutes } from "@/src/config/routes";

export default function ProfileLayout() {
  const router = useRouter();
  return (
    <Stack screenOptions={{ ...defaultHeaderOptions }}>
      <Stack.Screen
        name="index"
        options={{
          title: "Profile",
          headerRight: () => {
            return (
              <CircleButton
                variant="edit"
                onPress={() => router.push(AppRoutes.EDIT_PROFILE)}
              />
            );
          },
        }}
      />
      <Stack.Screen
        name="editProfile"
        options={{
          title: "Edit Profile",
        }}
      />
      <Stack.Screen
        name="changePassword"
        options={{
          title: "Change Password",
        }}
      />
    </Stack>
  );
}

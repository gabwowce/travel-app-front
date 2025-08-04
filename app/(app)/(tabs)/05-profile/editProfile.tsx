import React, {
  useEffect,
  useState,
  useLayoutEffect,
  useCallback,
} from "react";
import { Avatar, VStack, Text } from "native-base";
import { useRouter, useNavigation } from "expo-router";
import { useAppSelector, useAppDispatch } from "@/src/data/hooks";
import { selectUser } from "@/src/data/features/user/userSelectors";
import { setUser, updateUser } from "@/src/data/features/user/userSlice";
import ScreenContainer from "@/src/components/ScreenContainer";
import CustomInput from "@/src/components/input/CustomInput";
import { UserResponse } from "@/src/data/features/user/userTypes";

type FormState = {
  firstName: string;
  lastName: string;
  location: string;
  bio: string;
  website: string;
};

export default function EditProfileScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  const [form, setForm] = useState<FormState>({
    firstName: "",
    lastName: "",
    location: "",
    bio: "",
    website: "",
  });

  /* ---------- Inicializacija iš user ---------- */
  useEffect(() => {
    if (!user) return;
    const [first = "", last = ""] = (user.name ?? "").split(" ");
    setForm({
      firstName: first,
      lastName: last,
      location: user.profile?.location ?? "",
      bio: user.profile?.bio ?? "",
      website: user.profile?.website ?? "",
    });
  }, [user]);

  /* ---------- Ar kas nors pasikeitė? ---------- */
  const isModified = (() => {
    if (!user) return false;
    const [initFirst = "", initLast = ""] = (user.name ?? "").split(" ");
    return (
      form.firstName !== initFirst ||
      form.lastName !== initLast ||
      form.location !== (user.profile?.location ?? "") ||
      form.bio !== (user.profile?.bio ?? "") ||
      form.website !== (user.profile?.website ?? "")
    );
  })();

  /* ---------- Save ---------- */
  const handleSave = useCallback(() => {
    const updated = {
      name: `${form.firstName} ${form.lastName}`,
      profile: {
        location: form.location,
        bio: form.bio,
        website: form.website,
      },
    };
    dispatch(updateUser(updated))
      .unwrap()
      .then((res: UserResponse) => {
        dispatch(setUser(res.data.user));
        router.back();
      });
  }, [form, dispatch, router]);

  /* ---------- Header ---------- */
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        isModified ? (
          <Text onPress={handleSave} color="blue.500" mr={2}>
            Save
          </Text>
        ) : null,
    });
  }, [navigation, isModified, handleSave]);

  if (!user) return <Text>Loading...</Text>;

  const onChange = (key: keyof FormState) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  /* ---------- UI ---------- */
  return (
    <ScreenContainer>
      <VStack alignItems="center" mt={5}>
        <Avatar
          size="xl"
          source={{ uri: "https://via.placeholder.com/150" }}
        >
          {user.name?.[0]}
        </Avatar>
        <Text color="blue.500" mt={2}>
          Change Profile Picture
        </Text>
      </VStack>

      <VStack space={4} mt={5} px={5}>
        <CustomInput
          label="First Name"
          value={form.firstName}
          onChangeText={onChange("firstName")}
        />
        <CustomInput
          label="Last Name"
          value={form.lastName}
          onChangeText={onChange("lastName")}
        />
        <CustomInput
          label="Location"
          value={form.location}
          onChangeText={onChange("location")}
        />
        <CustomInput
          label="Bio"
          value={form.bio}
          onChangeText={onChange("bio")}
        />
        <CustomInput
          label="Website"
          value={form.website}
          onChangeText={onChange("website")}
        />
      </VStack>
    </ScreenContainer>
  );
}

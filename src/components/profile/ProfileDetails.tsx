import { VStack, Text } from "native-base";
import { Linking } from "react-native";

export default function ProfileDetails({ profile }: { profile: any }) {
  if (!profile) return null;

  return (
    <VStack space={2} alignItems="flex-start">
      {profile.bio && (
        <Text accessibilityLabel={`Bio: ${profile.bio}`}>
          <Text bold>Bio: </Text>
          {profile.bio}
        </Text>
      )}

      {profile.location && (
        <Text accessibilityLabel={`Location: ${profile.location}`}>
          <Text bold>Location: </Text>
          {profile.location}
        </Text>
      )}

      {profile.website && (
        <Text
          color="blue.500"
          textDecorationLine="underline"
          onPress={() => Linking.openURL(profile.website || "")}
          accessibilityRole="link"
          accessibilityLabel={`Website: ${profile.website}`}
        >
          <Text bold>Website: </Text>
          {profile.website}
        </Text>
      )}
    </VStack>
  );
}

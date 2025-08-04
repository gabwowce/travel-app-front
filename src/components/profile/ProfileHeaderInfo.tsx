import { Avatar, VStack, Heading, Text } from "native-base";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";

export default function ProfileHeaderInfo({ user }: { user: any }) {
  const initial = user?.name?.charAt(0)?.toUpperCase() ?? "?";

  return (
    <VStack alignItems="center">
      <Avatar size="xl" source={{ uri: "https://via.placeholder.com/150" }}
      accessibilityLabel={`Profile avatar of ${user?.name ?? "unknown user"}`}>
        {initial}
      </Avatar>

      <Heading mt={hp("4%")} fontSize="lg" accessibilityRole="header">
        {user?.name}
      </Heading>
      <Text color="gray.500" accessibilityLabel={`Email address: ${user?.email}`}>{user?.email}</Text>
    </VStack>
  );
}

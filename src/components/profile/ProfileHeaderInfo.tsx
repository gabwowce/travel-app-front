import { Avatar, VStack, Heading, Text } from "native-base";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";

export default function ProfileHeaderInfo({ user }: { user: any }) {
  const initial = user?.name?.charAt(0)?.toUpperCase() ?? "?";

  return (
    <VStack alignItems="center">
      <Avatar size="xl" source={{ uri: "https://via.placeholder.com/150" }}>
        {initial}
      </Avatar>

      <Heading mt={hp("4%")} fontSize="lg">
        {user?.name}
      </Heading>
      <Text color="gray.500">{user?.email}</Text>
    </VStack>
  );
}

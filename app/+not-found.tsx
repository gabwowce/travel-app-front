import { Stack, useRouter } from "expo-router";
import { Box, Center, Button, Text } from "native-base";

export default function NotFoundScreen() {
  const router = useRouter(); // ✅ Naudojame expo-router navigaciją

  return (
    <>
      <Stack.Screen options={{ title: "Oops! Not Found!" }} />
      <Center flex={1} bg="white">
        <Box alignItems="center">
          <Text variant="header2Bold">Not Found 404</Text>
          <Button mt={4} colorScheme="primary" onPress={() => router.push("/")}>
            Go Home
          </Button>
        </Box>
      </Center>
    </>
  );
}

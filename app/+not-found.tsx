import { AppRoutes } from "@/src/config/routes";
import { Stack, useRouter } from "expo-router";
import { Box, Center, Button, Text, VStack, Image } from "native-base";

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <Center flex={1} bg="#F9FAFB" px={5}>
        <VStack space={6} alignItems="center">
          {/* Emoji arba iliustracija */}
          <Text fontSize="6xl" importantForAccessibility="no"
            accessibilityElementsHidden>🧭</Text>

          {/* Antraštė */}
          <Text fontSize="3xl" fontWeight="bold" color="coolGray.800" accessibilityRole="header">
            404 – Page not found
          </Text>

          {/* Aprašymas */}
          <Text
            fontSize="md"
            textAlign="center"
            color="coolGray.500"
            maxW="80%"
          >
            Looks like you’ve taken a wrong turn. Let’s get you back on the
            trail!
          </Text>

          {/* Mygtukas */}
          <Button
          accessibilityRole="button"
            accessibilityLabel="Go to home screen"
            accessibilityHint="Navigates back to the main page"
            bg="primary.500"
            _pressed={{ bg: "primary.600" }}
            _text={{ color: "white" }}
            size="lg"
            borderRadius="full"
            px={8}
            onPress={() => router.replace(AppRoutes.HOME)}
          >
            Go Home
          </Button>
        </VStack>
      </Center>
    </>
  );
}

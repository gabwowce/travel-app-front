// src/components/ui/RandomRouteButton.tsx
import React from "react";
import { Box, VStack, Text, HStack, Button } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useGetRoutesQuery } from "@/src/store/travelApi";

export default function RandomRouteButton() {
  const router = useRouter();

  // Gaunam visus turus (arba daug jų – pagal poreikį)
  const { data, isLoading } = useGetRoutesQuery({ limit: 100});
  const routes = data?.data ?? [];

  const handleRandomRoute = () => {
    if (!routes.length) return;
    const random = routes[Math.floor(Math.random() * routes.length)];
    router.push(`/routes/${random.id}`);
  };

  if (isLoading) return null;

  return (
    <VStack
      alignItems="center"
      px={5}
      my={3}
      mt={10}
      space={3}
      bg="transparent"
      py={6}
      borderRadius="2xl"
    >
      <HStack space={2} alignItems="center">
        <Ionicons name="sparkles-outline" size={24} color="#3B82F6" />
        <Text fontSize="lg" fontWeight="bold" color="primary.800">
          Try something new!
        </Text>
      </HStack>

      <Text textAlign="center" fontSize="sm" px={4} color="gray.600">
        Get a randomly selected tour – a perfect choice when you're not sure where to go.
      </Text>

      <Button
        leftIcon={<Ionicons name="dice-outline" size={20} color="white" />}
        colorScheme="primary"
        borderRadius="full"
        onPress={handleRandomRoute}
        isDisabled={!routes.length}
      >
        Surprise me
      </Button>
    </VStack>
  );
}

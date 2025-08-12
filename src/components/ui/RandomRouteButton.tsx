// src/components/ui/RandomRouteButton.tsx
import React from "react";
import { VStack, Text, HStack, Button } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { AccessibilityInfo } from "react-native";
import { useLazyGetRoutesQuery } from "@/src/store/LazyHooks";
import useAnnounceForAccessibility from "@/src/hooks/useAnnounceForAccessibility";

export default function RandomRouteButton() {
  const router = useRouter();
  // Hook’ą kviesk top-level su pradiniu pranešimu (nebūtina):
  // useAnnounceForAccessibility("Random button rendered");

  const [trigger, { isFetching }] = useLazyGetRoutesQuery();

  const handleRandomRoute = async () => {
    try {
      const result = await trigger({
        limit: 100,
        sort: "rating_desc",
      }).unwrap();
      const routes = result?.data ?? [];
      if (!routes.length) return;

      const random = routes[Math.floor(Math.random() * routes.length)];

      // saugus pranešimas
      AccessibilityInfo.announceForAccessibility?.(
        `Navigating to random tour: ${random.name}`
      );

      // jei naudoji route group'ą (app), URL vis tiek gali būti be grupės:
      router.push(`/routes/${random.id}`);
      // arba saugiau:
      // router.push({ pathname: "/routes/[id]", params: { id: String(random.id) } });
    } catch (e) {
      console.warn("[RandomRouteButton] failed to fetch routes", e);
    }
  };

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
        Get a randomly selected tour – a perfect choice when you're not sure
        where to go.
      </Text>

      <Button
        leftIcon={<Ionicons name="dice-outline" size={20} color="white" />}
        colorScheme="primary"
        borderRadius="full"
        accessibilityLabel="Suggest me a random tour"
        accessibilityRole="button"
        accessibilityHint="Navigates to a randomly selected tour"
        onPress={handleRandomRoute}
        isLoading={isFetching}
        isDisabled={isFetching}
        style={{
          shadowColor: "#000",
          shadowOpacity: 0.08,
          shadowOffset: { width: 0, height: 4 },
          shadowRadius: 12,
          elevation: 4,
        }}
      >
        Surprise me
      </Button>
    </VStack>
  );
}

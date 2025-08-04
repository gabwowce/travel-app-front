import React from "react";
import { VStack, Center, Text, Button, WarningIcon } from "native-base";
import * as Updates from "expo-updates";          // ← pridėta!
import { LinearGradient } from "expo-linear-gradient";

interface ErrorProps {
  message: string;
}

export default function ErrorScreen({ message }: ErrorProps) {
  return (
    <Center flex={1}>
      <LinearGradient
        colors={["#ffd0d0", "#ffe6e6"]}
        style={{ position: "absolute", inset: 0 }}
      />
      <VStack space={3} alignItems="center">
        <WarningIcon size="lg" color="red.500" />
        <Text fontSize="lg" fontWeight="bold">
          {message}
        </Text>
        <Text textAlign="center">{message}</Text>
        {/* Jei norisi „bandyti dar kartą“ be app restart — gali paprastai iškviesti
            loadAppResources dar kartą. Bet greičiausias kelias — pilnas reload. */}
        <Button onPress={() => { Updates.reloadAsync(); }}>Reload app</Button>
      </VStack>
    </Center>
  );
}

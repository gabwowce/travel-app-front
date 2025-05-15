
import { IconButton, Icon } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { router, useSegments } from "expo-router";

export default function FilterButton({ routeKey }: { routeKey: string }) {
    console.log("-->routeKey: " + routeKey);
  return (
    <IconButton
      icon={<Icon as={Ionicons} name="options-outline" size="lg" />}
      _pressed={{ opacity: 0.7 }}
      onPress={() =>
        router.push({ pathname: "/(app)/(modals)/filters", params: { from: routeKey } })
      }
    />
  );
}

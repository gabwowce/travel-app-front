import { Stack } from "expo-router";
import { defaultHeaderOptions } from "@/src/navigation/headerOptions";

export default function LegalLayout() {
  return (
    <Stack screenOptions={{ ...defaultHeaderOptions }}>
       <Stack.Screen
        name="privacy"
        options={{
          title: "Privacy Policy"}}
      />
    </Stack>
  );
}

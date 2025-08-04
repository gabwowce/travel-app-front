import { Stack } from "expo-router";
import { defaultHeaderOptions } from "@/src/navigation/headerOptions";

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ ...defaultHeaderOptions }}>
      <Stack.Screen name="index"           options={{  headerShown: false }} />
      <Stack.Screen name="register"        options={{  headerShown: false }} />
       <Stack.Screen
        name="forgotPassword"
        options={{
          title: "Forgot Password",
          headerTransparent: true,         
          headerStyle: { backgroundColor: "transparent" }, // (nebūtina, bet nuima šešėlį Android’e)
        }}
      />
    </Stack>
  );
}

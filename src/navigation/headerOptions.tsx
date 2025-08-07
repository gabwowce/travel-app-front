import { Platform } from "react-native";
import BackButton from "./BackButton";

export const defaultHeaderOptions = {
  headerStyle: { backgroundColor: "#FFFCF9" },
  headerTitleStyle: { fontWeight: "bold", fontSize: 18 },
  headerBackTitleVisible: false,
  headerLeft: () => (
    <BackButton
      style={{
        marginRight: 10,
        transform: [{ translateY: Platform.OS === "ios" ? 0 : 0 }],
      }}
    />
  ),
} as const;

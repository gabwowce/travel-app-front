import { useRouter } from "expo-router";
import { useCreateTour } from "./context";
import { View, Button, Text } from "react-native";

export default function SelectCategory() {
  const router = useRouter();
  const { setData } = useCreateTour();

  const handleSelect = () => {
    setData({ category: "Historical" });
    router.push("confirm");
  };

  return (
    <View>
      <Text>Pasirink kategoriją</Text>
      <Button title="Historical" onPress={handleSelect} />
    </View>
  );
}

import { useRouter } from "expo-router";
import { useCreateTour } from "./context";
import { View, Button, Text } from "react-native";

export default function SelectCity() {
  const router = useRouter();
  const { setData } = useCreateTour();

  const handleSelect = () => {
    setData({ city: "Vilnius" });
    router.push("category");
  };

  return (
    <View>
      <Text>Pasirink miestas</Text>
      <Button title="Vilnius" onPress={handleSelect} />
    </View>
  );
}

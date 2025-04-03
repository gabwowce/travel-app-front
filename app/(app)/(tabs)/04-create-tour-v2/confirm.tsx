import { useNavigation } from "@react-navigation/native";
import { useCreateTour } from "./context";
import { View, Button, Text } from "react-native";

export default function ConfirmTour() {
  const navigation = useNavigation();
  const { data, reset } = useCreateTour();

  const handleConfirm = () => {
    console.log("Siunčiam į API:", data);
    reset();
    navigation.navigate("home" as never);
  };

  const handleCancel = () => {
    reset();
    navigation.navigate("home" as never);
  };

  return (
    <View>
      <Text>Patvirtinimas</Text>
      <Text>{JSON.stringify(data, null, 2)}</Text>
      <Button title="Patvirtinti" onPress={handleConfirm} />
      <Button title="Atšaukti" onPress={handleCancel} />
    </View>
  );
}

import { CreateTourProvider } from "./context";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <CreateTourProvider>{children}</CreateTourProvider>;
}

// index.tsx (1 žingsnis: šalis)
import { useRouter } from "expo-router";
import { useCreateTour } from "./context";
import { View, Button, Text } from "react-native";

export default function SelectCountry() {
  const router = useRouter();
  const { setData } = useCreateTour();

  const handleSelect = () => {
    setData({ country: "Lithuania" });
    router.push("city");
  };

  return (
    <View>
      <Text>Pasirink šalis</Text>
      <Button title="Pasirink Lithuania" onPress={handleSelect} />
    </View>
  );
}

import { useEffect, useState } from "react";
import * as Location from "expo-location";
import { Alert } from "react-native";
import { LocationSubscription } from "expo-location";

export interface LocationData {
  latitude: number;
  longitude: number;
}

export default function useUserLocation() {
  const [userLocation, setUserLocation] = useState<LocationData | null>(null);

  useEffect(() => {
    let subscription: LocationSubscription | null = null;

    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Leidimas atmestas", "Be leidimo negalėsime parodyti jūsų vietos.");
          return;
        }

        subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Balanced, // arba High jei būtina
            timeInterval: 1000, // ms
            distanceInterval: 1, // metrais
          },
          (location) => {
            setUserLocation({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            });
          }
        );
      } catch (error) {
        console.error("Klaida gaunant lokaciją:", error);
        Alert.alert("Klaida", "Nepavyko gauti lokacijos. Įsitikinkite, kad GPS įjungtas.");
      }
    })();

    return () => {
      subscription?.remove();
    };
  }, []);

  return { userLocation };
}

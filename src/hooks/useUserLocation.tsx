import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { Alert } from 'react-native';

export interface LocationData {
  latitude: number;
  longitude: number;
}

export default function useUserLocation(defaultLocation: LocationData) {
  const [userLocation, setUserLocation] = useState<LocationData>(defaultLocation);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Leidimas atmestas', 'Be leidimo negalėsime parodyti jūsų vietos.');
          setLoading(false);
          return;
        }

        let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
        setUserLocation({ latitude: location.coords.latitude, longitude: location.coords.longitude });
      } catch (error) {
        console.error('Klaida gaunant lokaciją:', error);
        Alert.alert('Klaida', 'Nepavyko gauti lokacijos. Įsitikinkite, kad GPS įjungtas.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { userLocation, loading };
}

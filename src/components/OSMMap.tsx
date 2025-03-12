import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import { StatusBar as RNStatusBar } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BackButton from './btns/BackButton';
import { Text } from "native-base";
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

// Geo taškai
const points = [
  { id: '1', title: 'Gedimino pilis', coords: { latitude: 54.686855, longitude: 25.290715 } },
  { id: '2', title: 'Katedros aikštė', coords: { latitude: 54.68527, longitude: 25.287276 } },
  { id: '3', title: 'Cili pica', coords: { latitude: 54.6777239, longitude: 25.2553553 } },
];

const defaultLocation = { latitude: 54.687157, longitude: 25.279652 };

interface MapProps {
  title: string;
}

export default function GoogleMap({ title }: MapProps) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [userLocation, setUserLocation] = useState(defaultLocation);
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
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      } catch (error) {
        console.error('Klaida gaunant lokaciją:', error);
        Alert.alert('Klaida', 'Nepavyko gauti lokacijos. Įsitikinkite, kad GPS įjungtas.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#444" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ExpoStatusBar style="light" translucent backgroundColor="transparent" />
      <RNStatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <MapView
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined} // Google Maps tik Android
        userInterfaceStyle = "light"
        style={styles.map}
        initialRegion={{
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation
        showsCompass
      >
        {points.map((point) => (
          <Marker key={point.id} coordinate={point.coords} title={point.title} />
        ))}
      </MapView>

      <View style={styles.overlay}>
        <LinearGradient colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0.0)']} style={styles.gradient} />
        <BackButton onPress={() => navigation.goBack()} />
        <Text variant="header2Bold" style={styles.title}>{title}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight || 20,
  },
  gradient: { position: 'absolute', top: 0, left: 0, right: 0, height: 100 },
  title: { marginTop: 10 },
  map: { flex: 1 },
});

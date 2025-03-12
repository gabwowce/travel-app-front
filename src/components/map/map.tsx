import React from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Platform,
  StatusBar,
  Linking,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import { StatusBar as RNStatusBar } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "native-base";
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import useUserLocation from '@/src/hooks/useUserLocation';
import Header from "../Header";
import TourBottomSheet from "../TourBottomSheet";
import LoadingScreen from '@/src/components/screens/loading';

export interface TourPoint {
  id: string;
  title: string;
  coords: {
    latitude: number;
    longitude: number;
  };
  url: string;
}

interface MapProps {
  title: string;
  points: TourPoint[];
}

const defaultLocation = { latitude: 54.687157, longitude: 25.279652 };

const places = [
  { id: "1", name: "Čili Pizza", distance: "200 m" },
  { id: "2", name: "Čili Pizza", distance: "300 m" },
  { id: "3", name: "Čili Pizza", distance: "500 m" },
];

export default function Map({ title, points }: MapProps) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { userLocation, loading } = useUserLocation(defaultLocation);

  if (loading) {
    return (
      // <View style={styles.loadingContainer}>
      //   <ActivityIndicator size="large" color="#444" />
      // </View>
      <LoadingScreen/>
    );
  }

  return (
    <View style={styles.container}>
      <ExpoStatusBar style="dark" translucent backgroundColor="transparent" />
      <RNStatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
  
      <View style={styles.headerContainer}>
        <Header title={title} onBackPress={() => navigation.goBack()} />
      </View>
  
      {/* Žemėlapis */}
      <MapView
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        userInterfaceStyle="light"
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
          <Marker key={point.id} coordinate={point.coords} title={point.title}>
            <Callout onPress={() => Linking.openURL(point.url)}>
              <View style={styles.callout}>
                <Text style={styles.calloutTitle}>{point.title}</Text>
                <Text style={styles.calloutLink}>Spausti čia</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
  
      <TourBottomSheet />
    </View>
  );
  
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10, // Užtikrina, kad headeris būtų viršuje
  },
  map: {
    flex: 1,
    marginTop: 100, // Padarome, kad žemėlapis nebūtų uždengtas
  },
  callout: {
    width: 150,
    padding: 5,
    alignItems: 'center',
  },
  calloutTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  calloutLink: {
    fontSize: 12,
    color: 'blue',
    textDecorationLine: 'underline',
  },
  bottomSheetContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 20, // Užtikrina, kad Bottom Sheet būtų viršuje
  },
});

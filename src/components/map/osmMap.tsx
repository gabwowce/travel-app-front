import { useNavigation } from "@react-navigation/native"; // Import useNavigation
import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import { Text } from "native-base";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  StatusBar as RNStatusBar,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import BackButton from "./btns/BackButton";

// Sample geo points
const points = [
  {
    id: "1",
    title: "Gedimino pilis",
    coords: { latitude: 54.686855, longitude: 25.290715 },
    url: "https://lt.wikipedia.org/wiki/Gedimino_pilis",
  },
  {
    id: "2",
    title: "Katedros aikštė",
    coords: { latitude: 54.68527, longitude: 25.287276 },
    url: "https://lt.wikipedia.org/wiki/Katedros_aikštė",
  },
  {
    id: "3",
    title: "Cili pica",
    coords: { latitude: 54.6777239, longitude: 25.2553553 },
    url: "https://www.cili.lt/",
  },
];

const defaultLocation = { latitude: 54.687157, longitude: 25.279652 };

interface OSMMapProps {
  title: string;
}

export default function OSMMap({ title }: OSMMapProps) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation(); // Access navigation
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(defaultLocation);
  const [loading, setLoading] = useState(true);
  const [webViewUrl, setWebViewUrl] = useState<string | null>(null);
  const webViewRef = useRef<WebView>(null);
  const [webViewLoading, setWebViewLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Leidimas atmestas",
            "Be leidimo negalėsime parodyti jūsų vietos."
          );
          setLoading(false);
          return;
        }

        let location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High, // Naudoti aukštą tikslumą
        });

        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      } catch (error) {
        console.error("Klaida gaunant lokaciją:", error);
        Alert.alert(
          "Klaida",
          "Nepavyko gauti lokacijos. Įsitikinkite, kad GPS įjungtas."
        );
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

  const handleMessage = (event: any) => {
    const url = event.nativeEvent.data;
    if (url) {
      setWebViewUrl(url); // Perjungiame rodinį į WebView su svetaine
    }
  };

  // Generate the HTML with Leaflet map and markers
  const generateMapHtml = () => {
    const markersJS = points
      .map(
        (point) =>
          `L.marker([${point.coords.latitude}, ${point.coords.longitude}]).addTo(map)
            .bindPopup("<b>${point.title}</b>");`
      )
      .join("\n");

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>OpenStreetMap with Markers</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
        <style>
          html, body { height: 100%; margin: 0; padding: 0; }
          #map { height: 100vh; width: 100%; }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
        <script>
          var map = L.map('map', { zoomControl: false }).setView([${userLocation?.latitude || 54.687157}, ${userLocation?.longitude || 25.279652}], 14);
        
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
          }).addTo(map);
          
          // Vartotojo vieta
          if (${userLocation?.latitude} && ${userLocation?.longitude}) {
            var userIcon = L.icon({
              iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
              iconSize: [40, 40],
              iconAnchor: [20, 40],
              popupAnchor: [0, -40]
            });
  
            L.marker([${userLocation?.latitude}, ${userLocation?.longitude}], { icon: userIcon })
              .addTo(map)
              .bindPopup("Jūsų vieta").openPopup();
          }
  
          ${markersJS}
        </script>
      </body>
      </html>
    `;
  };

  return (
    <View style={styles.container}>
      {Platform.OS === "ios" ? (
        <>
          <ExpoStatusBar style={webViewUrl ? "dark" : "light"} translucent />
          <RNStatusBar
            barStyle={webViewUrl ? "dark-content" : "light-content"}
            translucent
          />
          {webViewUrl ? (
            <>
              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: userLocation?.latitude || defaultLocation.latitude,
                  longitude:
                    userLocation?.longitude || defaultLocation.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
                mapType="mutedStandard" // Standartinis Apple Maps stilius
                // Nustato šviesų režimą (tik iOS)
                showsUserLocation
                showsCompass
              >
                {points.map((point) => (
                  <Marker
                    key={point.id}
                    coordinate={point.coords}
                    title={point.title}
                  />
                ))}
              </MapView>
              {!webViewLoading && (
                <BackButton
                  label="Grįžti į žemėlapį"
                  onPress={() => setWebViewUrl(null)}
                />
              )}
            </>
          ) : (
            <>
              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: userLocation?.latitude || defaultLocation.latitude,
                  longitude:
                    userLocation?.longitude || defaultLocation.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
                showsUserLocation
                showsCompass
              >
                {points.map((point) => (
                  <Marker
                    key={point.id}
                    coordinate={point.coords}
                    title={point.title}
                  />
                ))}
              </MapView>
              <View style={styles.overlay}>
                <LinearGradient
                  colors={["rgba(0,0,0,0.8)", "rgba(0,0,0,0.0)"]}
                  style={styles.gradient}
                />
                <BackButton onPress={() => navigation.goBack()} />
                <Text variant="header2Bold" style={styles.title}>
                  {title}
                </Text>
              </View>
            </>
          )}
        </>
      ) : (
        <>
          <ExpoStatusBar style={webViewUrl ? "dark" : "light"} translucent />
          <RNStatusBar
            barStyle={webViewUrl ? "dark-content" : "light-content"}
            translucent
          />
          {webViewUrl ? (
            <>
              <WebView
                source={{ uri: webViewUrl }}
                style={[styles.fullWebView, { marginTop: insets.top + 60 }]}
                ref={webViewRef}
                startInLoadingState={true}
                onLoadStart={() => setWebViewLoading(true)}
                onLoad={() => setWebViewLoading(false)}
                renderLoading={() => (
                  <ActivityIndicator
                    size="large"
                    color="#444"
                    style={{ flex: 1 }}
                  />
                )}
              />
              {!webViewLoading && (
                <BackButton
                  label="Grįžti į žemėlapį"
                  onPress={() => setWebViewUrl(null)}
                />
              )}
            </>
          ) : (
            <>
              <WebView
                originWhitelist={["*"]}
                source={{ html: generateMapHtml() }}
                style={styles.fullWebView}
                onMessage={handleMessage}
                startInLoadingState={true}
                renderLoading={() => (
                  <ActivityIndicator
                    size="large"
                    color="#444"
                    style={{ flex: 1 }}
                  />
                )}
              />
              <View style={styles.overlay}>
                <LinearGradient
                  colors={["rgba(0,0,0,0.8)", "rgba(0,0,0,0.0)"]}
                  style={styles.gradient}
                />
                <BackButton onPress={() => navigation.goBack()} />
                <Text variant="header2Bold" style={styles.title}>
                  {title}
                </Text>
              </View>
            </>
          )}
        </>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  fullWebView: {
    ...StyleSheet.absoluteFillObject, // Žemėlapis per visą ekraną
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingTop: Platform.OS === "ios" ? 50 : StatusBar.currentHeight || 20,
  },
  gradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 100, // Aukštis gradientui
  },
  backButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : StatusBar.currentHeight || 20,
    left: 20,
    backgroundColor: "#F7F7F9",
    padding: 10,
    borderRadius: 25,
  },
  title: {
    marginTop: 10,
  },
  map: {
    flex: 1, // Priverčia MapView užimti visą ekraną
  },
});

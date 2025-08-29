// Map.tsx
import useAnnounceForAccessibility from "@/src/hooks/useAnnounceForAccessibility";
import useUserLocation from "@/src/hooks/useUserLocation";
import { TourPoint } from "@/src/types/tourPoint";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  Platform,
  StatusBar as RNStatusBar,
  StyleSheet,
  View,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Header from "../Header";
import TourBottomSheet from "../tour/TourBottomSheet";
import { getMarkerIcon } from "../tour/getMarkerIconByCategory";

interface MapProps {
  title: string;
  points: TourPoint[];
}

// export interface TourPoint {
//   id: string;
//   title: string;
//   coords: {
//     latitude: number;
//     longitude: number;
//   };
//   url: string;
//   address: string;
//   category?: "museum" | "nature" | "food";
//   description: string;
// }

export default function Map({ title, points }: MapProps) {
  useAnnounceForAccessibility(`Map screen opened. Showing route: ${title}`);
  const bottomSheetRef = useRef<any>(null);
  const navigation = useNavigation();
  const mapRef = useRef<MapView>(null);
  const [selectedPoint, setSelectedPoint] = useState<TourPoint | null>(null);
  const { userLocation } = useUserLocation();
  const [showMainHeader, setShowMainHeader] = useState(true);
  const [sheetState, setSheetState] = useState<"list" | "details" | "full">(
    "list"
  );
  const insets = useSafeAreaInsets();

  const handleSelectPoint = (point: TourPoint) => {
    setSelectedPoint(point);
    // useAnnounceForAccessibility(
    //   `Selected: ${point.title}. ${point.description}`
    // );
    mapRef.current?.animateToRegion(
      {
        latitude: point.coords.latitude - 0.001,
        longitude: point.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      },
      1000
    );
    bottomSheetRef.current?.snapToIndex(0);
  };

  const handleBackToList = () => {
    setSelectedPoint(null);
    bottomSheetRef.current?.snapToIndex(1);
  };

  useEffect(() => {
    if (points.length > 0 && mapRef.current) {
      const timeout = setTimeout(() => {
        mapRef.current?.fitToCoordinates(
          points.map((p) => p.coords),
          {
            edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
            animated: true,
          }
        );
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [points]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: `${title}`,
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ExpoStatusBar style="dark" translucent />
      <RNStatusBar barStyle="dark-content" translucent />
      {showMainHeader && (
        <View style={styles.headerContainer}>
          <Header
            title={title}
            onBackPress={
              selectedPoint ? handleBackToList : () => navigation.goBack()
            }
            onPressClose={selectedPoint ? () => navigation.goBack() : undefined}
          />
        </View>
      )}
      <MapView
        provider={Platform.OS === "android" ? PROVIDER_GOOGLE : undefined}
        userInterfaceStyle="light"
        ref={mapRef}
        style={styles.map}
        showsUserLocation
        showsCompass
        accessible={false}
        importantForAccessibility="no"
      >
        {points.map((point) => {
          const { name, color } = getMarkerIcon(point.category);
          const isSelected = selectedPoint?.id === point.id;

          return (
            <Marker
              key={point.id}
              coordinate={point.coords}
              anchor={{ x: 0.5, y: 1 }} // <- rodo į markerio apačią (taip kaip Waze)
              onPress={() => handleSelectPoint(point)}
              accessibilityLabel={`Point of interest: ${point.title}, category: ${point.category ?? "location"}`}
            >
              <View
                style={[
                  styles.customMarker,
                  isSelected && styles.customMarkerSelected,
                  isSelected && styles.customMarkerLarge, // ← pridedam padidinimą!
                ]}
              >
                <Ionicons
                  name={name as any}
                  size={isSelected ? 32 : 28}
                  color={isSelected ? "#000" : color}
                />
              </View>
            </Marker>
          );
        })}
      </MapView>

      <TourBottomSheet
        onFullScreenChange={(isFull) => setShowMainHeader(!isFull)}
        ref={bottomSheetRef}
        points={points}
        userLocation={userLocation}
        selectedPoint={selectedPoint}
        onSelectPoint={handleSelectPoint}
        onBack={handleBackToList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  customMarker: {
    width: 36, // arba 44, priklausomai nuo ikonėlės
    height: 36,
    backgroundColor: "#fff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
    alignItems: "center",
    justifyContent: "center",
    overflow: "visible", // ← svarbu Android'e!
  },
  customMarkerLarge: {
    width: 36,
    height: 36,
    borderRadius: 20, // kad ir didesnis išliktų apskritas
  },
  container: { flex: 1, backgroundColor: "#fff" },
  headerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  map: {
    flex: 1,
    paddingTop: 20,
  },

  customMarkerSelected: {
    backgroundColor: "#D1E8FF",
    borderColor: "#1E90FF",
  },
});

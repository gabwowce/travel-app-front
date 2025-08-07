// TourBottomSheet.tsx
import React, {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  useEffect,
  useLayoutEffect,
} from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Linking,
  TouchableOpacity,
  Platform,
} from "react-native";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import TourPointItem from "./TourPointItem";
import Header from "../Header";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import SelectedTourPointDetails from "./SelectedTourPointDetails";
import useAnnounceForAccessibility from "@/src/hooks/useAnnounceForAccessibility";
import { TourPoint } from "@/src/types/tourPoint";
import { useNavigation } from "expo-router";

interface Props {
  points: TourPoint[];
  userLocation: { latitude: number; longitude: number } | null;
  selectedPoint: TourPoint | null;
  onSelectPoint: (point: TourPoint) => void;
  onBack: () => void;
  onFullScreenChange?: (isFull: boolean) => void;
}

const TourBottomSheet = forwardRef<BottomSheet, Props>(
  (
    {
      points,
      userLocation,
      selectedPoint,
      onSelectPoint,
      onBack,
      onFullScreenChange,
    },
    ref
  ) => {
    const localRef = useRef<BottomSheet>(null);
    const insets = useSafeAreaInsets();
    const fullHeight = Dimensions.get("screen").height + insets.top;
    const snapPoints = useMemo(() => ["28%", "50%", "100%"], []);
    const navigation = useNavigation();

    const [index, setIndex] = useState(1);
    const isFullScreen = index === 2;

    // useEffect(() => {
    //   if (selectedPoint) {
    //     useAnnounceForAccessibility(`Selected: ${selectedPoint.title}`);
    //   }
    // }, [selectedPoint]);

    useImperativeHandle(ref, () => localRef.current as BottomSheet);
    useLayoutEffect(() => {
      navigation.setOptions({
        headerShown: false,
      });
    }, []);

    // useEffect(() => {
    //   onFullScreenChange?.(isFullScreen);
    // }, [isFullScreen, index]);

    const renderScrollView = () => {
      if (!selectedPoint && userLocation) {
        return (
          <BottomSheetScrollView
            contentContainerStyle={styles.contentContainer}
            scrollEnabled={true}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {points.map((point) => (
              <TourPointItem
                key={point.id}
                point={point}
                userLocation={userLocation}
                onSelect={(p) => {
                  onSelectPoint(p);
                  localRef.current?.snapToIndex(0);
                }}
              />
            ))}
          </BottomSheetScrollView>
        );
      }

      if (selectedPoint) {
        return (
          <BottomSheetScrollView
            contentContainerStyle={styles.contentContainer}
            scrollEnabled={true}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <SelectedTourPointDetails
              point={selectedPoint}
              userLocation={userLocation}
            />
          </BottomSheetScrollView>
        );
      }
      return null;
    };

    return (
      <BottomSheet
        accessibilityViewIsModal={true}
        ref={localRef}
        index={1}
        snapPoints={snapPoints}
        enablePanDownToClose={false}
        topInset={0}
        enableContentPanningGesture={true}
        handleStyle={isFullScreen ? styles.hiddenHandle : styles.handleStyle}
        handleIndicatorStyle={
          isFullScreen ? styles.hiddenHandle : styles.handleIndicatorStyle
        }
        onChange={(i) => {
          onFullScreenChange?.(i === 2);
        }}
        backgroundStyle={
          isFullScreen ? styles.fullscreenBackground : styles.screenBackground
        }
        enableDynamicSizing={false}
      >
        {selectedPoint
          ? isFullScreen && (
              <Header
                title={`About`}
                onBackPress={() => localRef.current?.snapToIndex(1)}
                onPressClose={onBack}
                // disableSafeArea
              />
            )
          : isFullScreen && (
              <Header
                title="Geo Points"
                onBackPress={() => {
                  if (isFullScreen) {
                    localRef.current?.snapToIndex(1);
                  } else {
                    onBack();
                  }
                }}
                onPressClose={onBack}
                // disableSafeArea
              />
            )}

        {renderScrollView()}
      </BottomSheet>
    );
  }
);

export default TourBottomSheet;

const styles = StyleSheet.create({
  contentContainer: {
    padding: 16,
    paddingBottom: 48,
    gap: 12,
    flexGrow: 1,
    paddingTop: 16,
  },
  handleStyle: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  handleIndicatorStyle: {
    backgroundColor: "#aaa",
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 8,
  },
  hiddenHandle: {
    display: "none",
  },
  fullscreenBackground: {
    backgroundColor: "#FFFCF9",
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  screenBackground: {
    backgroundColor: "#FFFCF9",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  detailLink: {
    fontSize: 14,
    color: "#1E90FF",
    textDecorationLine: "underline",
  },
  detailHint: {
    marginTop: 8,
    fontSize: 12,
    color: "#888",
  },
  selectedContainer: {
    paddingTop: 16,
    paddingHorizontal: 16,
  },
});

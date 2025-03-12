import React, { useRef, useMemo } from "react";
import { Text, StyleSheet } from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";

const TourBottomSheet = () => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["25%", "50%", "90%"], []);

  return (
    <BottomSheet ref={bottomSheetRef} index={1} snapPoints={snapPoints}>
      <BottomSheetView style={styles.contentContainer}>
        <Text>Labas! Čia yra Bottom Sheet turinys 🎉</Text>
      </BottomSheetView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default TourBottomSheet;

import React from "react";
import { View, StyleSheet } from "react-native";
import { createSelector } from "@reduxjs/toolkit";
import { useAppSelector } from "@/src/data/hooks";
import LoadingScreen from "@/src/components/screens/loading";

// Memoizuotas selector – lengvai pridėsi naujų slice'ų
const selectGlobalBusy = createSelector(
  (st: any) => st.auth.loading,
  (st: any) => st.categories?.loading,
  (st: any) => st.routes?.loading,
  (st: any) => st.places?.loading,
  (auth, cat, routes, places) => auth || cat || routes || places
);

export default function BusyOverlay() {
  const busy = useAppSelector(selectGlobalBusy);
  if (!busy) return null;

  return (
    <View style={styles.overlay} pointerEvents="box-none">
      <LoadingScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.6)",
  },
});

import { useFocusEffect } from "@react-navigation/native";
import { useRouter, useSegments } from "expo-router";
import { useAppDispatch } from "@/src/data/hooks";
import { resetTour } from "@/src/data/features/tours/tourSlice";
import { useCallback, useEffect } from "react";

export function useResetTour() {
  const router = useRouter();
  const segments = useSegments();
  const dispatch = useAppDispatch();

  useEffect(() => {
    console.log("Current segment:", segments[0]); // ✅ Pamatysime, koks segmentas aktyvus
    if (segments[0] !== "create-tour") {
      console.log("Resetting Redux state...");
      dispatch(resetTour()); // ✅ Ar šis kodas kviečiamas per anksti?
    }
  }, [segments, dispatch]);
  

  useFocusEffect(
    useCallback(() => {
      return () => {
        // 🔹 Tikriname ar pirmas navigacijos segmentas yra "create-tour"
        const isLeavingTourCreation = segments[0] !== "create-tour";

        if (isLeavingTourCreation) {
          dispatch(resetTour()); // ✅ Išvalome turo kūrimo progresą
        }
      };
    }, [segments, dispatch])
  );
}

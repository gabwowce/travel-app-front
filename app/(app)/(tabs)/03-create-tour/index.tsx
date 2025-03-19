import React, { useEffect } from "react";
import { useRouter } from "expo-router";
import { useAppDispatch, useAppSelector } from "@/src/data/hooks";
import { fetchCountries } from "@/src/data/features/countries/countriesSlice";
import { setTourData, resetTour } from "@/src/data/features/tours/tourSlice";
import SelectableListScreen from "@/src/components/SelectableListScreen";

export default function SelectCountryScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const countries = useAppSelector((state) => state.countries.countries);
  const loading = useAppSelector((state) => state.countries.loading);
  const error = useAppSelector((state) => state.countries.error);
  const { country, country_id } = useAppSelector((state) => state.tour);

  useEffect(() => {
    dispatch(resetTour());
    dispatch(fetchCountries());
  }, [dispatch]);

  return (
    <SelectableListScreen
      title="Select a Country"
      data={countries}
      selectedItem={country}
      setSelectedItem={(item) => {
        dispatch(setTourData({ country: item.name, country_id: item.id, city: null, city_id: null }));
      }}
      loading={loading}
      error={error}
      onBackPress={() => router.back()}
      onNextPress={() => router.push("/(app)/(tabs)/03-create-tour/city")}
    />
  );
}

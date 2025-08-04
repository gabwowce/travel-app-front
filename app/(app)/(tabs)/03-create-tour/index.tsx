import React, { useEffect } from "react";
import { useRouter } from "expo-router";
import { useAppDispatch, useAppSelector } from "@/src/data/hooks";
import { fetchCountries } from "@/src/data/features/countries/countriesSlice";
import { setTourData, resetTour } from "@/src/data/features/tours/tourSlice";
import SelectableListScreen from "@/src/components/SelectableListScreen";
import RoundedCountryFlag from "@/src/components/RoundedCountryFlag";
import {selectRoutesState, selectRoutesLoading, selectRoutesError} from "@/src/data/features/routes/routesSelectors";
import { selectCountries } from "@/src/data/features/countries/countriesSelectors";

export default function SelectCountryScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const countries = useAppSelector(selectCountries);
  const loading = useAppSelector(selectRoutesLoading);
  const error = useAppSelector(selectRoutesError);
  const { country, country_id } = useAppSelector((state) => state.tour);

  useEffect(() => {
    dispatch(resetTour());
    dispatch(fetchCountries());
  }, [dispatch]);
  

  return (
    <SelectableListScreen
      data={countries}
      selectedItem={country}
      setSelectedItem={(item) => {
        dispatch(setTourData({
          country: item.name,
          country_id: item.id,
          city: null,
          city_id: null,
          category: null,
          category_id: null
        }));
      }}
      loading={loading}
      error={error}
      onBackPress={() => router.back()}
      onNextPress={() => router.push("/(app)/(tabs)/03-create-tour/city")}
      renderIcon={(item) => (
        <RoundedCountryFlag isoCode={item.code} size={30} />
      )}
    />
  );
}

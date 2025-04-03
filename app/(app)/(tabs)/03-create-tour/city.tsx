import React, { useEffect } from "react";
import { useRouter } from "expo-router";
import { useAppDispatch, useAppSelector } from "@/src/data/hooks";
import { fetchCountryById } from "@/src/data/features/countries/countriesSlice";
import { setTourData } from "@/src/data/features/tours/tourSlice";
import SelectableListScreen from "@/src/components/SelectableListScreen";
import { selectSelectedCountry } from "@/src/data/features/countries/countriesSelectors";

export default function SelectCityScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { country, country_id, city, city_id } = useAppSelector((state) => state.tour);
  const loading = useAppSelector((state) => state.countries.loading);

  const selectedCountry = useAppSelector(selectSelectedCountry);

  useEffect(() => {
    if (!country_id) {
      router.replace("/(app)/(tabs)/03-create-tour");
      return;
    }

    if (!selectedCountry || selectedCountry.id !== country_id) {
      dispatch(fetchCountryById(country_id));
    }
  }, [dispatch, country_id, selectedCountry]);

  return (
    <SelectableListScreen
      title={`Select a City in ${country}`}
      data={selectedCountry?.cities || []}
      selectedItem={city}
      setSelectedItem={(item) =>
        dispatch(
          setTourData({
            city: item.name,
            city_id: item.id,
            category: null,
            category_id: null,
          })
        )
      }
      loading={loading}
      error={null}
      onBackPress={() => {
        dispatch(
          setTourData({
            country: null,
            country_id: null,
            city: null,
            city_id: null,
            category: null,
            category_id: null,
          })
        );
        router.back();
      }}
      onNextPress={() => router.push("/(app)/(tabs)/03-create-tour/category")}
    />
  );
}

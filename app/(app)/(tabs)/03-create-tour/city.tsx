import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useAppDispatch, useAppSelector } from "@/src/data/hooks";
import { fetchCountryById } from "@/src/data/features/countries/countriesSlice";
import {
  selectSelectedCountry,
  selectCountriesLoading,
  selectCountriesError,
} from "@/src/data/features/countries/countriesSelectors";
import SelectableList from "@/src/components/SelectableList";
import Header from "@/src/components/Header"; 
import ScreenContainer from "@/src/components/ScreenContainer";
import SearchBar from "@/src/components/SearchBar"; 
import { setTourData } from "@/src/data/features/tours/tourSlice";
import { Keyboard, TouchableWithoutFeedback } from "react-native";

export default function SelectCityScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  // 🔹 Vietoje `useLocalSearchParams` naudojame Redux
  const { country, country_id } = useAppSelector(state => state.tour);
  const selectedCountry = useAppSelector(selectSelectedCountry);
  const loading = useAppSelector(selectCountriesLoading);
  const error = useAppSelector(selectCountriesError);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (country_id && !selectedCountry) {
      dispatch(fetchCountryById(Number(country_id))); // ✅ Jei šalis neįkelta – užkrauname ją
    }
  }, [dispatch, country_id, selectedCountry]);

  // 🔍 Filtruojame miestus pagal įvestą tekstą
  const filteredCities = selectedCountry?.cities.filter((city) =>
    city.name.toLowerCase().startsWith(searchTerm.toLowerCase()) 
  ) || [];

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>

      <ScreenContainer variant="top">
      <Header 
        title={`Select a City in ${selectedCountry?.name ?? "Unknown Country"}`} 
        onBackPress={() => router.back()} 
      />


        <SearchBar 
          placeholder="Search city..." 
          value={searchTerm} 
          onChangeText={setSearchTerm} 
          onClear={() => setSearchTerm("")} 
        />

        <SelectableList
          title={""}
          data={filteredCities}
          loading={loading}
          error={error}
          getItemLabel={(item) => item.name}
          onSelect={(item) => {
            console.log("Selecting city:", item); // ✅ Patikriname, ar vartotojas tikrai pasirinko miestą
            dispatch(setTourData({ city: item.name, city_id: item.id }));
            console.log("Updated Redux state:", { city: item.name, city_id: item.id }); // ✅ Patikriname Redux
            router.push("/(app)/(tabs)/03-create-tour/category");
          }}
        />
      </ScreenContainer>
    </TouchableWithoutFeedback>
    
  );
}

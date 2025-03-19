import React, { useEffect, useState } from "react";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
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
import { VStack, HStack, Text, Box } from "native-base";

export default function SelectCityScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  const { country_id } = useAppSelector((state) => state.tour);
  const selectedCountry = useAppSelector(selectSelectedCountry);
  const loading = useAppSelector(selectCountriesLoading);
  const error = useAppSelector(selectCountriesError);
  const selectedCity = useAppSelector((state) => state.tour.city);
  const [searchTerm, setSearchTerm] = useState("");

  // 1. Jeigu neturime country_id, siųskime vartotoją atgal
  useEffect(() => {
    if (!country_id) {
      router.replace("/(app)/(tabs)/03-create-tour");
      return;
    }
  }, [country_id]);

  // 2. Užkrauname tinkamą šalį iš serverio, jei jos duomenų dar neturime
  //    arba dabartinis selectedCountry neatitinka naujo country_id.
  useEffect(() => {
    if (country_id && (!selectedCountry || selectedCountry.id !== country_id)) {
      dispatch(fetchCountryById(Number(country_id)));
    }
  }, [dispatch, country_id, selectedCountry]);

  // 3. Grįžtant atgal, išvalome ir city, ir country, kad vartotojas galėtų pasirinkti kitą šalį
  const handleBack = () => {
    dispatch(setTourData({ country: null, country_id: null, city: null, city_id: null }));
    router.back();
  };

  // Filtruojame miestus pagal įvestą tekstą
  const filteredCities = selectedCountry?.cities?.filter((city) =>
    city.name.toLowerCase().startsWith(searchTerm.toLowerCase())
  ) || [];

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <ScreenContainer variant="top">
        <Header
          title={`Select a City in ${selectedCountry?.name ?? "Unknown Country"}`}
          onBackPress={handleBack}
        />
        <SearchBar
          placeholder="Search city..."
          value={searchTerm}
          onChangeText={setSearchTerm}
          onClear={() => setSearchTerm("")}
        />
        <SelectableList
          title=""
          data={filteredCities}
          loading={loading}
          error={error}
          renderItem={(item) => (
            <HStack 
              alignItems="center" 
              space={3} 
              px={3} 
              py={2} 
              borderWidth={selectedCity === item.name ? 2 : 1}
              borderColor={selectedCity === item.name ? "#001F3F" : "#D1D5DB"} 
              borderRadius={10} 
              p={3}
            >
              <Text>{item.name}</Text>
            </HStack>
          )}
          onSelect={(item) => {
            dispatch(
              setTourData({
                city: item.name,
                city_id: item.id,
                category: null,
                category_id: null,
              })
            );
            router.push("/(app)/(tabs)/03-create-tour/category");
          }}
        />
      </ScreenContainer>
    </TouchableWithoutFeedback>
  );
}

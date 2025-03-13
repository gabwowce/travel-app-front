import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { VStack, HStack, Text, Box } from "native-base";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import { useAppDispatch, useAppSelector } from "@/src/data/hooks";
import { fetchCountries } from "@/src/data/features/countries/countriesSlice";
import {
  selectCountries,
  selectCountriesLoading,
  selectCountriesError,
} from "@/src/data/features/countries/countriesSelectors";
import SelectableList from "@/src/components/SelectableList";
import Header from "@/src/components/Header";
import ScreenContainer from "@/src/components/ScreenContainer"; 
import RoundedCountryFlag from "@/src/components/RoundedCountryFlag"; 
import SearchBar from "@/src/components/SearchBar"; 
import Button from "@/src/components/btns/Button";
import { Country } from "@/src/data/features/countries/countriesTypes"; // ✅ Aiškiai importuojame šalies tipą

export default function SelectCountryScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const countries = useAppSelector(selectCountries);
  const loading = useAppSelector(selectCountriesLoading);
  const error = useAppSelector(selectCountriesError);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null); // ✅ Aiškiai nustatome tipą

  useEffect(() => {
    dispatch(fetchCountries());
  }, [dispatch]);

  // 🔍 Filtruojame šalis pagal paiešką
  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().startsWith(searchTerm.toLowerCase())
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <ScreenContainer> 
        <Header title="Select a country" />

        {/* 🔍 Paieškos laukelis */}
        <Box px={5}>
          <SearchBar 
            placeholder="Search country..." 
            value={searchTerm} 
            onChangeText={setSearchTerm} 
            onClear={() => setSearchTerm("")} 
          />
        </Box>

        {/* ✅ Sąrašas su pasirenkamomis šalimis */}
        <SelectableList
          title=""
          data={filteredCountries} 
          loading={loading}
          error={error}
          renderItem={(item) => (
            <HStack alignItems="center" space={3} px={3} py={2} 
              borderWidth={selectedCountry?.id === item.id ? 2 : 1} // ✅ Paryškiname pasirinktą elementą
              borderColor={selectedCountry?.id === item.id ? "#001F3F" : "#D1D5DB"} 
              borderRadius={10} 
              p={3}
            >
              <RoundedCountryFlag isoCode={item.code} size={30} />
              <Text>{item.name}</Text>
            </HStack>
          )}
          onSelect={(item) => setSelectedCountry(item)} // ✅ Pasirenkame šalį, bet neperšokame į kitą žingsnį
        />

       {/* ✅ "Next" mygtukas atsiranda tik jei pasirinkta šalis */}
        {selectedCountry && (
          <Box px={5} pb={5} alignItems="center">
            <Button 
              label="Next"
              onPress={() => router.push({
                pathname: "/(app)/(tabs)/03-create-tour/city",
                params: { country: selectedCountry.name, country_id: selectedCountry.id },
              })}
              theme="primary"
            />
          </Box>
        )}

      </ScreenContainer>
    </TouchableWithoutFeedback>
  );
}

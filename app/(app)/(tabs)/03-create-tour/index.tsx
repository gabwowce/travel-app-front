import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { VStack, HStack, Text, Box } from "native-base";
import { Keyboard, TouchableWithoutFeedback, StyleSheet } from "react-native";
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
import { Country } from "@/src/data/features/countries/countriesTypes"; 
import { SafeAreaView } from "react-native"; 
import { useNavigation } from "expo-router";
import { setTourData } from "@/src/data/features/tours/tourSlice";

export default function SelectCountryScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  
  // 🔹 Imame pasirinktos šalies duomenis iš Redux
  const selectedCountry = useAppSelector((state) => state.tour.country);
  
  const countries = useAppSelector(selectCountries);
  const loading = useAppSelector(selectCountriesLoading);
  const error = useAppSelector(selectCountriesError);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchCountries());
  }, [dispatch]);

  useEffect(() => {
    navigation.getParent()?.setOptions({ tabBarStyle: { display: "none" } });

    return () => {
      navigation.getParent()?.setOptions({ tabBarStyle: { display: "flex" } });
    };
  }, [navigation]);

  // 🔍 Filtruojame šalis pagal paiešką
  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().startsWith(searchTerm.toLowerCase())
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <ScreenContainer variant="top">
        <Header title={`Select a Country`} onBackPress={() => router.back()} />

        <SearchBar 
          placeholder="Search country..." 
          value={searchTerm} 
          onChangeText={setSearchTerm} 
          onClear={() => setSearchTerm("")} 
        />
        
        <Box flex={1} pb={20}>
          <SelectableList
            title=""
            data={filteredCountries}
            loading={loading}
            error={error}
            renderItem={(item) => (
              <HStack 
                alignItems="center" 
                space={3} 
                px={3} 
                py={2} 
                borderWidth={selectedCountry === item.name ? 2 : 1}
                borderColor={selectedCountry === item.name ? "#001F3F" : "#D1D5DB"} 
                borderRadius={10} 
                p={3}
              >
                <RoundedCountryFlag isoCode={item.code} size={30} />
                <Text>{item.name}</Text>
              </HStack>
            )}
            onSelect={(item) => {
              console.log("Selecting country:", item); // ✅ Patikriname, ar funkcija iškviečiama
              dispatch(setTourData({ country: item.name, country_id: item.id }));
              console.log("Updated Redux state:", { country: item.name, country_id: item.id }); // ✅ Tikriname Redux atnaujinimą
              
            }}
            
          />
        </Box>

        {/* 🔹 Mygtukas rodomas tik jei pasirinkta šalis */}
        {selectedCountry && (
          <SafeAreaView style={styles.buttonContainer}>
            <Button 
              label="Next"
              onPress={() => router.push("/(app)/(tabs)/03-create-tour/city")}
              theme="primary"
            />
          </SafeAreaView>
        )}
      </ScreenContainer>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    position: "absolute",
    bottom: 150, // ✅ Mygtukas pakeliamas virš `tabBar`
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    backgroundColor: "white", // ✅ Užtikrina, kad mygtukas nesusilietų su fonu
    paddingVertical: 10,
  },
});

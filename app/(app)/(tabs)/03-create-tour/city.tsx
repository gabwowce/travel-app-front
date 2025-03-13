import React, { useEffect,useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
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
import { VStack, HStack, Text, Box } from "native-base";
import SearchBar from "@/src/components/SearchBar"; 

export default function SelectCityScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { country, country_id } = useLocalSearchParams();
  const selectedCountry = useAppSelector(selectSelectedCountry);
  const loading = useAppSelector(selectCountriesLoading);
  const error = useAppSelector(selectCountriesError);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredCities = selectedCountry?.cities.filter((city) =>
    city.name.toLowerCase().startsWith(searchTerm.toLowerCase()) 
  );


  useEffect(() => {
    if (country_id) {
      dispatch(fetchCountryById(Number(country_id)));
    }
  }, [dispatch, country_id]);

  return (
    <ScreenContainer>
      <Header title={`Select a City in ${country}`} onBackPress={() => router.back()} />
      <Box px={5}> 
          <SearchBar 
            placeholder="Search country..." 
            value={searchTerm} 
            onChangeText={setSearchTerm} 
            onClear={() => setSearchTerm("")} 
          />
        </Box>
      <SelectableList
        title={""}
        data={filteredCities || []}
        loading={loading}
        error={error}
        getItemLabel={(item) => item.name}
        onSelect={(item) =>
          router.push({
            pathname: "/(app)/(tabs)/03-create-tour/category",
            params: {
              country,
              country_id,
              city: item.name,
              city_id: item.id,
            },
          })
        }
      />
    </ScreenContainer>
  );
}

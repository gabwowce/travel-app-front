import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, TouchableWithoutFeedback, Keyboard } from "react-native";
import { useRouter } from "expo-router";
import { useAppSelector } from "@/src/data/hooks";
import { getFilteredRoutes } from "@/src/data/features/routes/routesAPI";
import { RouteQueryParams, Route } from "@/src/data/features/routes/routesTypes";
import MiniTourCard from "@/src/components/MiniTourCard";
import ScreenContainer from "@/src/components/ScreenContainer"; 
import Header from "@/src/components/Header";
import { Box } from "native-base";
import SearchBar from "@/src/components/SearchBar"; 

export default function SelectTourScreen() {
  const router = useRouter();
  const [tours, setTours] = useState<Route[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // 🔹 Gauname vartotojo pasirinkimus iš Redux Store
  const { country_id, city_id, category_id } = useAppSelector(state => state.tour);

  useEffect(() => {
    console.log("Redux State:", { country_id, city_id, category_id }); // ✅ Patikrinkime reikšmes
  
    if (!country_id || !city_id || !category_id) {
      console.log("Missing parameters, skipping fetch...");
      return;
    }
  
    async function fetchTours() {
      try {
        setLoading(true);
        const params: RouteQueryParams = {
          country_id: country_id ?? undefined,
          city_id: city_id ?? undefined,
          category_id: category_id ?? undefined,
        };
  
        console.log("Fetching routes with params:", params); // ✅ Patikriname API užklausą
        const response = await getFilteredRoutes(params);
        setTours(response.data);
      } catch (error) {
        setError("Failed to load tours");
      } finally {
        setLoading(false);
      }
    }
  
    fetchTours();
  }, [country_id, city_id, category_id]);
  
  

  // ✅ Filtruojame turus pagal įvestą paiešką
  const filteredTours = tours.filter((tour) =>
    tour.name.toLowerCase().startsWith(searchTerm.toLowerCase())
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>

      <ScreenContainer variant="top">
        <Header title="Available Tours Based on Your Selection" onBackPress={() => router.back()} />
        
        <Box px={5}>
          <SearchBar 
            placeholder="Search tour..." 
            value={searchTerm} 
            onChangeText={setSearchTerm} 
            onClear={() => setSearchTerm("")} 
          />
        </Box>

        <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10, marginTop: 20 }}>
          Tours
        </Text>

        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : error ? (
          <Text style={{ color: "red", fontSize: 16 }}>{error}</Text>
        ) : filteredTours.length === 0 ? (
          <Text style={{ textAlign: "center", fontSize: 18, color: "gray", marginTop: 20 }}>
            No tours found.
          </Text>
        ) : (
          <FlatList
            data={filteredTours}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: "space-between" }}
            renderItem={({ item }) => <MiniTourCard tour={item} />}
          />
        )}
      </ScreenContainer>
    </TouchableWithoutFeedback>
    
  );
}

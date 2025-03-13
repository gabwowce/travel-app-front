import React, { useEffect, useState } from "react";
import { Box, Text, FlatList, Spinner } from "native-base";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import { useAppDispatch, useAppSelector } from "@/src/data/hooks";
import { fetchRoutes } from "@/src/data/features/routes/routesSlice";
import { selectRoutes } from "@/src/data/features/routes/routesSelectors";
import MiniTourCard from "@/src/components/MiniTourCard"; 
import SearchBar from "@/src/components/SearchBar"; // ✅ Naudojame naują komponentą

export default function SearchScreen() {
  const dispatch = useAppDispatch();
  const routes = useAppSelector(selectRoutes);
  const loading = useAppSelector((state) => state.routes.loading);
  const error = useAppSelector((state) => state.routes.error);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (searchTerm.length < 3) {
      dispatch({ type: "routes/clearRoutes" });
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      dispatch(fetchRoutes({ search: searchTerm }));
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, dispatch]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}> 
      <Box flex={1} bg="white" px={5} pt={10}>
        <Text fontSize="xl" fontWeight="bold" mb={4}>Search</Text>

        <SearchBar 
          placeholder="Search Tours"
          value={searchTerm}
          onChangeText={setSearchTerm}
          onClear={() => setSearchTerm("")} // ✅ Išvalo paiešką
        />

        {searchTerm.length < 3 ? (
          <Text color="gray.400" textAlign="center" mt={5}>
            Type to search...
          </Text>
        ) : loading ? (
          <Box alignItems="center" py="20px">
            <Spinner size="lg" color="primary.500" />
          </Box>
        ) : routes.length === 0 ? (
          <Text color="gray.500" textAlign="center" mt={5}>
            No results found.
          </Text>
        ) : (
          <FlatList
            data={routes}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: "space-between" }}
            renderItem={({ item }) => <MiniTourCard tour={item} />}
          />
        )}
      </Box>
    </TouchableWithoutFeedback>
  );
}

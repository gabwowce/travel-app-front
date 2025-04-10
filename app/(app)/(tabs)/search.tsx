import React, { useEffect, useState } from "react";
import { Box, Text, FlatList, Spinner } from "native-base";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import { useAppDispatch, useAppSelector } from "@/src/data/hooks";
import { fetchRoutes } from "@/src/data/features/routes/routesSlice";
import MiniTourCard from "@/src/components/MiniTourCard";
import SearchBar from "@/src/components/SearchBar"; // ✅ Naudojame naują komponentą
import Header from "@/src/components/Header";
import ScreenContainer from "@/src/components/ScreenContainer";

export default function SearchScreen() {
  const dispatch = useAppDispatch();
  const { loading, error, routes, isEmptyResults } = useAppSelector((state) => state.routes);

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
      <ScreenContainer variant="top">
        <Header title="Search" />
        <SearchBar
          placeholder="Search Tours"
          value={searchTerm}
          onChangeText={setSearchTerm}
          onClear={() => setSearchTerm("")}
        />
        {searchTerm.length < 3 ? (
          <Text color="gray.400" textAlign="center" mt={5}>
            Type to search...
          </Text>
        ) : loading ? (
          <Box alignItems="center" py="20px">
            <Spinner size="lg" color="primary.500" />
          </Box>
        ) : isEmptyResults ? (
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
      </ScreenContainer>
    </TouchableWithoutFeedback>
  );

}

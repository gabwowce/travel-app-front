import React, { useEffect, useState } from "react";
import { Box, Text, Input, FlatList, Pressable, HStack, VStack, Image, Spinner } from "native-base";
import { useAppDispatch, useAppSelector } from "@/src/data/hooks";
import { fetchRoutes, selectRoutes } from "@/src/data/features/routes/routesSlice";
import { Route } from "@/src/data/features/routes/routesTypes";

export default function SearchScreen() {
  const dispatch = useAppDispatch();
  const routes = useAppSelector(selectRoutes);
  const loading = useAppSelector((state) => state.routes.loading);
  const error = useAppSelector((state) => state.routes.error);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchRoutes({})); // Gaunam visus turus (routes)
  }, [dispatch]);

  // Filtruojame turus pagal pavadinimą arba miesto pavadinimą
  const filteredRoutes = routes.filter(
    (route: Route) =>
      route.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.city.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box flex={1} bg="white" px={5} pt={10}>
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        Search
      </Text>

      <Input
        placeholder="Search Tours"
        variant="filled"
        bg="gray.100"
        borderRadius="10"
        py="2"
        px="4"
        fontSize="16"
        onChangeText={setSearchTerm}
        value={searchTerm}
      />

      <Text fontSize="lg" fontWeight="bold" mt={6} mb={4}>
        Search Tours
      </Text>

      {loading ? (
        <Box alignItems="center" py="20px">
          <Spinner size="lg" color="primary.500" />
        </Box>
      ) : error ? (
        <Text color="red.500" px="35px">Failed to load tours. Please try again.</Text>
      ) : (
        <FlatList
          data={filteredRoutes}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          renderItem={({ item }) => (
            <Pressable>
              <Box
                bg="white"
                borderRadius="10"
                shadow={2}
                width="48%"
                mb={4}
                p={3}
              >
                <Image
                  source={{ uri: `http://127.0.0.1:8000${item.media[0]?.url || ""}` }}
                  alt={item.name}
                  width="100%"
                  height={120}
                  borderRadius="10"
                  mb={2}
                />
                <VStack>
                  <Text fontSize="md" fontWeight="bold">
                    {item.name}
                  </Text>
                  <HStack alignItems="center">
                    <Text fontSize="sm" color="gray.500">
                      {item.city.name}, {item.city.country.name}
                    </Text>
                  </HStack>
                </VStack>
              </Box>
            </Pressable>
          )}
        />
      )}
    </Box>
  );
}

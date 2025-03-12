import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { apiRequest } from "@/src/data/apiService";

export default function SelectTourScreen() {
  const { country, city, category } = useLocalSearchParams();
  const [tours, setTours] = useState<any[]>([]);

  useEffect(() => {
    async function fetchTours() {
      try {
        const response = await apiRequest(`/api/v1/tours?country=${country}&city=${city}&category=${category}`, "GET");
        setTours(response.data.items);
      } catch (error) {
        console.error("❌ Failed to fetch tours:", error);
      }
    }
    fetchTours();
  }, [country, city, category]);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>Available Tours in {city}</Text>
      <FlatList
        data={tours}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={{ padding: 15, borderBottomWidth: 1 }}>
            <Image source={{ uri: item.media[0]?.url }} style={{ width: 100, height: 100, borderRadius: 10 }} />
            <Text>{item.name}</Text>
            <Text>⭐ {item.rating?.average?.toFixed(1)}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

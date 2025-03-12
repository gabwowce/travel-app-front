import React from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

const citiesByCountry: Record<string, string[]> = {
  Estonia: ["Tallinn", "Tartu"],
  France: ["Paris", "Lyon"],
  Italy: ["Rome", "Milan"],
  Lithuania: ["Kaunas", "Vilnius"],
  Turkey: ["Istanbul", "Ankara"],
};

export default function SelectCityScreen() {
  const router = useRouter();
  const { country } = useLocalSearchParams(); // Gauname pasirinktą šalį

  const cities = citiesByCountry[country as string] || [];

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>Select a City in {country}</Text>
      <FlatList
        data={cities}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{ padding: 15, borderBottomWidth: 1 }}
            onPress={() =>
              router.push({
                pathname: "/(app)/(tabs)/(create-tour)/category", 
                params: { country, city: item }, 
              })
            }
          >
            <Text>{item}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

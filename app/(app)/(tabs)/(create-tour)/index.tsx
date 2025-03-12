import React from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

const countries = ["Estonia", "France", "Italy", "Lithuania", "Turkey"];

export default function SelectCountryScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>Select a Country</Text>
      <FlatList
        data={countries}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{ padding: 15, borderBottomWidth: 1 }}
            onPress={() =>
              router.push({
                pathname: "/(app)/(tabs)/(create-tour)/city", 
                params: { item }, 
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

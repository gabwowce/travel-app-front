import React from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

const categories = ["Entertainment", "History", "Nature"];

export default function SelectCategoryScreen() {
  const router = useRouter();
  const { country, city } = useLocalSearchParams();

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>What Type of Tour Are You Looking For?</Text>
      <FlatList
        data={categories}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{ padding: 15, borderBottomWidth: 1 }}
            onPress={() =>
              router.push({
                pathname: "/(app)/(tabs)/(create-tour)/tours", 
                params: { country, city, category: item },
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

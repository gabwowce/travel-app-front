import React from "react";
import { View, TextInput, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { VStack } from "native-base";

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  onClear?: () => void;
  onEndEditing?: () => void;
}

export default function SearchBar({
  placeholder,
  value,
  onChangeText,
  onClear,
  onEndEditing,
}: SearchBarProps) {
  return (
    <VStack mt={6} space={3}>
      <View style={styles.container}>
        {/* 🔍 Search ikona */}
        <Ionicons
          name="search-outline"
          size={20}
          color="gray"
          style={styles.iconLeft}
          accessibilityElementsHidden
          importantForAccessibility="no"
        />

        {/* 📝 Teksto įvedimo laukas */}
        <TextInput
          style={styles.input}
          placeholder={placeholder || "Search..."}
          value={value}
          onChangeText={onChangeText}
          placeholderTextColor="gray"
          onEndEditing={onEndEditing}
          accessible
          accessibilityLabel="Search input"
          accessibilityHint="Enter search keywords"
          returnKeyType="search"
        />

        {/* ❌ Išvalymo mygtukas */}
        {value.length > 0 && (
          <Pressable
            onPress={onClear}
            style={styles.clearButton}
            accessibilityRole="button"
            accessibilityLabel="Clear search"
          >
            <Ionicons name="close-circle" size={20} color="gray" />
          </Pressable>
        )}
      </View>
    </VStack>
  );
}


const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F3F3",
    borderRadius: 10,
    paddingHorizontal: wp("3%"),
    marginHorizontal: wp("3%"),
    marginBottom: 20,
    height: 50,

    alignSelf: "center",
  },
  
  iconLeft: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
  clearButton: {
    marginLeft: 8,
  },
});

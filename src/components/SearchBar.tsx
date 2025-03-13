import React from "react";
import { View, TextInput, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  onClear?: () => void;
}

export default function SearchBar({ placeholder, value, onChangeText, onClear }: SearchBarProps) {
  return (
    <View style={styles.container}>
      {/* 🔍 Search ikona */}
      <Ionicons name="search-outline" size={20} color="gray" style={styles.iconLeft} />

      {/* 📝 Teksto įvedimo laukas */}
      <TextInput
        style={styles.input}
        placeholder={placeholder || "Search..."}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor="gray"
      />

      {/* ❌ Išvalymo mygtukas */}
      {value.length > 0 && (
        <Pressable onPress={onClear} style={styles.clearButton}>
          <Ionicons name="close-circle" size={20} color="gray" />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F3F3",
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 50, // ✅ Fiksuotas aukštis, kad būtų vienoda išvaizda
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

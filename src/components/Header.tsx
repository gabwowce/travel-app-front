import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "native-base";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BackButton from "./btns/BackButton";

interface HeaderProps {
  title: string;
  onBackPress?: () => void;
}

export default function Header({ title, onBackPress }: HeaderProps) {
  const insets = useSafeAreaInsets(); // Gauti Safe Area kraštinių užpildymus

  return (
    <View style={[styles.headerContainer, { paddingTop: insets.top + 10 }]}>
      {/* ✅ Užtikriname, kad vietoj BackButton būtų tuščias blokas, jei jo nėra */}
      {onBackPress ? <BackButton onPress={onBackPress} /> : <View style={styles.backButtonPlaceholder} />}
      
      {/* ✅ Pavadinimas per vidurį */}
      <Text variant="header2Bold" style={styles.title}>{title}</Text>

      {/* ✅ Papildomas tuščias blokas dešinėje, kad išlaikytume simetriją */}
      <View style={styles.backButtonPlaceholder} />
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFCF9",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    height: 110, // ✅ Fiksuotas aukštis
  },
  title: {
    flex: 1, 
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  backButtonPlaceholder: {
    width: 40, 
  },
});

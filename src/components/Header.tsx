import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "native-base";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BackButton from "./btns/BackButton";

interface HeaderProps {
  title: string;
  onBackPress: () => void;
}

export default function Header({ title, onBackPress }: HeaderProps) {
  const insets = useSafeAreaInsets(); // Gauti Safe Area kraštinių užpildymus

  return (
    <View style={[styles.headerContainer, { paddingTop: insets.top + 10 }]}>
      <BackButton onPress={onBackPress} />
      <Text variant="header2Bold" style={[styles.title, { paddingTop: insets.top }]}>
        {title}
      </Text>
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
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },

  },
  title: {
    position: "absolute",
    left: 50, // Užtikrina, kad bus centre
    right: 50, // Užtikrina, kad bus centre
    textAlign: "center",
  },
});

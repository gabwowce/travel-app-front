import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "native-base";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import BackButton from "./btns/BackButton";

interface HeaderProps {
  title?: string;
  onBackPress?: () => void; // ✅ Custom funkcija grįžimui
  onPressClose?: () => void; // ✅ Custom funkcija uždarymui
  transparent?: boolean;
  rightIcon?: React.ReactNode;
}

export default function Header({ title, onBackPress, onPressClose, transparent = false, rightIcon }: HeaderProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View
      style={[
        styles.headerContainer,
        { 
          paddingTop: insets.top + 10, 
          backgroundColor: transparent ? "transparent" : "#FFFCF9",
        }
      ]}
    >
      <View style={styles.sideIconContainer}>
        {onBackPress ? <BackButton onPress={onBackPress} /> : <View style={styles.backButtonPlaceholder} />}
      </View>

      {title && <Text variant="header2Bold" style={styles.title}>{title}</Text>}

      <View style={styles.sideIconContainer}>
        {onPressClose ? (
          <TouchableOpacity onPress={onPressClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="black" />
          </TouchableOpacity>
        ) : rightIcon ? (
          rightIcon
        ) : (
          <View style={styles.backButtonPlaceholder} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    height: 120,
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
  sideIconContainer: {
    width: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  closeButton: {
    padding: 10,
  },
});

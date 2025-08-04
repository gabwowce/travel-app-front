import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "native-base";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import CircleButton from "./ui/btns/CircleButton";

interface HeaderProps {
  title?: string;
  onBackPress?: () => void; // ✅ Custom funkcija grįžimui
  onPressClose?: () => void; // ✅ Custom funkcija uždarymui
  transparent?: boolean;
  rightIcon?: React.ReactNode;
  disableSafeArea?:boolean;
}

export default function Header({ title, onBackPress, onPressClose, transparent = false, rightIcon, disableSafeArea = false }: HeaderProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View
      style={[
        styles.headerContainer,
        { 
          paddingTop: disableSafeArea ? 10 : insets.top + 10,

          paddingHorizontal: wp("3%"),
          backgroundColor: transparent ? "transparent" : "#FFFCF9",
          ...(transparent
            ? {} // jei transparent – nieko papildomai
            : {
                borderWidth: 1,
                borderColor: "rgba(0,0,0,0)",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 4,
              }),


        }
      ]}
    >
      <View style={styles.sideIconContainer}>
        {onBackPress ? <CircleButton variant="back" onPress={onBackPress} /> : <View style={styles.backButtonPlaceholder} />}
      </View>

      {title && <Text variant="header2Bold" accessibilityRole="header" style={styles.title}>{title}</Text>}

      <View style={styles.sideIconContainer}>
        {onPressClose ? (
          <CircleButton variant="back" onPress={onPressClose} iconName="close"/>
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
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    // paddingHorizontal: 20,
    // paddingVertical: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    height: 120,
    paddingBottom:10
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

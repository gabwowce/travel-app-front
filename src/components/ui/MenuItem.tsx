import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { HStack, Text } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

interface MenuItemProps {
  icon: string;
  title: string;
  onPress: () => void;
  color?: string;
  showArrow?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, title, onPress, color = "black", showArrow = true }) => {
  return (
    <TouchableOpacity style={styles.listItem} onPress={onPress}  accessibilityRole="button"
  accessibilityLabel={`${title} menu item`}>
      <HStack alignItems="center">
        <MaterialIcons name={icon as any} size={24} color={color} />
        <Text ml={3} style={{ color }}>{title}</Text>
      </HStack>
      {showArrow && (
        <MaterialIcons name="keyboard-arrow-right" size={24} color="gray" accessible={false}
    importantForAccessibility="no"/>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: wp("3%"),
    marginHorizontal: wp("3%"),
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 0,
  },
});

export default MenuItem;

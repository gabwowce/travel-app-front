import React from "react";
import { VStack, Text } from "native-base";
import { StyleSheet } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import MenuItem from "@/src/components/ui/MenuItem";

interface Section {
  title: string;
  options: {
    title: string;
    icon: string;
    color?: string;
    action?: () => void; // leidžiame undefined
  }[];
}

export default function ProfileMenu({ menuItems }: { menuItems: Section[] }) {
  return (
    <VStack pb={5}>
      {menuItems.map((section, index) => (
        <VStack key={index} space={hp("2%")}>
          <Text style={styles.itemsTitle} fontSize="md" fontWeight="bold">
            {section.title}
          </Text>
          {section.options.map((item, idx) => (
            <MenuItem
              key={idx}
              icon={item.icon}
              title={item.title}
              onPress={item.action ?? (() => {})}
              color={item.color}
              showArrow={section.title !== "Account Management"}
            />
          ))}
        </VStack>
      ))}
    </VStack>
  );
}

const styles = StyleSheet.create({
  itemsTitle: {
    paddingTop: 30,
    marginHorizontal: wp("3%"),
  },
});

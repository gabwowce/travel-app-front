import React from "react";
import { Text, TextProps } from "native-base";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

/**
 * SectionHeader – reusable title component for list sections.
 *
 * Usage:
 *   <SectionHeader title="Categories" />
 *   <SectionHeader title="Featured tours" topPadding />
 *
 * Props
 * ────────────────────────────────────────────────────────────
 *  title       – text shown inside the header
 *  topPadding  – adds the standard top spacing (4 % of width). Default: false
 *  ...textProps – any extra NativeBase <Text> props (color, onPress, etc.)
 */
export interface SectionHeaderProps extends Omit<TextProps, "children"> {
  title: string;
  topPadding?: boolean;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  topPadding = false,
  ...textProps
}) => {
  return (
    <Text
      variant="header2Bold"
      pl={wp("3%")}
      pt={topPadding ? wp("4%") : undefined}
      pb={wp("2%")}
      {...textProps}
    >
      {title}
    </Text>
  );
};

export default SectionHeader;

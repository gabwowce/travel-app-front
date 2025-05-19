// components/layout/FlexContainer.tsx

import React from 'react';
import { View, ViewStyle } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

interface FlexContainerProps {
  children: React.ReactNode;
  direction?: 'row' | 'column';
  justify?: ViewStyle['justifyContent'];
  align?: ViewStyle['alignItems'];
  wrap?: ViewStyle['flexWrap'];
  gap?: number;
  style?: ViewStyle;
  flex?: number;
  backgroundColor?: string;

  // Nauji shorthand padding props
  p?: number;
  px?: number;
  py?: number;
  pt?: number;
  pb?: number;
  pl?: number;
  pr?: number;
}

export default function FlexContainer({
  children,
  direction = 'column',
  justify = 'flex-start',
  align = 'stretch',
  wrap = 'nowrap',
  gap = 0,
  style,
  flex = 1,
  backgroundColor = '#fff',

  p,
  px,
  py,
  pt,
  pb ,
  pl,
  pr,
}: FlexContainerProps) {
  const paddingStyles: ViewStyle = {
    padding: p,
    paddingHorizontal: px,
    paddingVertical: py,
    paddingTop: pt,
    paddingBottom: pb,
    paddingLeft: pl,
    paddingRight: pr,
  };

  return (
    <View
      style={[
        {
          flexDirection: direction,
          justifyContent: justify,
          alignItems: align,
          flexWrap: wrap,
          gap,
          flex,
          backgroundColor,
          ...paddingStyles,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

import React from 'react';
import { type TextProps, StyleSheet } from 'react-native';
import { Text } from 'native-base'; // ✅ Naudojame NativeBase `Text`

export type ThemedTextProps = TextProps & {
  type?: 
    | 'header1' 
    | 'header1Bold'
    | 'header1BoldHighlighted'
    | 'header2'
    | 'header2Bold'
    | 'header3'
    | 'header3Bold'
    | 'body'
    | 'bodyBold'
    | 'bodyGray'
    | 'bodyBoldGray'
    | 'link';
  children: React.ReactNode;
};

export function ThemedText({
  style,
  type = 'body',
  children,
  ...rest
}: ThemedTextProps) {
  if (!children) {
    console.warn("Warning: ThemedText was rendered without children.");
    return null;
  }

  return (
    <Text style={[styles[type], style]} {...rest}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  header1: {
    fontSize: 32,
    fontWeight: '400', 
    color: "#0C2736",
    fontFamily: 'SFUIDisplay-Bold',
  },
  header1Bold: {
    fontSize: 32,
    fontWeight: 'bold',
    color: "#0C2736",
    fontFamily: 'SFUIDisplay-Bold',
  },
  header1BoldHighlighted: {
    fontSize: 32,
    fontWeight: 'bold',
    color: "#FF9800", 
    fontFamily: 'SFUIDisplay-Bold',
  },
  header2: {
    fontSize: 20,
    fontWeight: '400', 
    color: "#0C2736",
    fontFamily: 'SFUIDisplay-Bold',
  },
  header2Bold: {
    fontSize: 20,
    fontWeight: 'bold',
    color: "#0C2736",
    fontFamily: 'SFUIDisplay-Bold',
  },
  header3: {
    fontSize: 16,
    fontWeight: '400', 
    color: "#0C2736",
    fontFamily: 'SFUIDisplay-Bold',
  },
  header3Bold: {
    fontSize: 16,
    fontWeight: 'bold',
    color: "#0C2736",
    fontFamily: 'SFUIDisplay-Bold',
  },
  body: {
    fontSize: 15,
    fontWeight: '400', 
    color: "#0C2736",
    fontFamily: 'Inter',
  },
  bodyBold: {
    fontSize: 15,
    fontWeight: 'bold',
    color: "#0C2736",
    fontFamily: 'Inter',
  },
  bodyGray: {
    fontSize: 15,
    fontWeight: '400', 
    color: "rgba(0,0,0,0.5)", 
    fontFamily: 'Inter',
  },
  bodyBoldGray: {
    fontSize: 15,
    fontWeight: 'bold',
    color: "rgba(0,0,0,0.5)", 
    fontFamily: 'Inter',
  },
  link: {
    fontSize: 15,
    fontWeight: '400',
    color: "#237DB0", 
    fontFamily: 'Inter',
  },
});

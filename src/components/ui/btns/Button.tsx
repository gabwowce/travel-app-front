import React from "react";
import {
  View,
  Pressable,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";
import { Text } from "native-base";

type Variant = "primary" | "secondary" | "ouline";

type Props = {
  label?: string;
  onPress: () => void;
  variant?: Variant;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
  isDisabled?: boolean;
  accessibilityLabel?: string;

  // Spacing
  m?: number;
  mx?: number;
  my?: number;
  mt?: number;
  mb?: number;
  ml?: number;
  mr?: number;
  p?: number;
  px?: number;
  py?: number;
  pt?: number;
  pb?: number;
  pl?: number;
  pr?: number;
};

export default function CustomButton({
  label,
  onPress,
  variant = "primary",
  leftIcon,
  rightIcon,
  children,
  isDisabled,
  accessibilityLabel,
  // spacing props
  m,
  mx,
  my,
  mt,
  mb,
  ml,
  mr,
  p,
  px,
  py,
  pt,
  pb,
  pl,
  pr,
}: Props) {
  const spacingStyle: ViewStyle = {
    marginTop: mt ?? my ?? m,
    marginBottom: mb ?? my ?? m,
    marginLeft: ml ?? mx ?? m,
    marginRight: mr ?? mx ?? m,
    paddingTop: pt ?? py ?? p,
    paddingBottom: pb ?? py ?? p,
    paddingLeft: pl ?? px ?? p,
    paddingRight: pr ?? px ?? p,
  };

  const buttonVariantStyle: ViewStyle =
    variant === "primary"
      ? styles.primaryButton
      : variant === "secondary"
        ? styles.secondaryButton
        : styles.outlineButton;

  const textVariantStyle: TextStyle =
    variant === "primary"
      ? styles.primaryText
      : variant === "secondary"
        ? styles.secondaryText
        : styles.outlineText;

  return (
    <View style={[styles.buttonContainer, spacingStyle]}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: isDisabled }}
        accessibilityLabel={accessibilityLabel ? accessibilityLabel : label}
        style={[styles.button, buttonVariantStyle]}
        onPress={onPress}
      >
        {leftIcon && <View style={styles.icon}>{leftIcon}</View>}
        {children ? (
          typeof children === "string" ? (
            <Text style={[styles.label, textVariantStyle]}>{children}</Text>
          ) : (
            children
          )
        ) : (
          <Text style={[styles.label, textVariantStyle]}>{label}</Text>
        )}
        {rightIcon && <View style={styles.icon}>{rightIcon}</View>}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    alignItems: "center",
    justifyContent: "center",

    flex: 1,
  },
  button: {
    flexDirection: "row",
    borderRadius: 12,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: 50,
  },
  primaryButton: {
    backgroundColor: "#001F3F",
  },
  secondaryButton: {
    backgroundColor: "#CCCCCC",
  },
  outlineButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#001F3F",
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.8,
  },
  label: {
    fontSize: 15,
    fontWeight: "bold",
  },
  primaryText: {
    color: "#FFFFFF",
  },
  secondaryText: {
    color: "#FFFFFF",
  },
  outlineText: {
    color: "#001F3F",
  },
  icon: {
    marginHorizontal: 4,
  },
});

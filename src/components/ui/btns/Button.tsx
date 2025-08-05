import React from "react";
import { View, Pressable, StyleSheet, ViewStyle } from "react-native";
import { Text } from "native-base";

type Props = {
  label?: string;
  onPress: () => void;
  theme?: "primary" | "secondary";
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
  theme = "primary",
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

  return (
    <View style={[styles.buttonContainer, spacingStyle]}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: isDisabled }}
        accessibilityLabel={accessibilityLabel ? accessibilityLabel : label}
        style={[
          styles.button,
          theme === "primary" && styles.primaryButton,
          theme === "secondary" && styles.secondaryButton,
          isDisabled && styles.disabledButton,
        ]}
        onPress={onPress}
      >
        {leftIcon && <View style={styles.icon}>{leftIcon}</View>}
        {children ? (
          typeof children === "string" ? (
            <Text style={styles.buttonLabel}>{children}</Text>
          ) : (
            children
          )
        ) : (
          <Text style={styles.buttonLabel}>{label}</Text>
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
    width: "100%",
  },
  button: {
    flexDirection: "row",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  primaryButton: {
    backgroundColor: "#001F3F",
  },
  secondaryButton: {
    backgroundColor: "#CCCCCC",
  },
  buttonLabel: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  icon: {
    marginHorizontal: 4,
  },
  disabledButton: {
    opacity: 0.5,
  },
});

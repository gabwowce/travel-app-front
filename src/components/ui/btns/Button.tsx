import { usePathname } from "expo-router";
import { Text } from "native-base";
import React, { useCallback } from "react";
import { StyleSheet, TextStyle, View, ViewStyle } from "react-native";
import PressableLog from "../../PressableLog";

type Variant = "primary" | "secondary" | "ouline" | "outline";

type Props = {
  label?: string;
  onPress: () => void;
  variant?: Variant;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
  isDisabled?: boolean;
  accessibilityLabel?: string;
  isFlex1?: boolean;

  /** ——— Analytics ——— */
  analyticsLabel?: string; // jei nori konkretaus vardo loguose

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

// vieningas log formato helperis
function logBtn(name: string, meta?: Record<string, any>) {
  const ts = new Date().toISOString().replace("T", " ").slice(0, 19);
  console.log(`[${ts}] 🖱️ [BTN] ${name}`, meta ? JSON.stringify(meta) : "");
}

export default function CustomButton({
  label,
  onPress,
  variant = "primary",
  leftIcon,
  rightIcon,
  children,
  isDisabled,
  accessibilityLabel,
  isFlex1 = false,
  analyticsLabel,
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
  const path = usePathname();

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

  // Automatinis mygtuko pavadinimas logui
  const btnName =
    analyticsLabel ??
    (typeof children === "string"
      ? children
      : (label ?? accessibilityLabel ?? "Unnamed"));

  const handlePress = useCallback(() => {
    if (isDisabled) return;
    logBtn(btnName, { screen: path });
    onPress?.();
  }, [btnName, path, isDisabled, onPress]);

  return (
    <View
      style={[
        styles.buttonContainer,
        spacingStyle,
        isFlex1 ? { flex: 1 } : { width: "100%" },
      ]}
    >
      <PressableLog
        analyticsLabel={accessibilityLabel ? accessibilityLabel : label}
        accessibilityRole="button"
        accessibilityState={{ disabled: !!isDisabled }}
        accessibilityLabel={accessibilityLabel ? accessibilityLabel : label}
        onPress={handlePress}
        style={({ pressed }) => [
          styles.button,
          buttonVariantStyle,
          isDisabled && styles.disabled,
          pressed && !isDisabled && styles.pressed,
        ]}
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
      </PressableLog>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: { alignItems: "center", justifyContent: "center" },
  button: {
    flexDirection: "row",
    borderRadius: 12,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: 50,
  },
  primaryButton: { backgroundColor: "#001F3F" },
  secondaryButton: { backgroundColor: "#CCCCCC" },
  outlineButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#001F3F",
  },
  disabled: { opacity: 0.5 },
  pressed: { opacity: 0.8 },
  label: { fontSize: 16, fontWeight: "bold" },
  primaryText: { color: "#FFFFFF" },
  secondaryText: { color: "#FFFFFF" },
  outlineText: { color: "#001F3F" },
  icon: { marginHorizontal: 4 },
});

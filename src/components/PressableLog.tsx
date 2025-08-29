import { logBtn } from "@/src/utils/uiLogger";
import { usePathname } from "expo-router";
import React, { useCallback } from "react";
import { Pressable, PressableProps } from "react-native";

type Props = PressableProps & {
  /** Pirmenybė – aiškus pavadinimas logui */
  analyticsLabel?: string;
  /** Alias */
  name?: string;
};

export default function PressableLog({
  children,
  analyticsLabel,
  name,
  onPress,
  accessibilityLabel,
  testID,
  ...rest
}: Props) {
  const path = usePathname();
  const btnName =
    name ?? analyticsLabel ?? accessibilityLabel ?? testID ?? "Unnamed";

  const handlePress = useCallback(
    (e: any) => {
      logBtn(btnName, { screen: path });
      onPress?.(e);
    },
    [btnName, path, onPress]
  );

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel ?? btnName}
      testID={testID ?? `btn-${btnName.toLowerCase().replace(/\s+/g, "-")}`}
      onPress={handlePress}
      {...rest}
    >
      {children}
    </Pressable>
  );
}

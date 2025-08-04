import React, { ReactNode } from "react";
import {
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  ViewStyle,
  StyleSheet,
} from "react-native";

type Props = {
  children: ReactNode;
  style?: ViewStyle;
  keyboardVerticalOffset?: number;
};

export default function KeyboardWrapper({
  children,
  style,
  keyboardVerticalOffset = 64, // default’ą galima keisti pagal nav/header aukštį
}: Props) {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        style={[styles.container, style]}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={keyboardVerticalOffset}
      >
        {children}
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

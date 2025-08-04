import { StyleSheet, View, ViewProps } from "react-native";

const getItemStyle = (index: number, numColumns: number) => {
  const alignItems = (() => {
    if (numColumns < 2 || index % numColumns === 0) return "flex-start";
    if ((index + 1) % numColumns === 0) return "flex-end";

    return "center";
  })();

  return {
    alignItems,
    width: "100%",
    paddingHorizontal: 25,
  } as const;
};

type ColumnItemProps = ViewProps & {
  children: React.ReactNode;
  index: number;
  numColumns: number;
  accessible?: boolean;
};
export const ColumnItem = ({ children, index, numColumns,accessible= false, ...rest }: ColumnItemProps) => (
    <View accessible={false} importantForAccessibility="no" style={StyleSheet.flatten([getItemStyle(index, numColumns),rest.style])} {...rest}>
      {children}
    </View>
);
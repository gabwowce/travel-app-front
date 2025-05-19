/* flashlist.d.ts */
import "react-native";
import { ViewStyle } from "react-native";
import { FlashListProps } from "@shopify/flash-list";

declare module "@shopify/flash-list" {
  export interface FlashListProps<T> {
    /** kaip FlatList columnWrapperStyle */
    columnWrapperStyle?: ViewStyle;
  }
}

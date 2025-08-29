import { Box, Spinner, Text } from "native-base"; // ✅ Importuojame `native-base`
import React from "react";
import { FlatList, StyleSheet } from "react-native"; // ✅ Importuojame `StyleSheet`
import PressableLog from "./PressableLog";

interface SelectableListProps<T> {
  title?: string;
  data: T[];
  loading: boolean;
  error: string | null;
  getItemLabel?: (item: T) => string;
  renderItem?: (item: T) => React.ReactNode;
  onSelect: (item: T) => void;
  label: string | null;
}

export default function SelectableList<T extends { id: number }>({
  title,
  data,
  loading,
  error,
  getItemLabel,
  renderItem,
  onSelect,
  label,
}: SelectableListProps<T>) {
  return (
    <Box flex={1} pt={0}>
      {title && (
        <Text fontSize="xl" fontWeight="bold" mb={4}>
          {title}
        </Text>
      )}

      {loading ? (
        <Box alignItems="center" py={5}>
          <Spinner size="lg" color="primary.500" />
        </Box>
      ) : error ? (
        <Text color="red.500" textAlign="center">
          {error}
        </Text>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <PressableLog
              analyticsLabel={`Select ${label}`}
              onPress={() => onSelect(item)}
              style={styles.item}
              accessibilityRole="button"
              accessibilityLabel={`Select ${label}`}
              accessibilityHint="Double tap to select this item"
            >
              {renderItem ? (
                renderItem(item)
              ) : (
                <Text style={styles.text}>
                  {getItemLabel ? getItemLabel(item) : ""}
                </Text>
              )}
            </PressableLog>
          )}
        />
      )}
    </Box>
  );
}

const styles = StyleSheet.create({
  item: {
    paddingVertical: 4, // ✅ Tarpas viršuje ir apačioje
  },
  text: {
    fontSize: 16, // ✅ Didesnis tekstas
    color: "#333", // ✅ Tamsesnė spalva geresniam matomumui
  },
});

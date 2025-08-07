import React from "react";
import { Spinner, VStack, useBreakpointValue, Box, Text } from "native-base";
import { FlashList } from "@shopify/flash-list";
import MiniTourCard from "@/src/components/MiniTourCard";
import FilterChips from "@/src/components/ui/FilterChips";
import { ColumnItem } from "../getItemStyle";

interface Props {
  data: any[];
  isFetching?: boolean;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  onEndReached?: () => void;
  filters: Record<string, any>;
  onClearFilters: () => void;
}

/**
 * Responsive masonry‑like list that centres the last row.
 * Duplicate‑key warnings are prevented via unique key extraction for BOTH
 * FlashList and the underlying RecyclerListView cells (overrideItemKeyExtractor).
 */
export default function ResponsiveTourList({
  data,
  hasNextPage,
  isFetchingNextPage,
  onEndReached,
  filters,
  onClearFilters,
}: Props) {
  // determine column count per breakpoint
  const numColumns = useBreakpointValue({ base: 1, sm: 2, md: 3, lg: 3 }) ?? 1;

  // unique key for every item (id preferred, index fallback)
  const getKey = (item: any, index: number) =>
    `tour-${item?.id ?? "idx"}-${index}`;

  return (
    <FlashList
      accessible
      accessibilityLabel="List of available tours"
      data={data}
      numColumns={numColumns}
      estimatedItemSize={220}
      keyExtractor={getKey}
      // RecyclerListView also needs a stable key extractor
      overrideItemKeyExtractor={getKey as any}
      columnWrapperStyle={{ justifyContent: "center" }}
      onEndReached={() =>
        hasNextPage && !isFetchingNextPage && onEndReached?.()
      }
      onEndReachedThreshold={0.5}
      ListHeaderComponent={
        <VStack pt={4} px={4}>
          <FilterChips filters={filters} onClear={onClearFilters} />
        </VStack>
      }
      ListFooterComponent={
        isFetchingNextPage ? (
          <Spinner
            my={4}
            accessibilityRole="progressbar"
            accessibilityLabel="Loading more tours"
          />
        ) : null
      }
      contentContainerStyle={{ paddingBottom: 32 }}
      renderItem={({ item, index }) => (
        <ColumnItem index={index} numColumns={numColumns}>
          <MiniTourCard tour={item} />
        </ColumnItem>
      )}
      ListEmptyComponent={
        <Text
          mt={5}
          color="gray.500"
          textAlign="center"
          accessibilityLiveRegion="polite"
        >
          No tours found.
        </Text>
      }
    />
  );
}

import React, { useCallback, useEffect, useMemo, useRef } from "react";
import {
  useWindowDimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import {
  Spinner,
  VStack,
  useBreakpointValue,
  Box,
  Text,
  Button,
} from "native-base";
import { FlashList } from "@shopify/flash-list";
import MiniTourCard from "@/src/components/MiniTourCard";
import FilterChips from "@/src/components/ui/FilterChips";
import { ColumnItem } from "../getItemStyle";

interface Props {
  data: any[];
  isFetching?: boolean; // (optional) not used here
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  onEndReached?: () => void;
  filters: Record<string, any>;
  onClearAll?: () => void;
}

/**
 * Responsive masonry-like list that centres the last row.
 * Reliable load-more:
 *  - FlashList onEndReached
 *  - Manual onScroll threshold fallback
 *  - Footer with "Load more" button
 */
export default function ResponsiveTourList({
  data,
  hasNextPage,
  isFetchingNextPage,
  onEndReached,
  filters,
  onClearAll,
}: Props) {
  const { width, height } = useWindowDimensions();

  console.log("--> [ResponsiveTourList] hasNextPage: ", hasNextPage);
  console.log(
    "--> [ResponsiveTourList] isFetchingNextPage: ",
    isFetchingNextPage
  );

  // columns per breakpoint
  const numColumns = useBreakpointValue({ base: 1, sm: 2, md: 3, lg: 3 }) ?? 1;
  const listKey = useMemo(() => `cols-${numColumns}`, [numColumns]);

  // stable keys
  const keyExtractor = useCallback(
    (item: any, index: number) =>
      String(item?.id ?? item?.uuid ?? item?.slug ?? `idx-${index}`),
    []
  );

  // Fallback trigger via onScroll (jei FlashList onEndReached nešauna)
  const bottomOffsetPx = 200; // kiek iki dugno likus iškviečiam loadMore
  const canTriggerRef = useRef(true);

  useEffect(() => {
    // kai baigiam krauti / pasikeičia ilgis – leisk vėl trigerinti
    if (!isFetchingNextPage) canTriggerRef.current = true;
  }, [isFetchingNextPage, data?.length]);

  const onScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
      const distanceFromBottom =
        contentSize.height - (contentOffset.y + layoutMeasurement.height);

      if (
        distanceFromBottom < bottomOffsetPx &&
        hasNextPage &&
        !isFetchingNextPage &&
        canTriggerRef.current
      ) {
        canTriggerRef.current = false;
        onEndReached?.();
      }
    },
    [hasNextPage, isFetchingNextPage, onEndReached]
  );

  // Vartai FlashList onEndReached
  const handleEnd = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) onEndReached?.();
  }, [hasNextPage, isFetchingNextPage, onEndReached]);

  return (
    <FlashList
      key={listKey}
      style={{ flex: 1 }}
      estimatedListSize={{ width, height }}
      data={data}
      numColumns={numColumns}
      estimatedItemSize={320}
      keyExtractor={keyExtractor}
      overrideItemKeyExtractor={keyExtractor as any}
      columnWrapperStyle={{ justifyContent: "center" }}
      onEndReached={handleEnd}
      onEndReachedThreshold={0.2}
      onScroll={onScroll}
      scrollEventThrottle={16}
      ListHeaderComponent={
        <VStack pt={0} px={4}>
          <FilterChips filters={filters} onClear={onClearAll} />
        </VStack>
      }
      ListFooterComponent={
        <Box
          my={2}
          py={2}
          h={hasNextPage ? 160 : 24}
          justifyContent="center"
          alignItems="center"
        >
          {isFetchingNextPage ? (
            <Spinner
              accessibilityRole="progressbar"
              accessibilityLabel="Loading more tours"
            />
          ) : hasNextPage ? (
            <Button
              variant="outline"
              onPress={onEndReached}
              accessibilityRole="button"
              accessibilityLabel="Load more tours"
            >
              Load more
            </Button>
          ) : null}
        </Box>
      }
      contentContainerStyle={{ paddingBottom: 16 }}
      removeClippedSubviews
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

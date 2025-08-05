import React, { useEffect, useMemo, useRef, useState } from "react";
import { Box, Spinner, Text, SimpleGrid, ScrollView } from "native-base";
import ShowMoreButton from "@/src/components/ui/btns/ShowMoreButton";

type Pagination = {
  has_next?: boolean;
  total?: number;
  limit?: number | string;
  next_cursor?: string | null;          // ← svarbu: string
};

type Props<T> = {
  fetchFunction?: (args: Record<string, any>) => void;
  data?: T[];
  staticData?: T[];
  isFetching?: boolean;
  isError?: boolean;
  filters?: Record<string, any>;
  pagination?: Pagination;
  renderItem: ({ item }: { item: T }) => JSX.Element;
  ListHeaderComponent?: React.ReactElement;
  ListEmptyComponent?: React.ReactElement;
};

export default function PaginatedFlatList<T>({
  fetchFunction,
  data,
  staticData,
  isFetching = false,
  isError = false,
  filters = {},
  pagination,
  renderItem,
  ListHeaderComponent,
  ListEmptyComponent,
}: Props<T>) {

  /* ------------ LOCAL STATE ------------ */
  const isStatic = !!staticData;
  const PAGE_SIZE = useMemo(() => Number(pagination?.limit ?? 10), [pagination?.limit]);

  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [allItems, setAllItems] = useState<T[]>(staticData ?? []);

  /* ------------ HASH FOR FILTERS ------------ */
  const filtersHash = JSON.stringify(filters);
  const prevFiltersRef = useRef(filtersHash);

  /* ------------ FETCH ON CURSOR/FILTER CHANGE ------------ */
  useEffect(() => {
    if (isStatic || !fetchFunction) return;
    fetchFunction({ ...filters, limit: PAGE_SIZE, cursor });
  }, [cursor, filtersHash, PAGE_SIZE]);

  /* ------------ RESET ON FILTER CHANGE ------------ */
  useEffect(() => {
    if (isStatic) return;
    if (prevFiltersRef.current !== filtersHash) {
      prevFiltersRef.current = filtersHash;
      setCursor(undefined);             // back to first page
      setAllItems([]);                  // clear list
      fetchFunction?.({ ...filters, limit: PAGE_SIZE, cursor: undefined });
    }
  }, [filtersHash, PAGE_SIZE]);

  /* ------------ APPEND NEW DATA ------------ */
  useEffect(() => {
    if (isStatic || !data) return;
    setAllItems(prev =>
      cursor === undefined ? data
        : [...prev, ...data.filter(d => !prev.some(p => (p as any).id === (d as any).id))]
    );
  }, [data]);

  const displayedItems = isStatic ? staticData ?? [] : allItems;

  /* ------------ CAN LOAD MORE? ------------ */
  const canLoadMore = useMemo(() => {
    if (isStatic) return false;
    if (pagination?.has_next !== undefined) return pagination.has_next;
    if (pagination?.total !== undefined)    return displayedItems.length < pagination.total;
    return true; // kai nežinom – rodome
  }, [isStatic, pagination?.has_next, pagination?.total, displayedItems.length]);

  /* ------------ UI ------------ */
  return (
    <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 10 }}>
      {ListHeaderComponent}

      {isFetching && cursor === undefined ? (
        <Box alignItems="center" py={6}><Spinner size="lg" accessibilityRole="progressbar"
  accessibilityLabel="Loading data, please wait" /></Box>
      ) : isError ? (
        <Text textAlign="center" color="red.500" mt={4} accessibilityRole="alert"
  accessibilityLiveRegion="assertive">Failed to load data.</Text>
      ) : displayedItems.length === 0 ? (
        ListEmptyComponent ?? <Text textAlign="center" color="gray.500" mt={4} accessibilityRole="status"
  accessibilityLiveRegion="polite">No results.</Text>
      ) : (
        <>
          <SimpleGrid minChildWidth={170} spacing={3} w="100%">
            {displayedItems.map((item, i) => (
              <Box key={(item as any).id ?? i}>{renderItem({ item })}</Box>
            ))}
          </SimpleGrid>

          {canLoadMore && (
            <Box alignItems="center" my={4}>
              <ShowMoreButton
                onPress={() => setCursor(pagination?.next_cursor ?? undefined)}
                isLoading={isFetching && cursor !== undefined}
              />
            </Box>
          )}
        </>
      )}
    </ScrollView>
  );
}

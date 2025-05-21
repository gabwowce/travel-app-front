import React from "react";
import { Spinner, VStack, useBreakpointValue, Box } from "native-base";
import { FlashList } from "@shopify/flash-list";
import MiniTourCard from "@/src/components/MiniTourCard";
import SearchBar from "@/src/components/SearchBar";
import { ColumnItem } from "../getItemStyle";
import { Route } from "@/src/store/travelApi";

type Props = {
  data: Route[];
  isFetching: boolean;
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  ListHeaderComponent?: React.ReactNode;
  ListEmptyComponent?: React.ReactNode;
};

export default function ResponsiveTourListStatic({
  data,
  isFetching,
  searchTerm,
  setSearchTerm,
  ListEmptyComponent,
}: Props) {
  const numColumns = useBreakpointValue({ base: 1, sm: 2, md: 3, lg: 3 }) ?? 1;

  const getKey = (item: any, index: number) =>
    `tour-${item?.id ?? "idx"}-${index}`;

  return (
    <FlashList
      data={data}
      numColumns={numColumns}
      estimatedItemSize={220}
      keyExtractor={getKey}
      overrideItemKeyExtractor={getKey as any}
      columnWrapperStyle={{ justifyContent: "center" }}
      ListHeaderComponent={
        <SearchBar
          placeholder="Search favorites"
          value={searchTerm}
          onChangeText={setSearchTerm}
          onClear={() => setSearchTerm("")}
        />
      }
      ListFooterComponent={isFetching ? <Spinner my={4} /> : null}
      ListEmptyComponent={ListEmptyComponent}
      contentContainerStyle={{ paddingBottom: 32 }}
      renderItem={({ item, index }) => (
        <ColumnItem index={index} numColumns={numColumns}>
          <MiniTourCard tour={item} />
        </ColumnItem>
      )}
    />
  );
}

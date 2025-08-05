// src/components/ui/FavoritesListHeader.tsx
import { VStack } from "native-base";
import SearchBar from "@/src/components/SearchBar";

export default function FavoritesListHeader({
  searchTerm,
  setSearchTerm,
}: {
  searchTerm: string;
  setSearchTerm: (t: string) => void;
}) {
  return (
    <VStack alignItems="center" mt={6} mb={4} space={4}>
      <SearchBar
        placeholder="Search favorites"
  accessibilityLabel="Search favorites input field"
        value={searchTerm}
        onChangeText={setSearchTerm}
        onClear={() => setSearchTerm("")}
      />
    </VStack>
  );
}

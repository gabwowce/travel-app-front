// src/hooks/useSavedScreenData.ts
import { useGetUserFavoritesQuery } from "@/src/store/travelApi";
import { useMemo, useState } from "react";

export function useSavedScreenData() {
  const { data, isLoading, isError } = useGetUserFavoritesQuery({});
  const favorites = data?.data ?? [];

  const [searchTerm, setSearchTerm] = useState("");

  const filtered = useMemo(() => {
    if (!searchTerm.trim()) return favorites;
    const q = searchTerm.toLowerCase().trim();
    return favorites.filter((tour) => {
      const name = tour.name.toLowerCase();
      const city = tour.city?.name?.toLowerCase() ?? "";
      const country = tour.city?.country?.name?.toLowerCase() ?? "";
      return name.includes(q) || city.includes(q) || country.includes(q);
    });
  }, [favorites, searchTerm]);

  return {
    favorites,
    filtered,
    searchTerm,
    setSearchTerm,
    isLoading,
    isError,
  };
}

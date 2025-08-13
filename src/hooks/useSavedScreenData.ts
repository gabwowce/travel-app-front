import { useMemo, useState } from "react";
import { useGetUserFavoritesQuery } from "../store/travelApi";

// src/hooks/useSavedScreenData.ts
function normalizeFavorites(resp: any) {
  const d = resp?.data ?? resp;
  if (Array.isArray(d)) return d; // kai API grąžina tiesiog []
  if (Array.isArray(d?.data)) return d.data; // kai ateina { data: [] }
  if (Array.isArray(d?.items)) return d.items; // tavo atvejis { items: [], pagination: {} }
  return [];
}

export function useSavedScreenData() {
  const { data: favoritesResp, isFetching } = useGetUserFavoritesQuery({});

  const favorites = useMemo(
    () => normalizeFavorites(favoritesResp),
    [favoritesResp]
  );

  const [searchTerm, setSearchTerm] = useState("");
  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return favorites;
    return favorites.filter((t: any) =>
      (t?.name ?? "").toLowerCase().includes(q)
    );
  }, [favorites, searchTerm]);

  return {
    favorites, // ← jau masyvas
    filtered, // ← masyvas
    searchTerm,
    setSearchTerm,
    isLoading: isFetching,
  };
}

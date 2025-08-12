// components/FavoriteButton.tsx
import React, { useMemo, useState } from "react";
import { IconButton } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import { StyleProp, ViewStyle } from "react-native";

import { useLazyGetUserFavoritesQuery } from "@/src/store/LazyHooks";
import {
  useAddRouteToFavoritesMutation,
  useRemoveRouteFromFavoritesMutation,
} from "@/src/store/travelApi";

type Props = { routeId: number; style?: StyleProp<ViewStyle> };

export default function FavoriteButton({ routeId, style }: Props) {
  // LAZY: nesiunčia kol nepaspausta
  const [triggerFavorites, { data: favoritesResp, isFetching: loadingFavs }] =
    useLazyGetUserFavoritesQuery();

  const [addToFavorites, { isLoading: adding }] =
    useAddRouteToFavoritesMutation();
  const [removeFromFavorites, { isLoading: removing }] =
    useRemoveRouteFromFavoritesMutation();

  // Lokalus optimistinis statusas (null = dar neapsisprendėm, remiamės serveriu)
  const [localFavorited, setLocalFavorited] = useState<boolean | null>(null);

  const favorites = favoritesResp?.data ?? [];
  const fromServer = useMemo(
    () => favorites.some((fav: any) => String(fav.id) === String(routeId)),
    [favorites, routeId]
  );

  const isFavorited = localFavorited ?? fromServer ?? false;
  const isBusy = loadingFavs || adding || removing;

  const ensureFavoritesLoaded = async () => {
    if (!favoritesResp && !loadingFavs) {
      try {
        await triggerFavorites({}).unwrap();
      } catch {
        // tyliai ignoruojam – vartotojas vis tiek galės pabandyti dar kartą
      }
    }
  };

  const toggleFavorite = async () => {
    // jei dar neturim favoritų sąrašo – atsikraunam kartą
    if (!favoritesResp) await ensureFavoritesLoaded();

    try {
      if (isFavorited) {
        // optimistiškai „nužymim“
        setLocalFavorited(false);
        await removeFromFavorites({ route: routeId }).unwrap();
      } else {
        setLocalFavorited(true);
        await addToFavorites({ route: routeId }).unwrap();
      }

      // po sėkmės atsinaujinam serverio tiesą (nebūtina, bet saugiau)
      await triggerFavorites({}).unwrap();
      // kai gausim serverio atsakymą, localFavorited paliekam kaip yra
      // arba galim nulinti, kad remtųsi serveriu:
      setLocalFavorited(null);
    } catch (err) {
      // jei nepavyko – rollback
      setLocalFavorited(null);
      console.error("Favorite toggle error", err);
    }
  };

  return (
    <IconButton
      style={style}
      icon={
        <MaterialIcons
          name={isFavorited ? "bookmark" : "bookmark-border"}
          size={24}
          color="white"
        />
      }
      onPress={toggleFavorite}
      isDisabled={isBusy}
      accessibilityRole="button"
      accessibilityLabel={
        isFavorited ? "Remove from favorites" : "Add to favorites"
      }
      accessibilityState={{ selected: isFavorited, busy: isBusy }}
    />
  );
}

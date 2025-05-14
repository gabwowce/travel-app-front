// components/FavoriteButton.tsx
import React from 'react';
import { IconButton } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import {
  useAddToFavoritesMutation,
  useRemoveFromFavoritesMutation,
  useGetFavoritesQuery,
} from '@/src/store/travelApi';

type Props = {
  routeId: number;
};

export default function FavoriteButton({ routeId }: Props) {
  const { data: favorites } = useGetFavoritesQuery();
  const [addFavorite] = useAddToFavoritesMutation();
  const [removeFavorite] = useRemoveFromFavoritesMutation();

  const isFavorited = favorites?.data?.some((fav) => fav.id === routeId);

  const toggleFavorite = async () => {
    try {
      if (isFavorited) {
        await removeFavorite(routeId).unwrap();
      } else {
        await addFavorite({ route_id: routeId }).unwrap();
      }
    } catch (err) {
      console.error('Favorite toggle error', err);
    }
  };

  return (
    <IconButton
      icon={
        <MaterialIcons
          name={isFavorited ? 'favorite' : 'favorite-border'}
          size={24}
          color={isFavorited ? 'red' : 'gray'}
        />
      }
      onPress={toggleFavorite}
    />
  );
}

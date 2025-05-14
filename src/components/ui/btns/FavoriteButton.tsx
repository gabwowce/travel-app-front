// components/FavoriteButton.tsx
import React from 'react';
import { IconButton } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import {
  useGetUserFavoritesQuery,
  useAddRouteToFavoritesMutation,
  useRemoveRouteFromFavoritesMutation,
} from '@/src/store/travelApi';

type Props = {
  routeId: string;
};

export default function FavoriteButton({ routeId }: Props) {
  const { data: favorites } = useGetUserFavoritesQuery({});

  const [addToFavorites] = useAddRouteToFavoritesMutation();
  const [removeFromFavorites] = useRemoveRouteFromFavoritesMutation();

  const isFavorited = favorites?.data?.some((fav) => fav.id === Number(routeId));

  const toggleFavorite = async () => {
    try {
      if (isFavorited) {
        await removeFromFavorites(routeId).unwrap();
      } else {
        await addToFavorites({ route_id: routeId }).unwrap();
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

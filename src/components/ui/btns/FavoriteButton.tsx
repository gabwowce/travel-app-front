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
  routeId: number;
};

export default function FavoriteButton({ routeId }: Props) {
  const {
  data: favorites,
  isLoading: favLoading,
  isFetching: favFetching,
  isSuccess: favSuccess,
  refetch
} = useGetUserFavoritesQuery({});


  const [addToFavorites] = useAddRouteToFavoritesMutation();
  const [removeFromFavorites] = useRemoveRouteFromFavoritesMutation();

  const isFavorited =
  favSuccess && favorites?.data?.some((fav) => String(fav.id) === String(routeId));

  console.log('➡️ routeId-->:' + routeId);
console.log('➡️ User is favorites?????:' + isFavorited);

  const toggleFavorite = async () => {
    await refetch();
    try {
      if (isFavorited) {
        await removeFromFavorites({ route: routeId }).unwrap();
      } else {
        await addToFavorites({ route: routeId }).unwrap();
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

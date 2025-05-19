// components/FavoriteButton.tsx
import React from 'react';
import { IconButton } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import {
  useGetUserFavoritesQuery,
  useAddRouteToFavoritesMutation,
  useRemoveRouteFromFavoritesMutation,
} from '@/src/store/travelApi';
import { StyleProp, ViewStyle } from 'react-native';

type Props = {
  routeId: number;
  style: StyleProp<ViewStyle>;
};

export default function FavoriteButton({ routeId, style }: Props) {
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

  const toggleFavorite = async () => {
    
    try {
      if (isFavorited) {
        await removeFromFavorites({ route: routeId }).unwrap();
      } else {
        await addToFavorites({ route: routeId }).unwrap();
      }
    } catch (err) {
      console.error('Favorite toggle error', err);
    }
    await refetch();
  };

  return (
    <IconButton style={style}
      icon={
        <MaterialIcons
          name={isFavorited ? 'bookmark' : 'bookmark-border'}
          size={24}
          color={isFavorited ? 'white' : 'white'}
        />
      }
      onPress={toggleFavorite}
    />
  );
}

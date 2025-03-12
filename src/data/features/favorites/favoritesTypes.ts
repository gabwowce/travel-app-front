export interface FavoriteRoute {
  id: number;
  name: string;
  slug: string;
  description: string;
  distance: number;
  elevation_gain: number;
  max_altitude: number;
  difficulty: string;
  is_featured: boolean;
  city: {
    id: number;
    name: string;
    country: {
      id: number;
      name: string;
      code: string;
    };
  };
  category: {
    id: number;
    name: string;
    slug: string;
  };
  media: {
    id: number;
    url: string;
    type: string;
    is_featured: boolean;
  }[];
  rating: {
    average: number;
    count: number;
  };
  favorited_at: string;
}

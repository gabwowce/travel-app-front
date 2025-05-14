export interface UserProfile {
  id: number;
  user_id: number;
  bio: string | null;
  location: string | null;
  website: string | null;
  created_at: string;
  updated_at: string;
}
  
  export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    profile: UserProfile;
  }
  
  export interface FavoritesResponse {
  data: {
    items: FavoriteRoute[];
    pagination: Pagination;
  };
}

export interface RatingsResponse {
  data: {
    items: UserRating[];
    pagination: Pagination;
  };
}

export interface FavoriteRoute {
  id: number;
  name: string;
  description: string;
  distance: number;
  elevation_gain: number;
  difficulty: string;
  city: {
    id: number;
    name: string;
    country: {
      id: number;
      name: string;
      code: string;
    };
  };
  ratings_avg_rating: number;
  ratings_count: number;
  media: {
    id: number;
    url: string;
    type: string;
  }[];
  categories: {
    id: number;
    name: string;
  }[];
}

export interface UserRating {
  id: number;
  user_id: number;
  route_id: number;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
  route: {
    id: number;
    name: string;
    city: {
      id: number;
      name: string;
      country: {
        id: number;
        name: string;
        code: string;
      };
    };
    media: {
      id: number;
      url: string;
      type: string;
    }[];
  };
}

export interface Pagination {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
  from: number;
  to: number;
}

export interface UserResponse {
  data: {
    user: User;
  };
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  password?: string;
  password_confirmation?: string;
  profile?: {
    bio?: string;
    location?: string;
    website?: string;
  };
}

export interface UserState {
  user: User | null;
  favorites: FavoriteRoute[];
  ratings: UserRating[];
  loading: boolean;
  error: string | null;
}

  

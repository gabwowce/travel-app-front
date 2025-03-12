export interface UserProfile {
    id: number;
    user_id: number;
    bio: string | null;
    location: string | null;
    website: string | null;
    created_at: string;
    updated_at: string;
    avatar:string;
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
      items: any[];
    };
  }
  
  export interface RatingsResponse {
    data: {
      items: any[];
    };
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
    favorites: any[];
    ratings: any[];
    loading: boolean;
    error: string | null;
  }
  
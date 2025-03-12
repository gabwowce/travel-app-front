export interface City {
    id: number;
    name: string;
    country_id: number;
    latitude: number | null;
    longitude: number | null;
    slug: string;
    created_at: string;
    updated_at: string;
    country: {
      id: number;
      name: string;
      code: string;
      created_at: string;
      updated_at: string;
    };
  }
  
  export interface Media {
    id: number;
    type: string; // "image", "video", etc.
    path: string;
    status: string;
    reported_at: string | null;
    created_at: string;
    updated_at: string;
    route_id: number;
    is_main: boolean;
    url: string;
    thumbnail_url: string;
  }
  
  export interface Category {
    id: number;
    name: string;
    icon: string;
    color: string;
    slug: string;
    created_at: string;
    updated_at: string;
    pivot: {
      route_id: number;
      category_id: number;
      created_at: string;
      updated_at: string;
    };
  }
  
  export interface Route {
    id: number;
    name: string;
    description: string;
    city_id: number;
    distance: number;
    elevation_gain: number;
    geo_json: string; // GeoJSON kaip stringas
    elevation_data: any | null; // gali būti null arba struktūrizuoti duomenys
    created_at: string;
    updated_at: string;
    difficulty: string;
    estimated_time: string;
    slug: string;
    elevation: number;
    is_published: number;
    is_featured: number;
    ratings_avg_rating: number;
    ratings_count: number;
    city: City;
    media: Media[];
    categories: Category[];
  }
  
  
  // Maršrutų užklausų parametrai
  export interface RouteQueryParams {
    country_id?: number;
    city_id?: number;
    category_id?: number;
    difficulty?: string | string[];
    min_distance?: number;
    max_distance?: number;
    min_elevation?: number;
    max_elevation?: number;
    search?: string;
    sort?: string;
    per_page?: number;
    page?: number;
  }
  
  // Paginuotas atsakymas
  export interface PaginatedRoutesResponse {
    items: Route[];
    pagination: {
      total: number;
      per_page: number;
      current_page: number;
      last_page: number;
    };
  }
  
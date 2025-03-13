export interface Country {
    id: number;
    name: string;
    code: string;
    cities_count: number;
    routes_count: number;
  }
  
  export interface City {
    id: number;
    name: string;
    country_id: number;
    routes_count: number;
  }
  
  export interface CountryDetails {
    id: number;
    name: string;
    code: string;
    cities: City[];
    routes_count: number;
  }
  
  export interface PaginatedRoutesResponse {
    current_page: number;
    data: {
      id: number;
      name: string;
      description: string;
      city_id: number;
      distance: number;
      elevation: number;
      difficulty: string;
      duration: number;
      is_featured: boolean;
    }[];
    total: number;
  }
  
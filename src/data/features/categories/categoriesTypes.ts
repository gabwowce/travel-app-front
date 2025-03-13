export interface Category {
    id: number;
    name: string;
    routes_count: number;
  }
  
  export interface CategoryDetails {
    id: number;
    name: string;
    routes: {
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
  
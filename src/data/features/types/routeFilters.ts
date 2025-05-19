/* src/types/routeFilters.ts */
export interface RouteFilters {
  /** IDs */
  categoryId?: number;
  countryId?: number;
  cityId?: number;

  /** Numeric filters */
  minRating?: number;   // 1–5
  maxDistance?: number; // km
  minElevation?: number;
  maxElevation?: number;

  /** Flags */
  onlyFavorites?: boolean;

  /** Free-text (naudojama Search ekrane) */
  search?: string;
}

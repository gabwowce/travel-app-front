// src/config/filterDefaults.ts
export const BASE_FILTER_DEFAULTS = {
  minRating: 0,
  maxDistance: 500,
  minElevation: 0,
  maxElevation: 5000,
  onlyFavorites: false,
  search: "",
} as const;

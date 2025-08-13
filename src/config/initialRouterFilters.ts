// src/config/filterDefaults.ts
export const BASE_FILTER_DEFAULTS = {
  minRating: 0,
  maxDistance: 500,
  minElevation: 0,
  maxElevation: 5000,
  onlyFavorites: false,
  search: "",
} as const;

export const ROUTE_FILTER_LIMITS = 50;
export const ROUTE_KEY = "search";
export const ROUTE_KEY_SAVED = "saved";

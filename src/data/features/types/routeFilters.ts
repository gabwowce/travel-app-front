// src/types/filters.ts
export type DifficultyLevel =
  | ""
  | "easy"
  | "moderate"
  | "challenging"
  | "difficult";

export interface RouteFilters {
  /** IDs */
  categoryId?: number;
  countryId?: number;
  cityId?: number;

  /** Difficulty */
  difficulty?: DifficultyLevel;

  /** Numeric filters */
  minRating?: number; // 1–5 (gali būti ir .5 iš žvaigždučių)
  minDistance?: number; // ⬅️ km
  maxDistance?: number; // km
  elevation?: [number, number]; // [min, max] m

  /** Flags */
  onlyFavorites?: boolean;

  /** Free-text search */
  search?: string;
}

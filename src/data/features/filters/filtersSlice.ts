// src/data/features/filters/filtersSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RouteFilters } from "@/src/data/features/types/routeFilters";

export interface FiltersState {
  /** Žemėlapis: routeKey -> filtrai */
  [key: string]: RouteFilters | undefined;
}

const initialState: FiltersState = {};

export const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    mergeFiltersForKey: (
      state,
      action: PayloadAction<{ key: string; filters: RouteFilters }>
    ) => {
      const { key, filters } = action.payload;
      state[key] = { ...(state[key] ?? {}), ...filters };

      if (__DEV__) {
        console.log(`[filters] MERGE → key: "${key}"`);
        console.table(filters);
      }
    },
    clearFilters: (state, action: PayloadAction<{ key: string }>) => {
      if (__DEV__) {
        console.log(`[filters] CLEAR → key: "${action.payload.key}"`);
      }
      delete state[action.payload.key];
    },
  },
});

export const { mergeFiltersForKey, clearFilters } = filtersSlice.actions;
export default filtersSlice.reducer;

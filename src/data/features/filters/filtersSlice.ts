// src/data/features/filters/filtersSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type RoutesFilters = Record<string, unknown> | null;

const filtersSlice = createSlice({
  name: 'filters',
  initialState: { filters: null as RoutesFilters },
  reducers: {
    setFilters: (st, a: PayloadAction<RoutesFilters>) => {
      st.filters = a.payload;
    },
    clearFilters: (st) => {
      st.filters = null;
    },
  },
});

export const { setFilters, clearFilters } = filtersSlice.actions;
export default filtersSlice.reducer;

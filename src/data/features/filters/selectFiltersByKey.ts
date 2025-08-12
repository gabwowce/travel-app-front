// filtersSelectors.ts
import { createSelector } from "@reduxjs/toolkit";
import { RouteFilters } from "@/src/data/features/types/routeFilters";

const EMPTY: RouteFilters = Object.freeze({});

export const selectFiltersByKey = createSelector(
  (st: any) => st.filters as Record<string, RouteFilters | undefined>,
  (_: any, key: string | undefined) => key,
  (filters, key) => (key ? (filters[key] ?? EMPTY) : EMPTY)
);

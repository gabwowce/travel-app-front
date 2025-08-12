// src/data/features/filters/selectors.ts
import type { RouteFilters } from "@/src/data/features/types/routeFilters";

export const EMPTY_FILTERS: Readonly<RouteFilters> = Object.freeze({});

export const selectDraftByKey = (state: any, key: string) =>
  state.filters?.draft?.[key] ?? EMPTY_FILTERS;

export const selectAppliedByKey = (state: any, key: string) =>
  state.filters?.applied?.[key] ?? EMPTY_FILTERS;

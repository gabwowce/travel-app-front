// filtersSelectors.ts
import type { RouteFilters } from "@/src/data/features/types/routeFilters";
import type { RootState } from "@/src/data/store";
import { createSelector } from "@reduxjs/toolkit";

const EMPTY: Readonly<RouteFilters> = Object.freeze({} as RouteFilters);

/** Kiekvienam komponentui – atskira memoizacija */
export const makeSelectAppliedByKey = () =>
  createSelector(
    [
      (st: RootState) => st.filters.applied, // <-- svarbu: teisingas slice
      (_: RootState, key?: string) => key,
    ],
    (applied, key) =>
      key && applied[key] ? applied[key]! : (EMPTY as RouteFilters)
  );

/** Jei reikia draft’ų – analogiškai */
export const makeSelectDraftByKey = () =>
  createSelector(
    [(st: RootState) => st.filters.drafts, (_: RootState, key?: string) => key],
    (drafts, key) =>
      key && drafts[key] ? drafts[key]! : (EMPTY as RouteFilters)
  );

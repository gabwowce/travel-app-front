// src/data/features/filters/filtersSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RouteFilters } from "@/src/data/features/types/routeFilters";

type Map<T> = Record<string, T | undefined>;

export interface FiltersState {
  applied: Map<RouteFilters>; // tai, pagal ką tikrai filtruojam (sąrašas klauso šito)
  drafts: Map<RouteFilters>; // laikinas formos stovis modale
}

const initialState: FiltersState = { applied: {}, drafts: {} };

const slice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    // DRAFT keitimas (vieno ar kelių laukų merge)
    mergeFiltersDraftForKey: (
      state,
      action: PayloadAction<{ key?: string; filters: RouteFilters }>
    ) => {
      const key = action.payload.key;
      console.log("🟡 [mergeFiltersDraftForKey] key:", key);
      console.log("   incoming filters:", action.payload.filters);
      console.log("   before drafts:", JSON.stringify(state.drafts, null, 2));

      if (!key) {
        console.warn(
          "   ⚠️ No key provided — skipping mergeFiltersDraftForKey"
        );
        return;
      }

      state.drafts[key] = {
        ...(state.drafts[key] ?? {}),
        ...action.payload.filters,
      };

      console.log("   after drafts:", JSON.stringify(state.drafts, null, 2));
    },

    // DRAFT reset
    clearFiltersDraft: (state, action: PayloadAction<{ key: string }>) => {
      console.log("🗑 [clearFiltersDraft] key:", action.payload.key);
      delete state.drafts[action.payload.key];
    },

    // APPLY: nukopijuojam draft -> applied
    applyDraftForKey: (state, action: PayloadAction<{ key?: string }>) => {
      const key = action.payload.key;
      console.log("🟢 [applyDraftForKey] key:", key);
      console.log("   before applied:", JSON.stringify(state.applied, null, 2));
      console.log(
        "   from draft:",
        JSON.stringify(state.drafts[key ?? ""] ?? {}, null, 2)
      );

      if (!key) {
        console.warn("   ⚠️ No key provided — skipping applyDraftForKey");
        return;
      }

      state.applied[key] = { ...(state.drafts[key] ?? {}) };

      console.log("   after applied:", JSON.stringify(state.applied, null, 2));
    },

    // APPLIED reset
    clearAppliedForKey: (state, action: PayloadAction<{ key: string }>) => {
      console.log("🗑 [clearAppliedForKey] key:", action.payload.key);
      delete state.applied[action.payload.key];
    },

    // Visiems patogu: išvalyti abu
    clearAllForKey: (state, action: PayloadAction<{ key: string }>) => {
      console.log("🗑 [clearAllForKey] key:", action.payload.key);
      delete state.drafts[action.payload.key];
      delete state.applied[action.payload.key];
    },

    // (jei reikia) Tiesioginis APPLIED merge (naudinga iš Search inputo be modalo)
    mergeFiltersForKey: (
      state,
      action: PayloadAction<{ key?: string; filters: RouteFilters }>
    ) => {
      const key = action.payload.key;
      console.log("🟠 [mergeFiltersForKey] key:", key);
      console.log("   incoming filters:", action.payload.filters);
      console.log("   before applied:", JSON.stringify(state.applied, null, 2));

      if (!key) {
        console.warn("   ⚠️ No key provided — skipping mergeFiltersForKey");
        return;
      }

      state.applied[key] = {
        ...(state.applied[key] ?? {}),
        ...action.payload.filters,
      };

      console.log("   after applied:", JSON.stringify(state.applied, null, 2));
    },
  },
});

export const {
  mergeFiltersDraftForKey,
  clearFiltersDraft,
  applyDraftForKey,
  clearAppliedForKey,
  clearAllForKey,
  mergeFiltersForKey, // paliekam jei kur nors naudoji tiesioginį applied
} = slice.actions;

export default slice.reducer;

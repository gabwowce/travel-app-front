
import { isAnyOf, type AnyAction, type AsyncThunk } from "@reduxjs/toolkit";
import type { ParsedError } from "@/src/api/parseApiErrors";
/**
 * Helper funkcija, kuri generuoja extraReducers pending/fulfilled/rejected handling globaliai
 */
export function createCommonReducers(thunks: any[], sliceName: string) {
  return (builder: any) => {
    builder
      .addMatcher(
        isAnyOf(...thunks.map(thunk => thunk.pending)),
        (state: any) => {
          state.loading = true;
          state.errors = {}; // <- plural, kaip slice
        }
      )
      .addMatcher(
        isAnyOf(...thunks.map(thunk => thunk.fulfilled)),
        (state: any) => {
          state.loading = false;
        }
      )
      .addMatcher(
        isAnyOf(...thunks.map((t) => t.rejected)),
        (state: any, action: AnyAction) => {
          state.loading = false;

          const payload = action.payload as ParsedError | undefined;

          if (payload?.errors) {
            state.errors = payload.errors; // 422 – laukų klaidos
          } else if (payload?.message) {
            state.errors = { general: payload.message }; // 401, 403, …
          } else {
            state.errors = {
              general: action.error?.message ?? "Unknown error",
            };
          }
        }
      );
      
  };
}

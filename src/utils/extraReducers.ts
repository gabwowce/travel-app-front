import { isAnyOf } from "@reduxjs/toolkit";

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
        isAnyOf(...thunks.map(thunk => thunk.rejected)),
        (state: any, action: any) => {
          state.loading = false;
          state.errors = action.error.message || {};
        }
      );
  };
}

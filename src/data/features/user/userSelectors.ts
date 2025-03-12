import { RootState } from "@/src/data/store";

// Gauti visą vartotojo objektą
// export const selectUser = (state: RootState) => state.user.user;

// Gauti vartotojo profilį
export const selectUserProfile = (state: RootState) => state.user.user?.profile ?? null;

// Gauti vartotojo mėgstamiausius maršrutus
export const selectUserFavorites = (state: RootState) => state.user.favorites;

// Gauti vartotojo įvertinimus
export const selectUserRatings = (state: RootState) => state.user.ratings;

// Gauti įkrovimo būseną
// export const selectUserLoading = (state: RootState) => state.user.loading;

// Gauti klaidas
export const selectUserError = (state: RootState) => state.user.error;



// Check your selectors implementation
export const selectUser = (state: RootState) => state.user.user;
export const selectUserLoading = (state: RootState) => state.user.loading;
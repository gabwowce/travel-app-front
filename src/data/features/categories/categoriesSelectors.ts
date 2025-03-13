import { RootState } from "@/src/data/store";

// ✅ Gauti visas kategorijas
export const selectCategories = (state: RootState) => state.categories.categories;

// ✅ Gauti pasirinktą kategoriją
export const selectSelectedCategory = (state: RootState) => state.categories.selectedCategory;

// ✅ Gauti kategorijos maršrutus
export const selectCategoryRoutes = (state: RootState) => state.categories.categoryRoutes;

// ✅ Gauti užkrovimo būseną
export const selectCategoriesLoading = (state: RootState) => state.categories.loading;

// ✅ Gauti klaidos būseną
export const selectCategoriesError = (state: RootState) => state.categories.error;

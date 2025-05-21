import { createSlice } from "@reduxjs/toolkit";
import {
  fetchCategories,
  fetchCategoryById,
  fetchCategoryRoutes,
} from "./categoriesThunks";
import { createCommonReducers } from "@/src/utils/extraReducers";
import type { Category } from "@/src/api/generated/models/Category";
import type { Route } from "@/src/store/travelApi";

interface CategoriesState {
  categories: Category[];
  selectedCategory: Category | null;
  categoryRoutes: Route[] | null;
  loading: boolean;
  error: string | null;
}

const initialState: CategoriesState = {
  categories: [],
  selectedCategory: null,
  categoryRoutes: null,
  loading: false,
  error: null,
};

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Bendri pending/fulfilled/rejected handleriai

    // Specifinis data handling
    builder
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.selectedCategory = action.payload;
      })
      .addCase(fetchCategoryRoutes.fulfilled, (state, action) => {
        state.categoryRoutes = action.payload || [];
      });
    createCommonReducers(
      [fetchCategories, fetchCategoryById, fetchCategoryRoutes],
      "categories"
    )(builder);
  },
});

export default categoriesSlice.reducer;

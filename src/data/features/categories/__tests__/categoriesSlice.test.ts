// src/data/features/categories/__tests__/categoriesSlice.test.ts

import { configureStore } from "@reduxjs/toolkit";
import categoriesReducer from "../categoriesSlice";
import * as categoriesThunks from "../categoriesThunks";
import { CategoriesService } from "@/src/api/generated/services/CategoriesService";

// 🧩 Mockinam API servisą
jest.mock("@/src/api/generated/services/CategoriesService", () => ({
  CategoriesService: {
    getCategories: jest.fn(),
    getCategoryById: jest.fn(),
    getCategoryRoutes: jest.fn(),
  },
}));

const createTestStore = () =>
  configureStore({
    reducer: {
      categories: categoriesReducer,
    },
  });

describe("🧩 Categories Slice Unit Test", () => {
  let store: ReturnType<typeof createTestStore>;

  const mockCategories = [
    { id: 1, name: "Test Category 1" },
    { id: 2, name: "Test Category 2" },
  ];

  const mockCategory = { id: 1, name: "Test Category 1" };

  const mockCategoryRoutes = [
    { id: 1, name: "Test Route 1" },
    { id: 2, name: "Test Route 2" },
  ];

  beforeEach(() => {
    store = createTestStore();
    jest.clearAllMocks();
  });

  // ✅ Thunk: fetchCategories pending
  it("should handle fetchCategories pending", () => {
    store.dispatch(categoriesThunks.fetchCategories.pending("requestId123"));
    const state = store.getState().categories;

    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  // ✅ Thunk: fetchCategories fulfilled
  it("should handle fetchCategories fulfilled", () => {
    store.dispatch(categoriesThunks.fetchCategories.fulfilled(mockCategories, "requestId123"));
    const state = store.getState().categories;

    expect(state.loading).toBe(false);
    expect(state.categories).toEqual(mockCategories);
  });

  // ✅ Thunk: fetchCategories rejected
  it("should handle fetchCategories rejected", () => {
    const error = { message: "Fetch categories failed" } as any;

    store.dispatch(categoriesThunks.fetchCategories.rejected(error, "requestId123"));
    const state = store.getState().categories;

    expect(state.loading).toBe(false);
    expect(state.error).toBe("Fetch categories failed");
  });

  // ✅ Thunk: fetchCategoryById fulfilled
  it("should handle fetchCategoryById fulfilled", () => {
    store.dispatch(categoriesThunks.fetchCategoryById.fulfilled(mockCategory, "requestId123", 1));
    const state = store.getState().categories;

    expect(state.selectedCategory).toEqual(mockCategory);
    expect(state.loading).toBe(false);
  });

  // ✅ Thunk: fetchCategoryRoutes fulfilled
  it("should handle fetchCategoryRoutes fulfilled", () => {
    const categoryId = "1"; // categoryId turi būti string
    const perPage = 10;
    const page = 1;
  
    // Atkreipkite dėmesį, kad mes perduodame visą objektą, o ne tik vieną `categoryId`
    store.dispatch(categoriesThunks.fetchCategoryRoutes({
      categoryId,       // Pateikiame categoryId kaip string
      perPage,          // Optional perPage
      page,             // Optional page
    }));
  
    const state = store.getState().categories;
  
    expect(state.categoryRoutes).toEqual(mockCategoryRoutes);
    expect(state.loading).toBe(false);
  });
});

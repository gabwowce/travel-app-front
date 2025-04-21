import { createThunk } from "@/src/utils/createThunk";
import { CategoriesService } from "@/src/api/generated/services/CategoriesService";
import type { CategoryRequest } from "@/src/api/generated/models/CategoryRequest";
import { ExtractData, ExtractList } from "@/src/utils/typeHelpers";

// =============================
// Išgryninti "data" tipai
// =============================

type CategoryList = ExtractData<typeof CategoriesService.getCategories>;
type CategoryDetails = ExtractData<typeof CategoriesService.getCategoryById>;
type NewCategory = ExtractData<typeof CategoriesService.storeCategory>;
type UpdatedCategory = ExtractData<typeof CategoriesService.updateCategory>;
type DeletedCategory = ExtractData<typeof CategoriesService.deleteCategory>;
type CategoryPlaces = ExtractList<typeof CategoriesService.getCategoryPlaces>;
type CategoryRoutes = ExtractList<typeof CategoriesService.getCategoryRoutes>;

/* ======================
 * CATEGORIES THUNKS
 * ====================== */

// Get all categories
export const fetchCategories = createThunk<void, CategoryList>(
  "categories/fetchCategories",
  () => CategoriesService.getCategories().then(response => ({ data: response.data ?? [] }))
);

// Get category by ID
export const fetchCategoryById = createThunk<number, CategoryDetails>(
  "categories/fetchCategoryById",
  (categoryId) =>
    CategoriesService.getCategoryById(categoryId.toString()).then(response => ({
      data: response.data!,
    }))
);



// Create category (admin only)
export const createCategory = createThunk<CategoryRequest, NewCategory>(
  "categories/createCategory",
  (payload) => CategoriesService.storeCategory(payload).then(response => ({ data: response.data! }))
);

// Update category (admin only)
export const updateCategory = createThunk<{ categoryId: string; data: CategoryRequest }, UpdatedCategory>(
  "categories/updateCategory",
  ({ categoryId, data }) => CategoriesService.updateCategory(categoryId, data).then(response => ({ data: response.data! }))
);

// Delete category (admin only)
export const deleteCategory = createThunk<string, DeletedCategory>(
  "categories/deleteCategory",
  (categoryId) => CategoriesService.deleteCategory(categoryId).then(response => ({ data: response.data ?? [] }))
);

// Get places in category (paginated)
export const fetchCategoryPlaces = createThunk<{ categoryId: string; perPage?: number; page?: number }, CategoryPlaces>(
  "categories/fetchCategoryPlaces",
  ({ categoryId, perPage = 15, page = 1 }) =>
    CategoriesService.getCategoryPlaces(categoryId, perPage, page).then(response => ({ data: response.data?.data ?? [] }))
);

// Get routes in category (paginated)
export const fetchCategoryRoutes = createThunk<{ categoryId: string; perPage?: number; page?: number }, CategoryRoutes>(
  "categories/fetchCategoryRoutes",
  ({ categoryId, perPage = 15, page = 1 }) =>
    CategoriesService.getCategoryRoutes(categoryId, perPage, page).then(response => ({ data: response.data?.data ?? [] }))
);

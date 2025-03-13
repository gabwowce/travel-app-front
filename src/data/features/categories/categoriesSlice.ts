import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Category, CategoryDetails, PaginatedRoutesResponse } from "./categoriesTypes";
import { getAllCategories, getCategoryById, getCategoryRoutes } from "./categoriesAPI";

interface CategoriesState {
  categories: Category[];
  selectedCategory: CategoryDetails | null;
  categoryRoutes: PaginatedRoutesResponse | null;
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

// ✅ Gauti visas kategorijas
export const fetchCategories = createAsyncThunk<Category[], void, { rejectValue: string }>(
  "categories/fetchCategories",
  async (_, thunkAPI) => {
    try {
      return await getAllCategories();
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || "Nepavyko gauti kategorijų sąrašo");
    }
  }
);

// ✅ Gauti konkrečios kategorijos duomenis
export const fetchCategoryById = createAsyncThunk<CategoryDetails, number, { rejectValue: string }>(
  "categories/fetchCategoryById",
  async (id, thunkAPI) => {
    try {
      return await getCategoryById(id);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || "Nepavyko gauti kategorijos duomenų");
    }
  }
);

// ✅ Gauti kategorijos maršrutus
export const fetchCategoryRoutes = createAsyncThunk<PaginatedRoutesResponse, { id: number; page: number; per_page: number }, { rejectValue: string }>(
  "categories/fetchCategoryRoutes",
  async ({ id, page, per_page }, thunkAPI) => {
    try {
      return await getCategoryRoutes(id, page, per_page);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || "Nepavyko gauti maršrutų sąrašo");
    }
  }
);

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action: PayloadAction<Category[]>) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Unknown error";
      })
      .addCase(fetchCategoryById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategoryById.fulfilled, (state, action: PayloadAction<CategoryDetails>) => {
        state.loading = false;
        state.selectedCategory = action.payload;
      })
      .addCase(fetchCategoryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Unknown error";
      })
      .addCase(fetchCategoryRoutes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategoryRoutes.fulfilled, (state, action: PayloadAction<PaginatedRoutesResponse>) => {
        state.loading = false;
        state.categoryRoutes = action.payload;
      })
      .addCase(fetchCategoryRoutes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Unknown error";
      });
  },
});

export default categoriesSlice.reducer;

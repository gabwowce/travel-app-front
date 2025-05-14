import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchFavoritesAPI, addFavoriteAPI, removeFavoriteAPI } from "./favoritesAPI";
import { FavoriteRoute } from "./favoritesTypes";

// ✅ Gauti mėgstamus maršrutus
export const fetchFavorites = createAsyncThunk(
  "favorites/fetchFavorites",
  async (_, { rejectWithValue }) => {
    try {
      console.log("🚀 Fetching favorite routes...");
      const response = await fetchFavoritesAPI();
      return response.data.items;
    } catch (error: any) {
      console.error("❌ API request failed:", error);
      return rejectWithValue(error?.message || "Failed to fetch favorites");
    }
  }
);

// ✅ Pridėti į mėgstamus
export const addFavorite = createAsyncThunk(
  "favorites/addFavorite",
  async (routeId: number, { rejectWithValue }) => {
    try {
      await addFavoriteAPI(routeId);
      return routeId; // Grąžiname ID, kad galėtume atnaujinti store
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to add favorite");
    }
  }
);

// ✅ Pašalinti iš mėgstamų
export const removeFavorite = createAsyncThunk(
  "favorites/removeFavorite",
  async (routeId: number, { rejectWithValue }) => {
    try {
      await removeFavoriteAPI(routeId);
      return routeId; // Grąžiname ID, kad pašalintume iš store
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to remove favorite");
    }
  }
);

// ✅ Redux slice
const favoritesSlice = createSlice({
  name: "favorites",
  initialState: {
    items: [] as FavoriteRoute[], // Mėgstamų maršrutų sąrašas
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addFavorite.fulfilled, (state, action) => {
        state.items.push({ id: action.payload } as FavoriteRoute);
      })
      .addCase(removeFavorite.fulfilled, (state, action) => {
        state.items = state.items.filter((route) => route.id !== action.payload);
      });
  },
});

export default favoritesSlice.reducer;

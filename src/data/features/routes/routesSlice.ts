import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getFilteredRoutes, getFeaturedRoutes, getRouteById, getRoutesByCategory, getRoutesByCity } from "@/src/data/features/routes/routesAPI";
import { Route, RouteQueryParams, PaginatedRoutesResponse } from "@/src/data/features/routes/routesTypes";

// Pradinė būsenos reikšmė
interface RoutesState {
  routes: Route[];
  featuredRoutes: Route[];
  selectedRoute: Route | null;
  loading: boolean;
  error: string | null;
}

const initialState: RoutesState = {
  routes: [],
  featuredRoutes: [],
  selectedRoute: null,
  loading: false,
  error: null,
};

// ✅ Gauti visus maršrutus su filtrais
export const fetchRoutes = createAsyncThunk("routes/fetchRoutes", async (params: RouteQueryParams, thunkAPI) => {
  try {
    return await getFilteredRoutes(params);
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message || "Nepavyko gauti maršrutų");
  }
});

// ✅ Gauti rekomenduojamus maršrutus
export const fetchFeaturedRoutes = createAsyncThunk("routes/fetchFeaturedRoutes", async (_, thunkAPI) => {
    try {
      const response = await getFeaturedRoutes();
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || "Nepavyko gauti rekomenduojamų maršrutų");
    }
  });
  

// ✅ Gauti vieną maršrutą pagal ID
export const fetchRouteById = createAsyncThunk("routes/fetchRouteById", async (id: number, thunkAPI) => {
  try {
    return await getRouteById(id);
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message || "Nepavyko gauti maršruto detalių");
  }
});

// ✅ Filtruoti maršrutus pagal kategoriją iš serverio
export const fetchRoutesByCategory = createAsyncThunk(
  "routes/fetchRoutesByCategory",
  async (categoryId: number, thunkAPI) => {
    try {
      return await getRoutesByCategory(categoryId);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || "Nepavyko gauti maršrutų pagal kategoriją");
    }
  }
);

// ✅ Filtruoti maršrutus pagal miestą iš serverio
export const fetchRoutesByCity = createAsyncThunk(
  "routes/fetchRoutesByCity",
  async (cityId: number, thunkAPI) => {
    try {
      return await getRoutesByCity(cityId);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || "Nepavyko gauti maršrutų pagal miestą");
    }
  }
);


const routesSlice = createSlice({
    name: "routes",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchRoutes.pending, (state) => { state.loading = true; })
        .addCase(fetchRoutes.fulfilled, (state, action: PayloadAction<PaginatedRoutesResponse>) => {
          state.loading = false;
          state.routes = action.payload.items;
        })
        .addCase(fetchRoutes.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        })
        
        // ✅ Pridėta logika `fetchRouteById`, kad įrašytų į `selectedRoute`
        .addCase(fetchRouteById.pending, (state) => {
          state.loading = true;
          state.selectedRoute = null;
          state.error = null;
        })
        .addCase(fetchRouteById.fulfilled, (state, action: PayloadAction<Route>) => {
          state.loading = false;
          state.selectedRoute = action.payload;
        })
        .addCase(fetchRouteById.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
          state.selectedRoute = null;
        })
        // Kategorijų filtravimas
        .addCase(fetchRoutesByCategory.pending, (state) => {
          state.loading = true;
        })
        .addCase(fetchRoutesByCategory.fulfilled, (state, action: PayloadAction<PaginatedRoutesResponse>) => {
          state.loading = false;
          state.routes = action.payload.items; // 🔹 Perrašome tik reikiamus maršrutus
        })
        .addCase(fetchRoutesByCategory.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        })

        // Miestų filtravimas
        .addCase(fetchRoutesByCity.pending, (state) => {
          state.loading = true;
        })
        .addCase(fetchRoutesByCity.fulfilled, (state, action: PayloadAction<PaginatedRoutesResponse>) => {
          state.loading = false;
          state.routes = action.payload.items;
        })
        .addCase(fetchRoutesByCity.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        });
    },
  });
  
  

export default routesSlice.reducer;

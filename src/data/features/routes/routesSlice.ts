import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getFilteredRoutes, getFeaturedRoutes, getRouteById, getRoutesByCategory, getRoutesByCity } from "@/src/data/features/routes/routesAPI";
import { Route, RouteQueryParams, PaginatedRoutesResponse } from "@/src/data/features/routes/routesTypes";

// Pradinė būsenos reikšmė
interface RoutesState {
  routes: Route[];
  featuredRoutes: Route[];
  selectedRoute: Route | null;
  loading: boolean;
  error: any | null;
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
    const response = await getFilteredRoutes(params);
    return response;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message || "Failed to fetch routes");
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
export const fetchRoutesByCategory = createAsyncThunk<PaginatedRoutesResponse, number>(
  "routes/fetchRoutesByCategory",
  async (categoryId, thunkAPI) => {
    try {
      return await getRoutesByCategory(categoryId);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || "Nepavyko gauti maršrutų pagal kategoriją");
    }
  }
);

export const fetchRoutesByCity = createAsyncThunk<PaginatedRoutesResponse, number>(
  "routes/fetchRoutesByCity",
  async (cityId, thunkAPI) => {
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
    reducers: {
      clearRoutes: (state) => {
        state.routes = []; // ✅ Išvalome maršrutus
      },
      clearSelectedRoute: (state) => {
        state.selectedRoute = null;
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchFeaturedRoutes.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchFeaturedRoutes.fulfilled, (state, action) => {
          console.log("FETCHED ROUTES PAYLOAD:", action.payload); // 👈 pridėk
          state.loading = false;
          state.featuredRoutes = action.payload; // gal reikia action.payload.data?
        })
        
        .addCase(fetchFeaturedRoutes.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
        .addCase(fetchRoutes.pending, (state) => { state.loading = true; })
        .addCase(fetchRoutes.fulfilled, (state, action) => {
          state.loading = false;
          state.routes = action.payload.data;
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
          state.routes = action.payload.data; // 🔹 Perrašome tik reikiamus maršrutus
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
          state.routes = action.payload.data;
        })
        .addCase(fetchRoutesByCity.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        });
    },
  });
  
  
export const { clearRoutes } = routesSlice.actions;
export default routesSlice.reducer;

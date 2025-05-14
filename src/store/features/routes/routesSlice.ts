import { createSlice } from "@reduxjs/toolkit";
import {
  fetchRoutes,
  fetchFeaturedRoutes,
  fetchRouteById
} from "./routesThunks";
import { createCommonReducers } from "@/src/utils/extraReducers";
import type { Route } from "@/src/api/generated/models/Route";

interface RoutesState {
  routes: Route[];
  featuredRoutes: Route[];
  selectedRoute: Route | null;
  loading: boolean;
  error: string | null;
  isEmptyResults: boolean;
}

const initialState: RoutesState = {
  routes: [],
  featuredRoutes: [],
  selectedRoute: null,
  loading: false,
  error: null,
  isEmptyResults: false,
};

const routesSlice = createSlice({
  name: "routes",
  initialState,
  reducers: {
    clearRoutes(state) {
      state.routes = [];
    },
    clearSelectedRoute(state) {
      state.selectedRoute = null;
      state.isEmptyResults = false;
    },
  },
  extraReducers: (builder) => {


    builder
      .addCase(fetchRoutes.fulfilled, (state, action) => {
        state.routes = action.payload || [];
        state.isEmptyResults = action.payload?.length === 0;
      })

      .addCase(fetchFeaturedRoutes.fulfilled, (state, action) => {
        state.featuredRoutes = action.payload;
      })

      .addCase(fetchRouteById.fulfilled, (state, action) => {
        state.selectedRoute = action.payload;
      })

      createCommonReducers(
        [fetchRoutes, fetchFeaturedRoutes, fetchRouteById],
        "routes"
      )(builder);
  },
});

export const { clearRoutes, clearSelectedRoute } = routesSlice.actions;
export default routesSlice.reducer;

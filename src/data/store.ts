import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import routesReducer from "./features/routes/routesSlice";

import categoriesReducer from "@/src/data/features/categories/categoriesSlice";
import tourReducer from "@/src/data/features/tours/tourSlice";
import placesReducer from "@/src/data/features/places/placesSlice";
import filtersReducer from "@/src/data/features/filters/filtersSlice";
import { travelApi } from '../store/travelApi'; 
export const store = configureStore({
  reducer: {
    auth: authReducer,
    routes: routesReducer,
    categories: categoriesReducer,
    tour: tourReducer,
    places: placesReducer,
    filters: filtersReducer,
    [travelApi.reducerPath]: travelApi.reducer,
  },

  middleware: (gDM) => gDM().concat(travelApi.middleware), // įdedam middleware
  
});

// ✅ Teisingai nustatome `AppDispatch` ir `RootState`
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import routesReducer from "./features/routes/routesSlice";
import userReducer from "./features/user/userSlice";
import favoritesReducer from "@/src/data/features/favorites/favoritesSlice"; 
import countryReducer from "@/src/data/features/countries/countriesSlice";
import categoriesReducer from "@/src/data/features/categories/categoriesSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    routes: routesReducer,
    user: userReducer,
    favorites: favoritesReducer,
    countries: countryReducer,
    categories: categoriesReducer,
  },
  
});

// ✅ Teisingai nustatome `AppDispatch` ir `RootState`
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

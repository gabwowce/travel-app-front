import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import routesReducer from "./features/routes/routesSlice";
import userReducer from "./features/user/userSlice";
import favoritesReducer from "@/src/data/features/favorites/favoritesSlice"; // ✅ Pridėtas

export const store = configureStore({
  reducer: {
    auth: authReducer,
    routes: routesReducer,
    user: userReducer,
    favorites: favoritesReducer,
  },
  
});

// ✅ Teisingai nustatome `AppDispatch` ir `RootState`
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

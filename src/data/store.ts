import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import routesReducer from "./features/routes/routesSlice";
import userReducer from "./features/user/userSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    routes: routesReducer,
    user: userReducer,

  },
  
});

// ✅ Teisingai nustatome `AppDispatch` ir `RootState`
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

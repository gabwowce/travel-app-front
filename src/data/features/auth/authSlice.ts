import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AuthResponse } from "@/src/api/generated/models/AuthResponse";
import type { UserResponse } from "@/src/api/generated/models/UserResponse";
import { initAuth, login, logout, register } from "./authThunks";
import { createCommonReducers } from "@/src/utils/extraReducers";

type AuthState = {
  isAuthenticated: boolean;
  loading: boolean;
  errors: Record<string, string[]> | any;
  token: string | null;
  user: UserResponse | null;
};

const initialState: AuthState = {
  isAuthenticated: false,
  loading: false,
  errors: {},
  token: null,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserFromStorage: (state, action: PayloadAction<{ user: UserResponse; token: string }>) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    clearErrors: (state) => {
      state.errors = {};
    },
  },
  
  extraReducers: (builder) => {
   
    builder
      .addCase(initAuth.fulfilled, (state, action) => {
        state.loading = false;
        const { token, user } = action.payload;
        if (token && user) {
          state.isAuthenticated = true;
          state.token = token;
          state.user = user;
        }
      })
      .addCase(initAuth.rejected, (state) => {
        state.isAuthenticated = false;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.loading = false;
        state.token = action.payload.token || null;
        state.user = action.payload.user || null;
      })
      
      .addCase(login.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.loading = false;
        state.token = action.payload.token || null;
        state.user = action.payload.user || null;
      })
      .addCase(register.rejected, (state, action) => {
        state.isAuthenticated = false;
      })

      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
        state.errors = {};
      });
      createCommonReducers(
        [initAuth, login, register, logout],
        "auth"
      )(builder);
  },
});

export const { setUserFromStorage, clearErrors } = authSlice.actions;
export default authSlice.reducer;

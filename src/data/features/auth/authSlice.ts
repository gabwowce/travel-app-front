// src/data/features/auth/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initAuth } from "./authThunks";
import { travelApi } from "@/src/store/travelApi";

type AuthState = {
  token: string | null;
  user: any | null;
  isAuthenticated: boolean;
  loading: boolean;
  errors: Record<string, string> | null;
};

const initialState: AuthState = {
  token: null,
  user: null,
  isAuthenticated: false,
  loading: false,
  errors: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; user: any }>
    ) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.errors = null;
    },
    clearAuth: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.errors = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setErrors: (state, action: PayloadAction<Record<string, string>>) => {
      state.errors = action.payload;
    },
    clearErrors: (state) => {
      state.errors = null;
    },
    setUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initAuth.pending, (st) => {
        st.loading = true;
      })
      .addCase(initAuth.fulfilled, (st) => {
        st.loading = false;
      })
      .addCase(initAuth.rejected, (st) => {
        st.loading = false;
        st.isAuthenticated = false;
      });
    builder.addMatcher(
      travelApi.endpoints.loginUser.matchFulfilled,
      (state, { payload }) => {
        // payload: LoginUserApiResponse
        const token = payload.data?.token;
        const user = payload.data?.user;

        if (token && user) {
          state.token = token;
          state.user = user;
          state.isAuthenticated = true;
        } else {
          // jeigu API grąžino unexpected formatą – pasaugomės
          state.token = null;
          state.user = null;
          state.isAuthenticated = false;
        }
      }
    );

    // ⬇️ LOGOUT → clearAuth
    builder.addMatcher(
      travelApi.endpoints.logoutUser.matchFulfilled,
      (state) => {
        state.token = null;
        state.user = null;
        state.isAuthenticated = false;
      }
    );
  },
});

export const { setCredentials, clearAuth, setLoading, setErrors, clearErrors } =
  authSlice.actions;

export default authSlice.reducer;

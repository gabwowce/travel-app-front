import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ token: string; user: any }>) => {
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
  },
  extraReducers:(builder)=>{
    builder
      .addCase(initAuth.pending,   (st) => { st.loading = true;  })
      .addCase(initAuth.fulfilled, (st) => { st.loading = false; })
      .addCase(initAuth.rejected,  (st) => { st.loading = false; st.isAuthenticated = false; });

    // jei turi login/logout thunk’us, pridėk juos taip pat
    builder
      .addCase(login.pending,   (st) => { st.loading = true;  })
      .addCase(login.fulfilled, (st) => { st.loading = false; })
      .addCase(login.rejected,  (st) => { st.loading = false; });

    // arba vietoj viso šito — naudok utilį:
   // createCommonReducers([initAuth, login, logout], "auth")(builder);
  }
});

export const { setCredentials, clearAuth, setLoading, setErrors, clearErrors } = authSlice.actions;
export default authSlice.reducer;

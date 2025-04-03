import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loginUser, registerUser, logoutUser } from "@/src/data/features/auth/authAPI";
import { AuthState, LoginPayload, RegisterPayload, LoginResponse, User, AuthErrors } from "@/src/data/features/auth/authTypes";
import { parseApiErrors } from "@/src/utils/parseApiErrors";

const initialState: AuthState = {
  isAuthenticated: false,
  loading: false,
  errors: {} as AuthErrors, 
  token: null,
  user: null, 
};

const handleAuthThunk = async (
  apiFunc: (data: any) => Promise<any>,
  data: any,
  { rejectWithValue }: any
) => {
  try {
    console.log("🔵 Sending request with data:", data);
    const response = await apiFunc(data);
    return response;
  } catch (error: any) {
    // ⏺️ Log klaidą jei reikia
    console.log("📌 Full error object:", JSON.stringify(error, null, 2));
    // await writeLog("AuthThunkError", error); // jei log'uojam į failą

    // ✅ Naudojam utils
    const parsedErrors = parseApiErrors(error);

    console.log("🛑 Parsed errors:", JSON.stringify(parsedErrors, null, 2));
    return rejectWithValue(parsedErrors);
  }
};


export const initAuth = createAsyncThunk("auth/initAuth", async (_, thunkAPI) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const userStr = await AsyncStorage.getItem("user");
    if (!token || !userStr) {
      return { token: null, user: null };
    }
    const user = JSON.parse(userStr);
    // ...jei reikia, patikriname token galiojimą
    return { token, user };
  } catch (err) {
    // Nepavyko, tiesiog grįžtame su null
    return { token: null, user: null };
  }
});




// ✅ Async thunk prisijungimui
export const login = createAsyncThunk<LoginResponse, LoginPayload, { rejectValue: string }>(
  "auth/login",
  (data, thunkAPI) => handleAuthThunk(loginUser, data, thunkAPI)
);

// ✅ Async thunk registracijai
export const register = createAsyncThunk<LoginResponse, RegisterPayload, { rejectValue: string }>(
  "auth/register",
  (data, thunkAPI) => handleAuthThunk(registerUser, data, thunkAPI)
);

// ✅ Async thunk atsijungimui
export const logout = createAsyncThunk("auth/logout", async () => {
  await logoutUser();
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserFromStorage: (state, action: PayloadAction<{ user: User; token: string }>) => {
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
      .addCase(initAuth.pending, (state) => {
        state.loading = true; 
      })
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
        state.loading = false;
        state.isAuthenticated = false;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.errors = {};
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
        state.isAuthenticated = true;
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        console.log("❌ Login failed, resetting auth state...");
        console.log("  - action.payload:", action.payload);
        state.loading = false;
        state.errors = action.payload || {};
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
      })
      
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.errors = {};
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
        state.isAuthenticated = true;
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.errors = action.payload || {};
        state.isAuthenticated = false;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
        state.errors = {};
      });
  },
});

export const { setUserFromStorage, clearErrors  } = authSlice.actions; // ✅ Veiksmas, kuris užkrauna vartotoją iš AsyncStorage
export default authSlice.reducer;

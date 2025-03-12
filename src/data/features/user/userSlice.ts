import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getUserProfile, updateUserProfile, getUserFavorites, getUserRatings } from "@/src/data/features/user/userAPI";
import { UserState, UserResponse, FavoritesResponse, RatingsResponse, UpdateUserPayload, User } from "@/src/data/features/user/userTypes";

import { apiRequest } from "@/src/data/apiService";

const initialState: UserState = {
  user: null,
  favorites: [],
  ratings: [],
  loading: false,
  error: null,
};

const handleUserThunk = async (
  { rejectWithValue }: any,
  apiFunc: (data: any) => Promise<any>,
  data: any = null
) => {
  try {
    console.log("🔵 Sending request with data:", data);
    const response = await apiFunc(data);
    return response;
  } catch (error: any) {
    console.log("📌 Full error object:", JSON.stringify(error, null, 2));

    const errorMessage = error.message;
    const errorData = error?.errors || error?.data?.errors || error?.data?.data?.errors || null;

    let errors: Record<string, string> = {};
    if (errorData) {
      console.log("📌 Extracted validation errors:", JSON.stringify(errorData, null, 2));
      Object.keys(errorData).forEach((field) => {
        errors[field] = errorData[field][0];
      });
    }

    const generalError = error?.data?.message || errorMessage || "";
    errors.general = generalError;
    
    console.log("🛑 Final processed errors:", JSON.stringify(errors, null, 2));
    return rejectWithValue(errors);
  }
};

export const fetchUserProfile = createAsyncThunk<User, void>(
  "user/fetchProfile",
  async (_, thunkAPI) => {
    try {
      const user = await getUserProfile();
      return user; // Grąžinam patį User
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || "Nepavyko gauti vartotojo duomenų");
    }
  }
);




export const updateUser = createAsyncThunk(
  "user/updateUser",
  async (userData: Partial<{ name: string; email: string; password: string; password_confirmation: string; profile: { bio: string; location: string; website: string } }>, { rejectWithValue }) => {
    try {
      return await apiRequest("/api/v1/user", "PUT", userData);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchUserFavorites = createAsyncThunk("user/fetchFavorites", (_, thunkAPI) =>
  handleUserThunk(thunkAPI, getUserFavorites)
);

export const fetchUserRatings = createAsyncThunk("user/fetchRatings", (_, thunkAPI) =>
  handleUserThunk(thunkAPI, getUserRatings)
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetUser: (state) => {
      state.user = null;
      state.favorites = [];
      state.ratings = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; // Tiesiogiai priskiriam user
      })
        
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<UserResponse>) => {
        state.user = action.payload.data.user;
      })
      .addCase(fetchUserFavorites.fulfilled, (state, action: PayloadAction<FavoritesResponse>) => {
        state.favorites = action.payload.data.items;
      })
      .addCase(fetchUserRatings.fulfilled, (state, action: PayloadAction<RatingsResponse>) => {
        state.ratings = action.payload.data.items;
      });
  },
});

export const { resetUser } = userSlice.actions;
export default userSlice.reducer;
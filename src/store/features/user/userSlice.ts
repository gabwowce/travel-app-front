// import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
// import { getUserProfile, updateUserProfile, getUserFavorites, getUserRatings } from "@/src/data/features/user/userAPI";
// import { UserState, UserResponse, FavoritesResponse, RatingsResponse, UpdateUserPayload, User } from "@/src/data/features/user/userTypes";
// import { parseApiErrors } from "@/src/api/parseApiErrors"; 
// import { apiRequest } from "@/src/api/apiService";

// const initialState: UserState = {
//   user: null,
//   favorites: [],
//   ratings: [],
//   loading: false,
//   error: null,
// };



// const handleUserThunk = async (
//   { rejectWithValue }: any,
//   apiFunc: (data: any) => Promise<any>,
//   data: any = null
// ) => {
//   try {
//     console.log("🔵 Sending request with data:", data);
//     const response = await apiFunc(data);
//     return response;
//   } catch (error: any) {
//     console.log("📌 Full error object:", JSON.stringify(error, null, 2));
    
//     const parsedErrors = parseApiErrors(error);

//     console.log("🛑 Final parsed errors:", JSON.stringify(parsedErrors, null, 2));
//     return rejectWithValue(parsedErrors);
//   }
// };

// export const fetchUserProfile = createAsyncThunk<User, void>(
//   "user/fetchProfile",
//   async (_, thunkAPI) => {
//     try {
//       const user = await getUserProfile();
//       console.log("🛑 user:", user); 
//       return user;
//     } catch (error: any) {
//       return thunkAPI.rejectWithValue(error.message || "Nepavyko gauti vartotojo duomenų");
//     }
//   }
// );





// export const updateUser = createAsyncThunk(
//   "user/updateUser",
//   async (userData: UpdateUserPayload, thunkAPI) =>
//     handleUserThunk(thunkAPI, updateUserProfile, userData)
// );


// export const fetchUserFavorites = createAsyncThunk("user/fetchFavorites", (_, thunkAPI) =>
//   handleUserThunk(thunkAPI, getUserFavorites)
// );

// export const fetchUserRatings = createAsyncThunk("user/fetchRatings", (_, thunkAPI) =>
//   handleUserThunk(thunkAPI, getUserRatings)
// );

// const userSlice = createSlice({
//   name: "user",
//   initialState,
//   reducers: {
//     resetUser: (state) => {
//       state.user = null;
//       state.favorites = [];
//       state.ratings = [];
//       state.error = null;
//     },
//     setUser: (state, action: PayloadAction<User>) => {
//       state.user = action.payload;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchUserProfile.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(fetchUserProfile.fulfilled, (state, action) => {
//         state.loading = false;
//         state.user = action.payload; 
//       })
        
//       .addCase(fetchUserProfile.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })
//       .addCase(updateUser.fulfilled, (state, action: PayloadAction<UserResponse>) => {
//         state.user = action.payload.data.user;
//       })
//       .addCase(fetchUserFavorites.fulfilled, (state, action: PayloadAction<FavoritesResponse>) => {
//         state.favorites = action.payload.data.items;
//       })
//       .addCase(fetchUserRatings.fulfilled, (state, action: PayloadAction<RatingsResponse>) => {
//         state.ratings = action.payload.data.items;
//       });
//   },
// });

// export const { resetUser, setUser } = userSlice.actions;
// export default userSlice.reducer;
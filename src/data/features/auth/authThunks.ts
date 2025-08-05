// src/data/features/auth/authThunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import * as SecureStore from "expo-secure-store";
import { setCredentials, clearAuth } from "./authSlice";
import { travelApi } from "@/src/store/travelApi";

// 1) jei nieko negrąžini – naudok <void, void>
export const initAuth = createAsyncThunk<void, void>(
  "auth/init",
  async (_, thunkAPI) => {
    try {
      const token = await SecureStore.getItemAsync("token");
      const userJson = await SecureStore.getItemAsync("user");
      if (!token || !userJson) throw new Error("Token or user not found");

      const user = JSON.parse(userJson);
      thunkAPI.dispatch(setCredentials({ token, user }));

      // 2) getCurrentUser neturi parametrų → .initiate() be {}
      const result = await thunkAPI.dispatch(
        travelApi.endpoints.getCurrentUser.initiate()
      );

      if ("error" in result) throw new Error("Token invalid");
    } catch (err) {
      await SecureStore.deleteItemAsync("token");
      await SecureStore.deleteItemAsync("user");
      thunkAPI.dispatch(clearAuth());
      // čia gali grąžinti rejectWithValue, jei reikia
    }
  }
);

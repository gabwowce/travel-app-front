import { createAsyncThunk } from '@reduxjs/toolkit';
import * as SecureStore from 'expo-secure-store';
import { setCredentials, clearAuth } from './authSlice';
import { travelApi } from '@/src/store/travelApi';

export const initAuth = createAsyncThunk('auth/init', async (_, thunkAPI) => {
  try {
    const token = await SecureStore.getItemAsync('token');
    const userJson = await SecureStore.getItemAsync('user');

    if (!token || !userJson) throw new Error('Token or user not found');

    const user = JSON.parse(userJson);
    thunkAPI.dispatch(setCredentials({ token, user }));

    // Optionally, validate token via /auth/me
    const result = await thunkAPI.dispatch(
      travelApi.endpoints.getCurrentUser.initiate({})
    );

    if ('error' in result) throw new Error('Token invalid');

    return;
  } catch (err) {
    await SecureStore.deleteItemAsync('token');
    await SecureStore.deleteItemAsync('user');
    thunkAPI.dispatch(clearAuth());
  }
});

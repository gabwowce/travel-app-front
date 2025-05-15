// src/data/features/auth/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { UserResponse } from '@/src/api/generated/models/UserResponse';
import { useAppSelector } from '../../hooks';

type AuthState = { token: string|null; user: UserResponse|null; };
const initialState: AuthState = { token: null, user: null };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (s, a: PayloadAction<AuthState>) => Object.assign(s, a.payload),
    clearAuth:      (s) => { s.token = null; s.user = null; },
  },
});
export const { setCredentials, clearAuth } = authSlice.actions;
export default authSlice.reducer;

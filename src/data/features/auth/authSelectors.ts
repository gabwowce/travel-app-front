import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "@/src/data/store";

// Gauti visą auth būseną
export const selectAuthState = (state: RootState) => state.auth;

// Ar vartotojas autentifikuotas?
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;

// Gauti vartotojo informaciją
export const selectUser = (state: RootState) => state.auth.user;

// Gauti vartotojo tokeną
export const selectAuthToken = (state: RootState) => state.auth.token;

// Gauti ar kraunasi autentifikacijos procesas
export const selectAuthLoading = (state: RootState) => state.auth.loading;

// Gauti autentifikacijos klaidas
export const selectAuthErrors = (state: RootState) => state.auth.errors;


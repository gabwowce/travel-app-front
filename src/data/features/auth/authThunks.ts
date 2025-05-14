import { createThunk } from "@/src/utils/createThunk";
import { AuthenticationService } from "@/src/api/generated/services/AuthenticationService";
import type { LoginRequest } from "@/src/api/generated/models/LoginRequest";
import type { RegisterRequest } from "@/src/api/generated/models/RegisterRequest";
import type { UserResponse } from "@/src/api/generated/models/UserResponse";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ExtractData, ExtractList } from "@/src/utils/typeHelpers";
import { OpenAPI } from "@/src/api/generated/core/OpenAPI";


// =============================
// Išgryninti "data" tipai
// =============================

type RegisterData = ExtractData<typeof AuthenticationService.registerUser>;
type LoginData = ExtractData<typeof AuthenticationService.loginUser>;
type LogoutData = ExtractData<typeof AuthenticationService.logoutUser>;
type CurrentUserData = ExtractData<typeof AuthenticationService.getCurrentUser>;

/* ======================
 * AUTHENTICATION THUNKS
 * ====================== */

// INIT AUTH
export const initAuth = createThunk<void, { token: string | null; user: UserResponse | null }>(
  "auth/initAuth",
  async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const userStr = await AsyncStorage.getItem("user");

      if (!token || !userStr) {
        return { data: { token: null, user: null } };
      }

      const user = JSON.parse(userStr) as UserResponse;
      return { data: { token, user } };
    } catch {
      return { data: { token: null, user: null } };
    }
  },
  { log: false }
);

// REGISTER
export const register = createThunk<RegisterRequest, RegisterData>(
  "auth/register",
  (data) => AuthenticationService.registerUser(data).then(response => ({ data: response.data })),
  { handleAuth: true }
);

// LOGIN
export const login = createThunk<LoginRequest, LoginData>(
  "auth/login",
  (data) => AuthenticationService.loginUser(data).then(response => ({ data: response.data })),
  { handleAuth: true }
);

// LOGOUT
export const logout = createThunk<void, LogoutData>(
  "auth/logout",
  () => AuthenticationService.logoutUser().then(response => ({ data: response.data ?? {} })),
  { log: false }
);

// GET CURRENT USER
export const getCurrentUser = createThunk<void, CurrentUserData>(
  "auth/getCurrentUser",
  () => AuthenticationService.getCurrentUser().then(response => ({ data: response.data }))
);

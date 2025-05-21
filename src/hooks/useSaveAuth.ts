import { useCallback } from "react";
import * as SecureStore from "expo-secure-store";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/src/data/features/auth/authSlice";

type AuthData = {
  token: string;
  user: any;
};

export function useSaveAuth() {
  const dispatch = useDispatch();

  const saveAuth = useCallback(async ({ token, user }: AuthData) => {
    try {
      await SecureStore.setItemAsync("token", token);
      await SecureStore.setItemAsync("user", JSON.stringify(user));
      dispatch(setCredentials({ token, user }));
    } catch (error) {
      console.error("❌ Failed to save auth:", error);
    }
  }, [dispatch]);

  return saveAuth;
}

import { useCallback } from "react";
import { useSaveAuth } from "./useSaveAuth";
import {
  useLoginUserMutation,
  useRegisterUserMutation,
} from "@/src/store/travelApi";

export function useAuthActions() {
  const saveAuth = useSaveAuth();
  const [loginUserMutation] = useLoginUserMutation();
  const [registerUserMutation] = useRegisterUserMutation();

  const login = useCallback(
    async (payload: any) => {
      const response = await loginUserMutation(payload).unwrap();
      const token = response.data?.token;
      const user = response.data?.user;

      if (!token || !user) throw new Error("Token or user missing in response");

      await saveAuth({ token, user });
      return response;
    },
    [loginUserMutation, saveAuth]
  );

  const register = useCallback(
    async (payload: any) => {
      const response = await registerUserMutation(payload).unwrap();
      const token = response.data?.token;
      const user = response.data?.user;

      if (!token || !user) throw new Error("Token or user missing in response");

      await saveAuth({ token, user });
      return response;
    },
    [registerUserMutation, saveAuth]
  );

  return { login, register };
}

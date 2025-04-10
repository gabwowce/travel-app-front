import { createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { parseApiErrors } from "@/src/api/parseApiErrors";

type ApiFunction<RequestArgs, ResponseData> = (args: RequestArgs) => Promise<{ data?: ResponseData }>;

// Universalus thunk generatorius
export function createThunk<RequestArgs, ResponseData>(
  typePrefix: string,
  apiFunc: ApiFunction<RequestArgs, ResponseData>,
  options?: {
    log?: boolean;
    handleAuth?: boolean;
  }
) {
  return createAsyncThunk<ResponseData, RequestArgs, { rejectValue: string }>(
    typePrefix,
    async (args, thunkAPI) => {
      const { log = true, handleAuth = false } = options || {};

      try {
        if (log) {
          console.log(`🔵 [Thunk] Sending request: ${typePrefix}`, args);
        }

        const response = await apiFunc(args);

        if (log) {
          console.log(`✅ [Thunk] Response for: ${typePrefix}`, response);
        }

        // Jei auth endpoint, išsaugom token ir user į AsyncStorage
        if (handleAuth && response.data && typeof response.data === "object") {
          const token = (response.data as any)?.token;
          const user = (response.data as any)?.user;

          if (token && user) {
            await AsyncStorage.setItem("token", token);
            await AsyncStorage.setItem("user", JSON.stringify(user));
          }
        }

        if (!response.data) {
          throw new Error("No data in response");
        }

        return response.data;
      } catch (error: any) {
        if (log) {
          console.error(`🛑 [Thunk] Error in: ${typePrefix}`, JSON.stringify(error, null, 2));
        }

        const parsedErrors = parseApiErrors(error);
        const errorMessage = Array.isArray(parsedErrors.message)
                ? parsedErrors.message.join(", ")
                : parsedErrors.message || "Unknown error";

        return thunkAPI.rejectWithValue(errorMessage);
      }
    }
  );
}

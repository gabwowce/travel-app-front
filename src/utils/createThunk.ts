/* ────────────────────────────────────────────────────────
   src/utils/createThunk.ts
   Universalus thunk generatorius su teisingu reject typu.
   ──────────────────────────────────────────────────────── */
   import { createAsyncThunk } from "@reduxjs/toolkit";
   import AsyncStorage from "@react-native-async-storage/async-storage";
   import { ParsedError, parseApiErrors } from "@/src/api/parseApiErrors";
   
   type ApiFn<Req, Res> = (args: Req) => Promise<{ data?: Res }>;
   
   export function createThunk<Req, Res>(
     typePrefix: string,
     apiFunc: ApiFn<Req, Res>,
     opts?: { log?: boolean; handleAuth?: boolean }
   ) {
     return createAsyncThunk<
       Res,                                   // fulfilled payload
       Req,                                   // arguments
       { rejectValue: ParsedError }           // rejected payload
     >(typePrefix, async (args, thunkAPI) => {
       const { log = true, handleAuth = false } = opts ?? {};
   
       try {
         log && console.log(`🔵 [Thunk] Request → ${typePrefix}`, args);
   
         const res = await apiFunc(args);
   
         log && console.log(`✅ [Thunk] Response ← ${typePrefix}`, res);
   
         if (!res.data) throw new Error("No data in response");
   
         /* Jei auth – saugom token & user */
         if (handleAuth && typeof res.data === "object") {
           const { token, user } = res.data as any;
           if (token && user) {
             await AsyncStorage.multiSet([
               ["token", token],
               ["user", JSON.stringify(user)],
             ]);
           }
         }
   
         return res.data;
       } catch (error) {
         log &&
           console.error(
             `🛑 [Thunk] Error in: ${typePrefix}`,
             JSON.stringify(error, null, 2)
           );
   
         const parsed = parseApiErrors(error);
         return thunkAPI.rejectWithValue(parsed);
       }
     });
   }
   
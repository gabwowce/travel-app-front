/* ────────────────────────────────────────────────────────
   src/api/parseApiErrors.ts
   Vienintelė vieta, kur „išverčiam“ API klaidas į bendrą
   { message, errors? } formatą.
   ──────────────────────────────────────────────────────── */
   import { ApiError } from "@/src/api/generated/core/ApiError";

   export interface ParsedError {
     message: string;
     errors?: Record<string, string[]>;
   }
   
   export function parseApiErrors(err: unknown): ParsedError {
     // Laravel 422
     if (err instanceof ApiError && err.body?.errors) {
       return { message: err.body.message, errors: err.body.errors };
     }
   
     // Laravel 401, 403, 404…
     if (err instanceof ApiError && err.body?.message) {
       return { message: err.body.message };
     }
   
     // Fallback
     const message =
       typeof err === "object" && err !== null && "message" in err
         ? (err as any).message
         : "Unknown error";
   
     return { message };
   }
   
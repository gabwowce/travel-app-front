// src/store/emptyApi.ts
import { ENV } from "@/src/config/env";
import type { RootState } from "@/src/data/store";
import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";

/* -------------------------------------------------------
 * Helpers: valymas ir URL „dezinfekcija“
 * ----------------------------------------------------- */
type AnyParams = Record<string, unknown>;

const isNil = (v: unknown) => v === undefined || v === null;
const isEmptyString = (v: unknown) => typeof v === "string" && v.trim() === "";

/** Pašalina undefined/null/"" iš params (vienas lygis) */
export function cleanParams(params?: AnyParams | null): AnyParams | undefined {
  if (!params) return undefined;
  const cleaned = Object.fromEntries(
    Object.entries(params).filter(([, v]) => !isNil(v) && !isEmptyString(v))
  );
  return Object.keys(cleaned).length ? cleaned : undefined;
}

/** Iš URL pašalina ?x=undefined&y=null&z= (jei kas nors konstruoja ranka) */
export function stripUndefinedFromUrl(url: string): string {
  const qIdx = url.indexOf("?");
  if (qIdx === -1) return url;
  const base = url.slice(0, qIdx);
  const qs = url.slice(qIdx + 1);
  const sp = new URLSearchParams(qs);
  [...sp.keys()].forEach((k) => {
    const v = sp.get(k);
    if (v === "undefined" || v === "null" || v === "") sp.delete(k);
  });
  const out = sp.toString();
  return out ? `${base}?${out}` : base;
}

/** Saugiai suformuoja query stringą logams (koercina į string) */
function toQueryString(p?: AnyParams) {
  if (!p) return "";
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(p)) {
    sp.append(k, String(v));
  }
  const out = sp.toString();
  return out ? `?${out}` : "";
}

/* -------------------------------------------------------
 * Raw baseQuery su auth + Accept
 * ----------------------------------------------------- */
const rawBaseQuery = fetchBaseQuery({
  baseUrl: ENV?.API_BASE_URL ?? "https://travelapp.prus.dev/api/v1",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth?.token;
    if (token) headers.set("Authorization", `Bearer ${token}`);
    headers.set("Accept", "application/json");
    return headers;
  },
});

/* -------------------------------------------------------
 * Globalus wrapperis: išvalo params + url ir su-log’ina
 * ----------------------------------------------------- */
export const cleanLoggingBaseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extra) => {
  let cleanedArgs: string | FetchArgs;

  if (typeof args === "string") {
    cleanedArgs = stripUndefinedFromUrl(args);
  } else {
    const { url, params, ...rest } = args;
    cleanedArgs = {
      url: stripUndefinedFromUrl(url),
      params: cleanParams(params as AnyParams),
      ...rest,
    };
  }

  if (__DEV__) {
    const fullUrl =
      typeof cleanedArgs === "string"
        ? cleanedArgs
        : `${cleanedArgs.url}${toQueryString(
            cleanedArgs.params as AnyParams | undefined
          )}`;
    console.log(`[RTK-Query] ${api.endpoint} → ${fullUrl}`);
  }

  return rawBaseQuery(cleanedArgs as any, api, extra);
};

/* -------------------------------------------------------
 * Bendras API „bazė“ – naudok injectEndpoints
 * ----------------------------------------------------- */
export const emptySplitApi = createApi({
  baseQuery: cleanLoggingBaseQuery,
  endpoints: () => ({}),
  // Rekomenduojami globalūs nustatymai:
  // refetchOnFocus: false,
  // refetchOnReconnect: false,
});

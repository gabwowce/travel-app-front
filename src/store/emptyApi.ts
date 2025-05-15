// src/store/emptyApi.ts
import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchBaseQueryError,
  type FetchArgs,          // ← šitas turi url / params / method / body
} from '@reduxjs/toolkit/query/react';
import type { RootState } from '@/src/data/store';

/* 1. Neapdorotas bazinis fetch’as */
const rawBaseQuery = fetchBaseQuery({
  baseUrl: 'https://travelapp.prus.dev',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    console.log("✅ INIT AUTH: ",token);
    if (token) headers.set('Authorization', `Bearer ${token}`);
    headers.set('Accept', 'application/json');
    return headers;
  },
});

/* 2. Wrapperis, kuris log’ina URL */
const loggingBaseQuery: BaseQueryFn<
  string | FetchArgs,              // ← taisyta čia
  unknown,
  FetchBaseQueryError
> = async (args, api, extra) => {
  // išsiskaičiuojame pilną URL tik ekrane rodyti
  const url =
    typeof args === 'string'
      ? args
      : `${args.url}${
          args.params
            ? '?' + new URLSearchParams(args.params as Record<string, string>)
            : ''
        }`;

  if (__DEV__) {
    console.log(`[RTK‑Query] ${api.endpoint} → ${url}`);
  }

  // perduodame tikrąją užklausą toliau
  return rawBaseQuery(args, api, extra);
};

/* 3. createApi su mūsų wrapperiu */
export const emptySplitApi = createApi({
  baseQuery: loggingBaseQuery,
  endpoints: () => ({}),
});

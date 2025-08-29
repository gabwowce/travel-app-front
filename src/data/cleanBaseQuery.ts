import {
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";

type FBQOpts = Parameters<typeof fetchBaseQuery>[0];

const isNil = (v: any) => v === undefined || v === null;
const isEmpty = (v: any) => v === "";

/** Pašalina undefined/null/"" iš params (rekursijos nereikia – užtenka 1 lygio) */
export function cleanParams(o: Record<string, any> | undefined | null) {
  if (!o) return undefined;
  const entries = Object.entries(o).filter(([, v]) => !isNil(v) && !isEmpty(v));
  if (!entries.length) return undefined;
  return Object.fromEntries(entries);
}

/** Pašalina =undefined|=null|= tuščia iš URL query (jei kada gauni stringą su ?...) */
export function stripUndefinedFromUrl(url: string) {
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

/** Wrapper’is aplink fetchBaseQuery, kuris išvalo params ir url */
export function createCleanBaseQuery(
  opts: FBQOpts
): BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> {
  const raw = fetchBaseQuery(opts);
  return async (args, api, extra) => {
    if (typeof args === "string") {
      return raw(stripUndefinedFromUrl(args), api, extra);
    }
    const { url, params, ...rest } = args;
    const cleaned = {
      url: stripUndefinedFromUrl(url ?? ""),
      params: cleanParams(params),
      ...rest,
    } as FetchArgs;
    return raw(cleaned, api, extra);
  };
}

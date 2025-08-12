// src/store/lazyHooks.ts
import { travelApi } from "@/src/store/travelApi";

// Vienodas fallback tuple kaip useLazyQuery grąžina:
// [triggerFn, stateObj]
const FALLBACK_LAZY_TUPLE: any = [() => Promise.resolve(undefined), {}];

// Helperis: paima endpointo pavadinimą, bando grąžinti useLazyQuery, jei nėra – fallback
function lazyOrFallback(name: string) {
  const ep: any = (travelApi as any).endpoints?.[name];
  return ep?.useLazyQuery ? ep.useLazyQuery() : (FALLBACK_LAZY_TUPLE as any);
}

/* ========= Profilis / Auth ========= */

export const useLazyGetCurrentUserQuery = () => {
  const eps: any = (travelApi as any).endpoints;
  if (eps?.getCurrentUser?.useLazyQuery)
    return eps.getCurrentUser.useLazyQuery();
  if (eps?.getUserProfile?.useLazyQuery)
    return eps.getUserProfile.useLazyQuery();
  return FALLBACK_LAZY_TUPLE as any;
};

/* ========= Routes ========= */

export const useLazyGetRoutesQuery = () =>
  (travelApi.endpoints as any).getRoutes.useLazyQuery();

export const useLazyGetFeaturedRoutesQuery = () =>
  (travelApi.endpoints as any).getFeaturedRoutes.useLazyQuery();

export const useLazyGetRouteByIdQuery = () => lazyOrFallback("getRouteById");

/* ========= Categories / Countries / Cities ========= */

export const useLazyGetCategoriesQuery = () =>
  (travelApi.endpoints as any).getCategories.useLazyQuery();

export const useLazyGetCountriesQuery = () =>
  (travelApi.endpoints as any).getCountries.useLazyQuery();

export const useLazyGetCitiesQuery = () =>
  (travelApi.endpoints as any).getCities.useLazyQuery();

/* ========= Favorites ========= */

export const useLazyGetUserFavoritesQuery = () =>
  (travelApi.endpoints as any).getUserFavorites.useLazyQuery();

/* ========= Places (jei yra) ========= */

export const useLazyGetPlacesQuery = () => lazyOrFallback("getPlaces");
export const useLazyGetPlaceByIdQuery = () => lazyOrFallback("getPlaceById");

/* ========= Search (jei yra) ========= */

export const useLazySearchQuery = () => lazyOrFallback("search");

// src/utils/normalizeFavorite.ts
export type FavoriteMeta = {
  routeId?: number;
  categoryId?: number;
  countryId?: number;
  cityId?: number;
  difficulty?: string | number | null;
};

export function pickMetaFromFavorite(fav: any): FavoriteMeta {
  const r = fav?.route ?? fav;

  const categoryId =
    r?.category_id ??
    r?.categoryId ??
    r?.category?.id ??
    r?.categories?.[0]?.id ??
    fav?.category_id ??
    fav?.categoryId;

  const cityId =
    r?.city_id ?? r?.cityId ?? r?.city?.id ?? fav?.city_id ?? fav?.cityId;

  const countryId =
    r?.country_id ??
    r?.countryId ??
    r?.country?.id ??
    r?.city?.country_id ??
    r?.city?.countryId;

  const routeId = r?.id ?? fav?.route_id ?? fav?.id;

  const difficulty =
    r?.difficulty ?? r?.route_difficulty ?? r?.details?.difficulty ?? null;

  return { routeId, categoryId, cityId, countryId, difficulty };
}

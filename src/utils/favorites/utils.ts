// src/features/favorites/utils.ts

/** Saugiai verčiam bet ką į skaičių, jei nepavyksta – grąžinam undefined */
export function toNum(v: unknown): number | undefined {
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

/** Iš favorites įrašo paimam būtent ROUTE ID (ne favorito įrašo id) */
export function pickRouteIdFromFavorite(item: any): number | undefined {
  if (!item) return undefined;

  // 1) { route: { id } }
  const routeObjId = toNum(item?.route?.id);
  if (routeObjId !== undefined) return routeObjId;

  // 2) pivot/wrapper formos
  const rid1 = toNum(item?.route_id);
  if (rid1 !== undefined) return rid1;

  const rid2 = toNum(item?.routeId);
  if (rid2 !== undefined) return rid2;

  // 3) kiti dažni backend pavadinimai
  const rid3 = toNum(item?.tour_id); // jeigu backend vadina "tour"
  if (rid3 !== undefined) return rid3;

  const rid4 = toNum(item?.favoritable_id); // pvz. polymorphic: { favoritable_type: 'Route', favoritable_id: 374 }
  if (
    rid4 !== undefined &&
    String(item?.favoritable_type ?? "")
      .toLowerCase()
      .includes("route")
  ) {
    return rid4;
  }

  // 4) masyvas iš plikų ID
  const bare = toNum(item);
  if (bare !== undefined) return bare;

  // 5) pats route objektas sąraše (atskirti nuo favorito įrašo)
  const maybeRouteSelf = toNum(item?.id);
  if (maybeRouteSelf !== undefined && ("title" in item || "name" in item)) {
    return maybeRouteSelf;
  }

  return undefined;
}

/** Iš įvairių „formų“ susirenkam vienodą masyvą */
export function normalizeFavorites(resp: any): any[] {
  if (!resp) return [];
  if (Array.isArray(resp)) return resp;

  // ← nauja eilutė TAVO atvejui
  if (Array.isArray(resp?.data?.items)) return resp.data.items;

  if (Array.isArray(resp?.data?.data)) return resp.data.data;
  if (Array.isArray(resp?.data)) return resp.data;
  if (Array.isArray(resp?.favorites)) return resp.favorites;
  if (Array.isArray(resp?.favorites?.data)) return resp.favorites.data;
  if (Array.isArray(resp?.items)) return resp.items;
  if (Array.isArray(resp?.results)) return resp.results;
  if (Array.isArray(resp?.records)) return resp.records;
  return [];
}

/** Dev pagalba: trumpas vieno įrašo logas, kad matytum realią struktūrą */
export function devLogFavoritesSample(label: string, resp: any) {
  if (__DEV__) {
    const arr = normalizeFavorites(resp);
    const sample = arr?.[0];
    // neprintsink per daug – tik šiek tiek
    try {
      console.log(
        `[${label}] sample favorite:`,
        JSON.stringify(sample, null, 2)
      );
      console.log(
        `[${label}] mapped route id:`,
        pickRouteIdFromFavorite(sample)
      );
    } catch {
      console.log(`[${label}] sample favorite:`, sample);
    }
  }
}

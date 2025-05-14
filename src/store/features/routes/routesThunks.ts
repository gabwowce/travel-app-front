import { createThunk } from "@/src/utils/createThunk";
import { RoutesService } from "@/src/api/generated/services/RoutesService";
import { ExtractData, ExtractList } from "@/src/utils/typeHelpers";

/* =============================
 * Išgryninti "data" tipai
 * ============================= */

// Routes
type RouteList = ExtractList<typeof RoutesService.getRoutes>;
type FeaturedRoutes = ExtractData<typeof RoutesService.getFeaturedRoutes>;
type RouteDetails = ExtractData<typeof RoutesService.getRouteById>;
type RoutePlaces = ExtractData<typeof RoutesService.getRoutePlaces>;
type RouteRatings = ExtractList<typeof RoutesService.getRouteRatings>;

/* ======================
 * ROUTES THUNKS
 * ====================== */

// Get all routes with filters
export const fetchRoutes = createThunk<{
  countryId?: number;
  cityId?: number;
  categoryId?: number;
  difficulty?: Array<'easy' | 'moderate' | 'challenging' | 'difficult'>;
  minDistance?: number;
  maxDistance?: number;
  minElevation?: number;
  maxElevation?: number;
  search?: string;
  sort?: 'name' | 'name_desc' | 'distance' | 'distance_desc' | 'elevation' | 'elevation_desc' | 'rating' | 'rating_desc';
  perPage?: number;
  page?: number;
}, RouteList>(
  "routes/fetchRoutes",
  (params) =>
    RoutesService.getRoutes(
      params.countryId,
      params.cityId,
      params.categoryId,
      params.difficulty,
      params.minDistance,
      params.maxDistance,
      params.minElevation,
      params.maxElevation,
      params.search,
      params.sort ?? "name",
      params.perPage ?? 15,
      params.page ?? 1
    ).then(response => ({ data: response.data?.data ?? [] }))
);

// Get featured routes
export const fetchFeaturedRoutes = createThunk<{ limit?: number }, FeaturedRoutes>(
  "routes/fetchFeaturedRoutes",
  ({ limit = 6 }) =>
    RoutesService.getFeaturedRoutes(limit).then(response => ({ data: response.data ?? [] }))
);

// Get route details by ID
export const fetchRouteById = createThunk<number, RouteDetails>(
  "routes/fetchRouteById",
  (routeId) =>
    RoutesService.getRouteById(routeId).then(response => ({ data: response.data! }))
);

// Get places in route
export const fetchRoutePlaces = createThunk<number, RoutePlaces>(
  "routes/fetchRoutePlaces",
  (routeId) =>
    RoutesService.getRoutePlaces(routeId).then(response => ({ data: response.data ?? [] }))
);

// Get route ratings
export const fetchRouteRatings = createThunk<{ routeId: number; perPage?: number; page?: number }, RouteRatings>(
  "routes/fetchRouteRatings",
  ({ routeId, perPage = 15, page = 1 }) =>
    RoutesService.getRouteRatings(routeId, perPage, page).then(response => ({ data: response.data?.data ?? [] }))
);

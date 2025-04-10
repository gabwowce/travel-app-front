import { createThunk } from "@/src/utils/createThunk";
import { PlacesService } from "@/src/api/generated/services/PlacesService";
import { ExtractData, ExtractList } from "@/src/utils/typeHelpers";
import type { PlaceRequest } from "@/src/api/generated/index";

/* =============================
 * Išgryninti "data" tipai
 * ============================= */

type PlaceList = ExtractList<typeof PlacesService.getPlaces>;
type PlaceDetails = ExtractData<typeof PlacesService.getPlaceById>;
type NewPlace = ExtractData<typeof PlacesService.storePlace>;
type UpdatedPlace = ExtractData<typeof PlacesService.updatePlace>;
type PlaceRoutes = ExtractList<typeof PlacesService.getPlaceRoutes>;

/* ======================
 * PLACES THUNKS
 * ====================== */

// Get all places with filters
export const fetchPlaces = createThunk<{
  cityId?: number;
  categoryId?: number;
  perPage?: number;
  page?: number;
}, PlaceList>(
  "places/fetchPlaces",
  ({ cityId, categoryId, perPage = 15, page = 1 }) =>
    PlacesService.getPlaces(cityId, categoryId, perPage, page).then(response => ({ data: response.data?.data ?? [] }))
);

// Get place by ID
export const fetchPlaceById = createThunk<number, PlaceDetails>(
  "places/fetchPlaceById",
  (placeId) =>
    PlacesService.getPlaceById(placeId).then(response => ({ data: response.data! }))
);

// Create a new place
export const createPlace = createThunk<PlaceRequest, NewPlace>(
  "places/createPlace",
  (payload) =>
    PlacesService.storePlace(payload).then(response => ({ data: response.data! }))
);

// Update a place
export const updatePlace = createThunk<{ placeId: number; data: PlaceRequest }, UpdatedPlace>(
  "places/updatePlace",
  ({ placeId, data }) =>
    PlacesService.updatePlace(placeId, data).then(response => ({ data: response.data! }))
);

// Delete a place
export const deletePlace = createThunk<number, void>(
  "places/deletePlace",
  (placeId) =>
    PlacesService.deletePlace(placeId).then(() => ({ data: undefined }))
);

// Get routes for a place
export const fetchPlaceRoutes = createThunk<{ placeId: number; perPage?: number; page?: number }, PlaceRoutes>(
  "places/fetchPlaceRoutes",
  ({ placeId, perPage = 15, page = 1 }) =>
    PlacesService.getPlaceRoutes(placeId, perPage, page).then(response => ({ data: response.data?.data ?? [] }))
);

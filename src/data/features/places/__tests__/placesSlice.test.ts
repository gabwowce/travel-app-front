/**
 * placesSlice.test.ts
 * =====================
 * Testuoja Redux placesSlice, kuris valdo vietų (places) dalį aplikacijos state.
 * Testuojami tiek reduceriai, tiek thunk'ai (async actions).
 */

import { AnyAction, configureStore } from "@reduxjs/toolkit";
import placesReducer, { clearSelectedPlace } from "../placesSlice";
import * as placesThunks from "../placesThunks"; // Importuojam visus thunks
import { PlacesService } from "@/src/api/generated/services/PlacesService";

// ========================
// Setup: Test Store
// ========================

/**
 * Sukuriame izoliuotą Redux store testui
 */
const createTestStore = () =>
  configureStore({
    reducer: {
      places: placesReducer,
    },
  });

// ========================
// Setup: Mock API servisai
// ========================

/**
 * Mockinam PlacesService metodus,
 * kad nenaudotume tikro API per testus.
 */
jest.mock("@/src/api/generated/services/PlacesService", () => ({
  PlacesService: {
    getPlaces: jest.fn(),
    getPlaceById: jest.fn(),
    getPlaceRoutes: jest.fn(),
    storePlace: jest.fn(),
    updatePlace: jest.fn(),
    deletePlace: jest.fn(),
  },
}));

// ========================
// Testų grupė
// ========================

describe("placesSlice", () => {
  const mockPlaces = [{ id: 1, name: "Test Place 1" }, { id: 2, name: "Test Place 2" }];
  const mockPlaceDetails = { id: 1, name: "Test Place 1", description: "A nice place" };

  let store: ReturnType<typeof createTestStore>;

  // Prieš kiekvieną testą sukuriam šviežią store ir išvalom mock'us
  beforeEach(() => {
    store = createTestStore();
    jest.clearAllMocks();
  });

  // ====================================================
  // Testas: fetchPlaces -> success
  // ====================================================
  it("should handle fetchPlaces fulfilled", async () => {
    (PlacesService.getPlaces as jest.Mock).mockResolvedValueOnce({ data: { data: mockPlaces } });

    await store.dispatch(placesThunks.fetchPlaces({}));

    const state = store.getState().places;
    expect(state.loading).toBe(false);
    expect(state.places).toEqual(mockPlaces);
    expect(state.error).toBeNull();
  });

  // ====================================================
  // Testas: fetchPlaces -> fail
  // ====================================================
  it("should handle fetchPlaces rejected", async () => {
    (PlacesService.getPlaces as jest.Mock).mockRejectedValueOnce({
      response: { data: { message: "Unknown error" } },
    });

    await store.dispatch(placesThunks.fetchPlaces({}));

    const state = store.getState().places;
    expect(state.loading).toBe(false);
    expect(state.error).toContain("Unknown error");
    expect(state.places).toEqual([]);
  });

  // ====================================================
  // Testas: fetchPlaceById -> success
  // ====================================================
  it("should handle fetchPlaceById fulfilled", async () => {
    (PlacesService.getPlaceById as jest.Mock).mockResolvedValueOnce({ data: mockPlaceDetails });

    await store.dispatch(placesThunks.fetchPlaceById(1));

    const state = store.getState().places;
    expect(state.selectedPlace).toEqual(mockPlaceDetails);
    expect(state.loading).toBe(false);
  });

  // ====================================================
  // Testas: fetchPlaceById -> fail
  // ====================================================
  it("should handle fetchPlaceById rejected", async () => {
    (PlacesService.getPlaceById as jest.Mock).mockRejectedValueOnce({
      response: { data: { message: "Unknown error" } },
    });

    await store.dispatch(placesThunks.fetchPlaceById(999));

    const state = store.getState().places;
    expect(state.selectedPlace).toBeNull();
    expect(state.loading).toBe(false);
    expect(state.error).toContain("Unknown error");
  });

  // ====================================================
  // Testas: clearSelectedPlace -> reducer
  // ====================================================
  it("should handle clearSelectedPlace reducer", () => {
    const initialState = {
      places: mockPlaces,
      selectedPlace: mockPlaceDetails,
      loading: false,
      error: null,
      placeRoutes: [],
    };

    const nextState = placesReducer(initialState, clearSelectedPlace());
    expect(nextState.selectedPlace).toBeNull();
  });
});

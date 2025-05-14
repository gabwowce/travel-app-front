import { createSlice } from "@reduxjs/toolkit";
import {
  fetchPlaces,
  fetchPlaceById,
  createPlace,
  updatePlace,
  deletePlace,
  fetchPlaceRoutes,
} from "./placesThunks";
import { createCommonReducers } from "@/src/utils/extraReducers";
import type { Place } from "@/src/api/generated/models/Place";
import type { Route } from "@/src/api/generated/models/Route";

interface PlacesState {
  places: Place[];
  selectedPlace: Place | null;
  placeRoutes: Route[] | null;
  loading: boolean;
  error: string | null;
}

const initialState: PlacesState = {
  places: [],
  selectedPlace: null,
  placeRoutes: null,
  loading: false,
  error: null,
};

const placesSlice = createSlice({
  name: "places",
  initialState,
  reducers: {
    clearSelectedPlace(state) {
      state.selectedPlace = null;
    },
    clearPlaceRoutes(state) {
      state.placeRoutes = null;
    },
  },
  extraReducers: (builder) => {
    

    builder
      // Fetch all places
      .addCase(fetchPlaces.fulfilled, (state, action) => {
        state.places = action.payload ?? [];
      })

      // Fetch single place by ID
      .addCase(fetchPlaceById.fulfilled, (state, action) => {
        state.selectedPlace = action.payload;
      })

      // Create place
      .addCase(createPlace.fulfilled, (state, action) => {
        // Optional: pridėti sukurtą vietą į sąrašą
        state.places.push(action.payload);
      })

      // Update place
      .addCase(updatePlace.fulfilled, (state, action) => {
        state.places = state.places.map(place =>
          place.id === action.payload.id ? action.payload : place
        );
        if (state.selectedPlace?.id === action.payload.id) {
          state.selectedPlace = action.payload;
        }
      })

      // Delete place
      .addCase(deletePlace.fulfilled, (state, action) => {
        // action.payload yra void, bet jeigu nori grąžinti ID, reikia keisti thunk
        // Pvz., jeigu nori žinoti ID, reikia gražinti iš thunk'ų:
        // ({ data: placeId })
        // Dabar tiesiog nuvalom selectedPlace
        state.selectedPlace = null;
        // Galima papildyti: pašalinti iš sąrašo, jei žinomas ID
      })

      // Fetch place routes
      .addCase(fetchPlaceRoutes.fulfilled, (state, action) => {
        state.placeRoutes = action.payload ?? [];
      });

      createCommonReducers(
        [
          fetchPlaces,
          fetchPlaceById,
          createPlace,
          updatePlace,
          deletePlace,
          fetchPlaceRoutes,
        ],
        "places"
      )(builder);
  },
});

export const { clearSelectedPlace, clearPlaceRoutes } = placesSlice.actions;
export default placesSlice.reducer;

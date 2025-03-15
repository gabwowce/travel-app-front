import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// 🔹 Sukuriame turo duomenų struktūrą
interface TourState {
  country: string | null;
  country_id: number | null;
  city: string | null;
  city_id: number | null;
  category: string | null;
  category_id: number | null;
}

const initialState: TourState = {
  country: null,
  country_id: null,
  city: null,
  city_id: null,
  category: null,
  category_id: null,
};

// 🔹 Redux Slice valdo turo kūrimo būseną
const tourSlice = createSlice({
  name: "tour",
  initialState,
  reducers: {
    setTourData(state, action: PayloadAction<Partial<TourState>>) {
      return { ...state, ...action.payload };
    },
    resetTour() {
      return initialState;
    },
  },
});

export const { setTourData, resetTour } = tourSlice.actions;
export default tourSlice.reducer;

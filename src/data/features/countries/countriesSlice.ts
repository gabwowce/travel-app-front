import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Country, CountryDetails, City, PaginatedRoutesResponse } from "./countriesTypes";
import { getAllCountries, getCountryById, getCountryCities, getCountryRoutes } from "./countriesAPI";

interface CountriesState {
  countries: Country[];
  selectedCountry: CountryDetails | null;
  countryCities: City[];
  countryRoutes: PaginatedRoutesResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: CountriesState = {
  countries: [],
  selectedCountry: null,
  countryCities: [],
  countryRoutes: null,
  loading: false,
  error: null,
};

// ✅ Gauti visas šalis
export const fetchCountries = createAsyncThunk("countries/fetchCountries", async (_, thunkAPI) => {
  try {
    return await getAllCountries();
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message || "Nepavyko gauti šalių sąrašo");
  }
});

// ✅ Gauti konkrečios šalies duomenis
export const fetchCountryById = createAsyncThunk("countries/fetchCountryById", async (id: number, thunkAPI) => {
  try {
    return await getCountryById(id);
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message || "Nepavyko gauti šalies duomenų");
  }
});

// ✅ Gauti šalies miestus
export const fetchCountryCities = createAsyncThunk("countries/fetchCountryCities", async (id: number, thunkAPI) => {
  try {
    return await getCountryCities(id);
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message || "Nepavyko gauti miestų sąrašo");
  }
});

// ✅ Gauti šalies maršrutus
export const fetchCountryRoutes = createAsyncThunk("countries/fetchCountryRoutes", async ({ id, page, per_page }: { id: number; page: number; per_page: number }, thunkAPI) => {
  try {
    return await getCountryRoutes(id, page, per_page);
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message || "Nepavyko gauti maršrutų sąrašo");
  }
});

const countriesSlice = createSlice({
  name: "countries",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCountries.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCountries.fulfilled, (state, action: PayloadAction<Country[]>) => {
        state.loading = false;
        state.countries = action.payload;
      })
      .addCase(fetchCountries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchCountryById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCountryById.fulfilled, (state, action: PayloadAction<CountryDetails>) => {
        state.loading = false;
        state.selectedCountry = action.payload;
      })
      .addCase(fetchCountryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchCountryCities.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCountryCities.fulfilled, (state, action: PayloadAction<City[]>) => {
        state.loading = false;
        state.countryCities = action.payload;
      })
      .addCase(fetchCountryCities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchCountryRoutes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCountryRoutes.fulfilled, (state, action: PayloadAction<PaginatedRoutesResponse>) => {
        state.loading = false;
        state.countryRoutes = action.payload;
      })
      .addCase(fetchCountryRoutes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default countriesSlice.reducer;

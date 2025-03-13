import { RootState } from "@/src/data/store";

// ✅ Gauti visą countries būseną
export const selectCountriesState = (state: RootState) => state.countries;

// ✅ Gauti visas šalis
export const selectCountries = (state: RootState) => state.countries.countries;

// ✅ Gauti pasirinktą šalį
export const selectSelectedCountry = (state: RootState) => state.countries.selectedCountry;

// ✅ Gauti šalies miestus
export const selectCountryCities = (state: RootState) => state.countries.countryCities;

// ✅ Gauti šalies maršrutus
export const selectCountryRoutes = (state: RootState) => state.countries.countryRoutes;

// ✅ Gauti užkrovimo būseną
export const selectCountriesLoading = (state: RootState) => state.countries.loading;

// ✅ Gauti klaidos būseną
export const selectCountriesError = (state: RootState) => state.countries.error;

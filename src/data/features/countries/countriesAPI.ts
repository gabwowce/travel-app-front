import { apiRequest } from "../../apiService";
import { Country, CountryDetails, City, PaginatedRoutesResponse } from "./countriesTypes";

// ✅ Gauti visus šalis su miestų ir maršrutų skaičiumi
export const getAllCountries = async (): Promise<Country[]> => {
  const response = await apiRequest("/api/v1/countries", "GET");
  return response;
};

// ✅ Gauti konkrečią šalį pagal ID su miestų sąrašu
export const getCountryById = async (id: number): Promise<CountryDetails> => {
  const response = await apiRequest(`/api/v1/countries/${id}`, "GET");
  return response;
};

// ✅ Gauti šalies miestų sąrašą
export const getCountryCities = async (id: number): Promise<City[]> => {
  const response = await apiRequest(`/api/v1/countries/${id}/cities`, "GET");
  return response;
};

// ✅ Gauti šalies maršrutus (paginuotus)
export const getCountryRoutes = async (id: number, page = 1, per_page = 10): Promise<PaginatedRoutesResponse> => {
  const response = await apiRequest(`/api/v1/countries/${id}/routes?per_page=${per_page}&page=${page}`, "GET");
  return response;
};

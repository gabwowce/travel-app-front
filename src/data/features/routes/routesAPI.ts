import { apiRequest } from "../../apiService";
import { Route, RouteQueryParams, PaginatedRoutesResponse } from "@/src/data/features/routes/routesTypes";

// ✅ Gauti visus maršrutus su filtrais
export const getFilteredRoutes = async (params: RouteQueryParams): Promise<PaginatedRoutesResponse> => {
  const queryString = new URLSearchParams(params as Record<string, string>).toString();
  const response = await apiRequest(`/api/v1/routes?${queryString}`, "GET");
  return response;
};

// ✅ Gauti rekomenduojamus (featured) maršrutus
export const getFeaturedRoutes = async (): Promise<Route[]> => {
  const response = await apiRequest("/api/v1/routes/featured", "GET");
  return response;
};

// ✅ Gauti konkretų maršrutą pagal ID
export const getRouteById = async (id: number): Promise<Route> => {
  const response = await apiRequest(`/api/v1/routes/${id}`, "GET");
  return response.data.route;
};

// Gauti maršrutus pagal pasirinktą kategoriją iš serverio
export const getRoutesByCategory = async (categoryId: number): Promise<PaginatedRoutesResponse> => {
  return await apiRequest(`/api/v1/routes?category_id=${categoryId}`, "GET");
};

// Gauti maršrutus pagal miestą iš serverio
export const getRoutesByCity = async (cityId: number): Promise<PaginatedRoutesResponse> => {
  return await apiRequest(`/api/v1/routes?city_id=${cityId}`, "GET");
};

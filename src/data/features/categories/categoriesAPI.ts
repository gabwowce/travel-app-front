import { apiRequest } from "../../apiService";
import { Category, CategoryDetails, PaginatedRoutesResponse } from "./categoriesTypes";

// ✅ Gauti visas kategorijas
export const getAllCategories = async (): Promise<Category[]> => {
  const response = await apiRequest("/api/v1/categories", "GET");
  return response;
};

// ✅ Gauti konkrečią kategoriją pagal ID
export const getCategoryById = async (id: number): Promise<CategoryDetails> => {
  const response = await apiRequest(`/api/v1/categories/${id}`, "GET");
  return response;
};

// ✅ Gauti kategorijos maršrutus (paginuotus)
export const getCategoryRoutes = async (id: number, page = 1, per_page = 10): Promise<PaginatedRoutesResponse> => {
  const response = await apiRequest(`/api/v1/categories/${id}/routes?per_page=${per_page}&page=${page}`, "GET");
  return response;
};

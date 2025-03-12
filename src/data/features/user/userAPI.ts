import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiRequest } from "../../apiService";
import { UserResponse, UpdateUserPayload, FavoritesResponse, RatingsResponse } from "@/src/data/features/user/userTypes";
import { User } from "./userTypes";


export async function getUserProfile(): Promise<User> {
  const token = await AsyncStorage.getItem("token");
  return await apiRequest("/api/v1/user", "GET", undefined, {
    Authorization: `Bearer ${token}`,
  });
}

// ✅ Atnaujinti vartotojo profilį
export const updateUserProfile = async (data: UpdateUserPayload): Promise<UserResponse> => {
  const token = await AsyncStorage.getItem("token");
  return await apiRequest("/api/v1/user", "PUT", data, {
    Authorization: `Bearer ${token}`,
  });
};

// ✅ Gauti vartotojo mėgstamiausius maršrutus
export const getUserFavorites = async (page = 1, perPage = 10): Promise<FavoritesResponse> => {
  const token = await AsyncStorage.getItem("token");
  return await apiRequest(`/api/v1/user/favorites?page=${page}&per_page=${perPage}`, "GET", undefined, { // 🔹 `null` → `undefined`
    Authorization: `Bearer ${token}`,
  });
};

// ✅ Gauti vartotojo įvertinimus
export const getUserRatings = async (page = 1, perPage = 10): Promise<RatingsResponse> => {
  const token = await AsyncStorage.getItem("token");
  return await apiRequest(`/api/v1/user/ratings?page=${page}&per_page=${perPage}`, "GET", undefined, { // 🔹 `null` → `undefined`
    Authorization: `Bearer ${token}`,
  });
};

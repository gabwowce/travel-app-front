import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiRequest } from "../../apiService";
import {
  LoginPayload,
  RegisterPayload,
  LoginResponse,
  RegisterResponse,
} from "@/src/data/features/auth/authTypes";

// Prisijungimo funkcija (saugo token + user duomenis)
export const loginUser = async (data: LoginPayload): Promise<LoginResponse> => {
  try {
    const response: LoginResponse = await apiRequest("/api/v1/login", "POST", data);

    await AsyncStorage.setItem("token", response.token);
    await AsyncStorage.setItem("user", JSON.stringify(response.user));

    return response;
  } catch (error) {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    throw error;
  }
};


// Registracijos funkcija (saugo token + user duomenis)
export const registerUser = async (
  data: RegisterPayload
): Promise<RegisterResponse> => {
  const response: RegisterResponse = await apiRequest("/api/v1/register", "POST", data);

  await AsyncStorage.setItem("token", response.token);
  await AsyncStorage.setItem("user", JSON.stringify(response.user));

  return response;
};

// Atsijungimo funkcija (ištrina token + user)
export const logoutUser = async (): Promise<void> => {
  // Prieš trindami token iš AsyncStorage, pasiimame jį, kad galėtume panaudoti antraštėje.
  const token = await AsyncStorage.getItem("token");

  await apiRequest(
    "/api/v1/logout", 
    "POST", 
    {}, // POST duomenys (gali būti ir null, jei nereikia)
    { Authorization: `Bearer ${token}` } // papildomos antraštės
  );
  

  // Arba variantas, jei apiRequest turi global header logic.

  // Kai API atsako sėkme, pašaliname išsaugotą vartotoją
  await AsyncStorage.removeItem("token");
  await AsyncStorage.removeItem("user");
};

// Gauti vartotojo duomenis iš AsyncStorage
export const getStoredUser = async () => {
  const user = await AsyncStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

// Gauti išsaugotą token iš AsyncStorage
export const getStoredToken = async () => {
  return await AsyncStorage.getItem("token");
};

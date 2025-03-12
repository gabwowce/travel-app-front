import axios from "axios";
import Constants from "expo-constants";

const API_URL = Constants.expoConfig?.extra?.API_URL;

export const apiRequest = async (
  endpoint: string,
  method: "POST" | "GET" | "PUT" | "DELETE",
  data?: object, // ← Priima `object | undefined`, bet ne `null`
  extraHeaders?: Record<string, string>
) => {
  try {
    const response = await axios({
      url: `${API_URL}${endpoint}`,
      method,
      data: data ?? undefined, // ✅ Užtikriname, kad `null` keičiamas į `undefined`
      headers: {
        Accept: "application/json",
        ...extraHeaders,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error(
      `API request error (${API_URL}${endpoint}):`,
      error.response?.data || error.message
    );
    throw error.response?.data || { message: "Something went wrong" };
  }
};

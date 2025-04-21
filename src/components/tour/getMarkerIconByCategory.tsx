import { Ionicons } from "@expo/vector-icons";

export function getMarkerIcon(category?: string) {
  switch (category) {
    case "museum":
      return { name: "school-outline", color: "#6C63FF" }; // violetinė
    case "nature":
      return { name: "leaf-outline", color: "#4CAF50" }; // žalia
    case "food":
      return { name: "restaurant-outline", color: "#FF6B6B" }; // raudona
    default:
      return { name: "location-outline", color: "#555" };
  }
}

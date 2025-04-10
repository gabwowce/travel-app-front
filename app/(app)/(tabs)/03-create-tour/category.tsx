import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useAppDispatch, useAppSelector } from "@/src/data/hooks";
import { fetchCategories } from "@/src/data/features/categories/categoriesSlice";
import {
  selectCategories,
  selectCategoriesLoading,
  selectCategoriesError,
} from "@/src/data/features/categories/categoriesSelectors";
import { setTourData } from "@/src/data/features/tours/tourSlice";
import SelectableListScreen from "@/src/components/SelectableListScreen";
import Ionicons from "react-native-vector-icons/Ionicons";

const categoryIconMap: Record<string, string> = {
  Nature: "leaf-outline",
  Historical: "book-outline",
  Scenic: "image-outline",
  "Family Friendly": "people-outline",
  Advanced: "barbell-outline",
  Waterside: "water-outline",
  Urban: "business-outline",
  Wildlife: "paw-outline",
  Photography: "camera-outline",
  Camping: "bonfire-outline",
  Backpacking: "walk-outline",
  "Winter Sports": "snow-outline",
  Accessible: "accessibility-outline",

  // Nauji:
  Hiking: "walk-outline",
  "Mountain Biking": "bicycle-outline",
  "Road Cycling": "bicycle-outline",
  "Trail Running": "fitness-outline",
  Walking: "walk-outline",
};

const categoryColorMap: Record<string, string> = {
  Hiking: "#4CAF50",
  "Mountain Biking": "#FF9800",
  "Road Cycling": "#F44336",
  "Trail Running": "#9C27B0",
  Walking: "#3F51B5",
  Nature:"#144713"
};


export default function SelectCategoryScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const categories = useAppSelector(selectCategories);
  const loading = useAppSelector(selectCategoriesLoading);
  const error = useAppSelector(selectCategoriesError);

  const { city_id, category, category_id } = useAppSelector((state) => state.tour);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!city_id) {
      router.replace("/(app)/(tabs)/03-create-tour/city");
      return;
    }
    dispatch(fetchCategories());
  }, [dispatch, city_id]);

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().startsWith(searchTerm.toLowerCase())
  );

  return (
    <SelectableListScreen
      title="Select Category"
      data={filteredCategories}
      selectedItem={category}
      setSelectedItem={(item) =>
        dispatch(
          setTourData({
            category: item.name,
            category_id: item.id,
          })
        )
      }
      loading={loading}
      error={error}
      // btnLabel="Done"
      onBackPress={() => {
        dispatch(
          setTourData({
            city: null,
            city_id: null,
            category: null,
            category_id: null,
          })
        );
        router.back();
      }}
      onNextPress={() => router.push("/(app)/(tabs)/03-create-tour/tours")}
      renderIcon={(item) => {
        const iconName = categoryIconMap[item.name] || "help-circle-outline";
        const iconColor = categoryColorMap[item.name] || item.color || "#666";
      
        return (
          <Ionicons
            name={iconName}
            size={20}
            color={iconColor}
          />
        );
      }}
      
      
    />

  );
}

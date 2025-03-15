import React, { useEffect, useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useAppDispatch, useAppSelector } from "@/src/data/hooks";
import { fetchCategories } from "@/src/data/features/categories/categoriesSlice";
import {
  selectCategories,
  selectCategoriesLoading,
  selectCategoriesError,
} from "@/src/data/features/categories/categoriesSelectors";
import SelectableList from "@/src/components/SelectableList";
import Header from "@/src/components/Header"; 
import ScreenContainer from "@/src/components/ScreenContainer"; 

import { Box } from "native-base";
import SearchBar from "@/src/components/SearchBar"; 
import { setTourData } from "@/src/data/features/tours/tourSlice";
import { Keyboard, TouchableWithoutFeedback } from "react-native";


export default function SelectCategoryScreen() {

  const router = useRouter();
  const dispatch = useAppDispatch();
  const categories = useAppSelector(selectCategories);
  const loading = useAppSelector(selectCategoriesLoading);
  const error = useAppSelector(selectCategoriesError);
  const { country, country_id, city, city_id } = useAppSelector(state => state.tour);


   const [searchTerm, setSearchTerm] = useState("");
  
    // ✅ Filtruojame pagal `tour.name` (ne visą `tour` objektą)
    const filteredCategories = categories.filter((category) =>
      category.name.toLowerCase().startsWith(searchTerm.toLowerCase()) 
    );

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <ScreenContainer variant="top">
        <Header title={`Select Category`} onBackPress={() => router.back()}/>
        <SearchBar 
              placeholder="Search tour..." 
              value={searchTerm} 
              onChangeText={setSearchTerm} 
              onClear={() => setSearchTerm("")} 
            />
        <SelectableList
          title={""}
          data={filteredCategories}
          loading={loading}
          error={error}
          getItemLabel={(item) => item.name}
          onSelect={(item) => {
            console.log("Selecting category:", item); 
            dispatch(setTourData({ category: item.name, category_id: item.id }));
            console.log("Updated Redux state:", { category: item.name, category_id: item.id }); 
          
            router.push("/(app)/(tabs)/03-create-tour/tours");
          }}
          
        />
      </ScreenContainer>

    </TouchableWithoutFeedback>
    
  );
}

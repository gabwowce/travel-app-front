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

export default function SelectCategoryScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const categories = useAppSelector(selectCategories);
  const loading = useAppSelector(selectCategoriesLoading);
  const error = useAppSelector(selectCategoriesError);

  const { country, country_id, city, city_id } = useLocalSearchParams();

   const [searchTerm, setSearchTerm] = useState("");
  
    // ✅ Filtruojame pagal `tour.name` (ne visą `tour` objektą)
    const filteredCategories = categories.filter((category) =>
      category.name.toLowerCase().startsWith(searchTerm.toLowerCase()) 
    );

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <ScreenContainer>
      <Header title="Select Category" onBackPress={() => router.back()} />
      <Box px={5}> 
          <SearchBar 
            placeholder="Search tour..." 
            value={searchTerm} 
            onChangeText={setSearchTerm} 
            onClear={() => setSearchTerm("")} 
          />
      </Box>
      <SelectableList
        title={""}
        data={filteredCategories}
        loading={loading}
        error={error}
        getItemLabel={(item) => item.name}
        onSelect={(item) =>
          router.push({
            pathname: "/(app)/(tabs)/03-create-tour/tours",
            params: {
              country,
              country_id,
              city,
              city_id,
              category_id: item.id,
              category: item.name,
            },
          })
        }
      />
    </ScreenContainer>
  );
}

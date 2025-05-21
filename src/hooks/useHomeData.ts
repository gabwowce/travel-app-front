// src/hooks/useHomeData.ts
import { useState } from "react";
import { useGetFeaturedRoutesQuery, useGetCategoriesQuery, useGetCurrentUserQuery } from "@/src/store/travelApi";

export function useHomeData() {
  const [expanded, setExpanded] = useState(true);

  const { data: featuredRoutesResponse, isLoading: routesLoading, error: routesError } =
    useGetFeaturedRoutesQuery({ limit: 6 });

  const { data: categoriesResponse, isLoading: categoriesLoading } = useGetCategoriesQuery();
  const { data: userData } = useGetCurrentUserQuery();

  const featuredRoutes = featuredRoutesResponse?.data ?? [];
  const categories = categoriesResponse?.data ?? [];
  const visibleCategories = expanded ? categories : categories.slice(0, 3);
  const userName = userData?.data?.name?.split(" ")[0] ?? "keliautojau";

  return {
    featuredRoutes,
    routesLoading,
    routesError,
    categories,
    visibleCategories,
    expanded,
    setExpanded,
    userName,
  };
}

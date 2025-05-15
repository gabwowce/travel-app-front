// hooks/useFilters.ts
import { router, useLocalSearchParams } from "expo-router";

export function useSearchParams(routeKey: string) {
  const params = useLocalSearchParams<{ filters?: string }>();
  const filters = params.filters ? JSON.parse(params.filters) : undefined;

  const setFilters = (obj: any) => {
    router.setParams({
      filters: JSON.stringify(obj),
    });
  };

  return {
    getFilters: () => filters,
    setFilters,
  };
}

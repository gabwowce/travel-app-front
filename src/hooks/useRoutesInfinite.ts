// src/hooks/useRoutesInfinite.ts
import { useInfiniteQuery } from "@tanstack/react-query";
import { get } from "@/src/utils/api";

type Filters = {
  category_id?: number;
  city_id?: number;
  country_id?: number;
  search?: string;
};

type Route = { id: number; name: string; /* … */ };

type ApiResponse = {
  data: Route[];
  pagination: {
    next_cursor?: string | null;
    has_next: boolean;
    total: number;
    limit: number | string;
  };
};

export function useRoutesInfinite(filters: Filters, token: string | undefined) {
  const PAGE_SIZE = 12;

  return useInfiniteQuery({
    queryKey: ["routes", filters],
    queryFn: ({ pageParam }) =>
      get<ApiResponse>("routes", { ...filters, limit: PAGE_SIZE, cursor: pageParam, sort: "rating_desc" }, token),
    initialPageParam: undefined,                    // first page – no cursor
    getNextPageParam: lastPage => lastPage.pagination.next_cursor ?? undefined,
  });
}

// utils/searchParamsStore.ts

const filtersStore: Record<string, any> = {};

export function setFiltersForKey(key: string, filters: any) {
  filtersStore[key] = filters;
}

export function getFiltersForKey(key: string): any | undefined {
  return filtersStore[key];
}

export function mergeFiltersForKey(key: string, newFilters: any) {
  const prev = filtersStore[key] ?? {};
  filtersStore[key] = { ...prev, ...newFilters };
}

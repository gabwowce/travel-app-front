import type { RouteFilters } from "@/src/data/features/types/routeFilters";

export function deriveContextDefaults(from: string | number): Partial<RouteFilters> {
  const m = String(from).match(/\/(category|country|city)\/(\d+)/);
  if (!m) return {};
  const [, type, id] = m;
  return { [`${type}Id`]: Number(id) } as Partial<RouteFilters>;
}

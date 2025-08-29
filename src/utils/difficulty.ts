// src/utils/difficulty.ts
export function normalizeDifficulty(v: unknown): string | null {
  if (v == null) return null;
  if (typeof v === "string") return v.toLowerCase();
  if (typeof v === "number") {
    // prisitaikyk, jei backend'as naudoja 1/2/3/4
    const map: Record<number, string> = {
      1: "easy",
      2: "moderate",
      3: "challenging",
      4: "hard",
    };
    return map[v] ?? String(v);
  }
  return String(v).toLowerCase();
}

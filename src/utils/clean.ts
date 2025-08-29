// utils/clean.ts
export const clean = (o: Record<string, any>) =>
  Object.fromEntries(
    Object.entries(o).filter(
      ([_, v]) => v !== undefined && v !== null && v !== ""
    )
  );

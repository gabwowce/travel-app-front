// Grąžina API response `data` tipą
export type ExtractData<T extends (...args: any) => any> =
  NonNullable<Awaited<ReturnType<T>>["data"]>;

// Grąžina API response `data.data` tipą (pvz. paginated list)
export type ExtractList<T extends (...args: any) => any> =
  NonNullable<ExtractData<T>["data"]>;

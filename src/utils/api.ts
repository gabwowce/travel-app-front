
const BASE = "https://travelapp.prus.dev/api/v1";

export async function get<T>(
  path: string,
  params: Record<string, any> = {},
  token?: string
): Promise<T> {
  const qs = new URLSearchParams(
    Object.fromEntries(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== null)
    )
  );
  const res = await fetch(`${BASE}/${path}?${qs.toString()}`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<T>;
}

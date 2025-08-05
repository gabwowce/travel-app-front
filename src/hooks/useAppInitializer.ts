import { useEffect, useState } from "react";
import { store } from "@/src/data/store";
import { initAuth } from "@/src/data/features/auth/authThunks";

export function useAppInitializer() {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        await Promise.all([store.dispatch(initAuth())]);
      } catch (e) {
        setError((e as Error).message ?? "Something went wrong");
      } finally {
        setReady(true);
      }
    })();
  }, []);

  return { ready, error } as const;
}

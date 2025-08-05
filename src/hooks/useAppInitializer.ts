// src/hooks/useAppInitializer.ts
import { useEffect, useState } from "react";

type InitTask = () => Promise<unknown>;

export function useAppInitializer(
  tasks: InitTask[] = [],
  splashMinMs: number // perduodam iš ENV
) {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      const startedAt = Date.now();
      try {
        // paleidžiam visus inicializacijos darbus
        await Promise.all(tasks.map((t) => t()));
      } catch (e) {
        if (isMounted) setError((e as Error).message);
      } finally {
        const elapsed = Date.now() - startedAt;
        const remaining = Math.max(0, splashMinMs - elapsed);
        setTimeout(() => isMounted && setReady(true), remaining);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [tasks, splashMinMs]);

  return { ready, error } as const;
}

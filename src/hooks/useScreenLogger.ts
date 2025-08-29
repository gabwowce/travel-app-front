import { usePathname } from "expo-router";
import { useEffect } from "react";

export function useScreenLogger(label?: string) {
  const path = usePathname();
  useEffect(() => {
    const ts = new Date().toISOString().replace("T", " ").slice(0, 19);
    console.log(`[${ts}] 📍 [SCREEN] ${label ?? path}`);
  }, [path, label]);
}

// app.config.ts
import "dotenv/config";
import type { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => {
  const easProjectId =
    process.env.EXPO_EAS_PROJECT_ID ??
    (config as any)?.extra?.eas?.projectId ?? // fallback jei yra app.json
    "7f5aa1f4-1b7e-43af-a058-355be731db3e";   // default (prod)

  return {
    ...config,
    extra: {
      ...(config.extra ?? {}),                 // <- NEIŠMESK esamų laukų
      apiBaseUrl: process.env.API_BASE_URL ?? (config as any)?.extra?.API_URL,
      // laikinas suderinamumas, jei kur nors dar skaitai API_URL:
      API_URL: process.env.API_BASE_URL ?? (config as any)?.extra?.API_URL,
      splashMinMs: Number(process.env.SPLASH_MIN_MS ?? 1500),
      availableLanguages: (process.env.AVAILABLE_LANGUAGES ?? "lt,en").split(","),
      router: { ...(config as any)?.extra?.router, origin: false },
      eas: { projectId: easProjectId },
    },
  };
};

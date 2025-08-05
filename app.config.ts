// app.config.ts
import "dotenv/config";
import type { ExpoConfig } from "@expo/config";

export default ({ config }: { config: ExpoConfig }): ExpoConfig => ({
  ...config,
  extra: {
    apiBaseUrl: process.env.API_BASE_URL,
    splashMinMs: Number(process.env.SPLASH_MIN_MS ?? 1500),
    availableLanguages: (process.env.AVAILABLE_LANGUAGES ?? "lt,en").split(","),
  },
});

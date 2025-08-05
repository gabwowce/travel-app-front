// src/config/env.ts
import Constants from "expo-constants";

type Extra = {
  apiBaseUrl: string;
  splashMinMs: number;
  availableLanguages: string[];
};

const extra = Constants.expoConfig?.extra as Extra;

export const ENV = {
  API_BASE_URL: extra.apiBaseUrl,
  SPLASH_MIN_MS: extra.splashMinMs,
  AVAILABLE_LANGUAGES: extra.availableLanguages,
} as const;

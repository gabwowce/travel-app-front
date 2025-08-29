export const AppRoutes = {
  // Auth
  LOGIN: "/(auth)",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/(auth)/forgotPassword",

  // Onboarding
  ONBOARDING: "/(onboarding)",

  // Tabs
  HOME: "/(app)/(tabs)/home",
  FAVORITES: "/(app)/(tabs)/03-saved",

  // Profile
  PROFILE: "/(app)/profile",
  EDIT_PROFILE: "/05-profile/editProfile",
  CHANGE_PASSWORD: "/05-profile/changePassword",

  // Legal
  PRIVACY_POLICY: "/(auth)/privacy",

  // Routes
  routeDetails: (id: string | number) => `/(app)/routes/${id}`,
  routeMap: (id: string | number) => `/routes/${id}/map`,

  // Utility
  root: "/",
} as const; // ← svarbiausia dalis

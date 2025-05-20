// src/config/routes.ts

export const AppRoutes = {
  // Auth
  LOGIN: "/(auth)/index",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/(auth)/forgotPassword",

  // Onboarding
  ONBOARDING: "/(onboarding)",

  // Tabs
  HOME: "/(app)/(tabs)/home",
  FAVORITES: "/(app)/(tabs)/saved",

  // Profile
  PROFILE: "/(app)/profile",
  EDIT_PROFILE: "/05-profile/editProfile",
  CHANGE_PASSWORD: "/05-profile/changePassword",

  // Legal
  PRIVACY_POLICY: "/(legal)/privacy",

  // Routes
  routeDetails: (id: string | number) => `/(app)/routes/${id}`,
  routeMap: (id: string | number) => `/(app)/routes/${id}/map`,

  // Other utility
  root: "/", // Index redirect if needed
};

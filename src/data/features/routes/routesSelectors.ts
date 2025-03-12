import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "@/src/data/store";

// Gauti visą routes būseną
export const selectRoutesState = (state: RootState) => state.routes;

// Gauti visus maršrutus
export const selectRoutes = (state: RootState) => state.routes.routes;

// Gauti rekomenduojamus maršrutus
export const selectFeaturedRoutes = (state: RootState) => state.routes.featuredRoutes;

// Gauti konkretų pasirinktą maršrutą
export const selectSelectedRoute = (state: RootState) => state.routes.selectedRoute;

// Gauti maršrutų užkrovimo būseną
export const selectRoutesLoading = (state: RootState) => state.routes.loading;

// Gauti klaidas, jei buvo nesėkmingas užklausos atsakymas
export const selectRoutesError = (state: RootState) => state.routes.error;


// 🔹 Atrenka tik maršrutus su daugiau nei 4 žvaigždučių vidurkiu
export const selectHighlyRatedRoutes = createSelector(
    [selectRoutes],
    (routes) => routes.filter((route) => route.ratings_avg_rating >= 4)
  );
  
// 🔹 Atrenka maršrutus pagal vartotojo pasirinktą kategoriją
export const selectRoutesByCategory = (categoryId: number) =>
createSelector([selectRoutes], (routes) =>
    routes.filter((route) => route.categories.some((cat) => cat.id === categoryId))
);

// 🔹 Atrenka maršrutus pagal vartotojo pasirinktą miestą
export const selectRoutesByCity = (cityId: number) =>
createSelector([selectRoutes], (routes) => routes.filter((route) => route.city.id === cityId));
  
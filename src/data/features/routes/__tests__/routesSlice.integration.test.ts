import { configureStore } from "@reduxjs/toolkit";
import routesReducer from "../routesSlice";
import { fetchRoutes, fetchFeaturedRoutes, fetchRouteById } from "../routesThunks";
import { AuthenticationService } from "@/src/api/generated/services/AuthenticationService";
import { OpenAPI } from "@/src/api/generated/core/OpenAPI";
import type { Route } from "@/src/api/generated/models/Route";

const createTestStore = () =>
  configureStore({
    reducer: {
      routes: routesReducer,
    },
  });

describe("🧩 Integration Test: routesSlice with real API", () => {
  let store: ReturnType<typeof createTestStore>;

  const testUser = {
    name: "Test User",
    email: `testuser_${Date.now()}@example.com`,
    password: "password123",
    password_confirmation: "password123",
  };

  beforeAll(async () => {
    store = createTestStore();

    // Registruojam vartotoją
    await AuthenticationService.registerUser(testUser);

    // Prisijungiam vartotoju
    const response = await AuthenticationService.loginUser({
      email: testUser.email,
      password: testUser.password,
    });

    console.log("✅ Login response:", response);
    expect(response.data?.token).toBeDefined();

    // Išsaugom token į OpenAPI globalius nustatymus
    OpenAPI.TOKEN = response.data?.token!;
  });

  it("should fetch all routes successfully", async () => {
    const response = await store.dispatch(fetchRoutes({ page: 1, perPage: 10 }));
    console.log("✅ fetchRoutes response:", response.payload);

    expect(response.type).toContain("/fulfilled");
  });

  it("should fetch featured routes successfully", async () => {
    const response = await store.dispatch(fetchFeaturedRoutes({ limit: 5 }));
    console.log("✅ fetchFeaturedRoutes response:", response.payload);

    expect(response.type).toContain("/fulfilled");
  });

  it("should fetch route by ID (if routes exist)", async () => {
    const fetchRoutesResponse = await store.dispatch(fetchRoutes({ page: 1, perPage: 10 }));

    const routes = fetchRoutesResponse.payload as Route[]; 

    if (routes.length > 0 && routes[0].id) {
      const routeId = routes[0].id!;
      const response = await store.dispatch(fetchRouteById(routeId));

      console.log("✅ fetchRouteById response:", response.payload);

      expect(response.type).toContain("/fulfilled");
      expect(response.payload?.id).toBe(routeId);
    } else {
      console.warn("⚠️ No routes found to test fetchRouteById");
    }
  });
});

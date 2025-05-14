import { configureStore } from "@reduxjs/toolkit";
import placesReducer from "../placesSlice";
import * as placesThunks from "../placesThunks";
import { AuthenticationService } from "@/src/api/generated/services/AuthenticationService";
import { OpenAPI } from "@/src/api/generated/core/OpenAPI";
import type { PlaceRequest } from "@/src/api/generated/index";

const createTestStore = () =>
  configureStore({
    reducer: {
      places: placesReducer,
    },
  });

describe("🌍 API Integration Test Suite", () => {
  let store: ReturnType<typeof createTestStore>;
  let createdPlaceId: number | null = null;

  const testUser = {
    name: "Test User",
    email: `testuser_${Date.now()}@example.com`, // dinaminis email
    password: "password123",
    password_confirmation: "password123",
  };

  const testPlaceData: PlaceRequest = {
    name: "Integration Test Place",
    description: "Test place created during integration tests",
    city_id: 1,
    category_id: 1,
    latitude: 54.6872,
    longitude: 25.2797,
  };

  beforeAll(() => {
    store = createTestStore();
  });

  describe("🧩 Auth flow", () => {
    it("should register new user", async () => {
      const response = await AuthenticationService.registerUser(testUser);
      console.log("✅ Registration response:", response);
      expect(response.status).toBe("success");
    });

    it("should login existing user", async () => {
      const response = await AuthenticationService.loginUser({
        email: testUser.email,
        password: testUser.password,
      });
      console.log("✅ Login response:", response);

      expect(response.data?.token).toBeDefined();

      // Saugom token
      OpenAPI.TOKEN = response.data?.token!;
    });
  });

  describe("🧩 Places flow", () => {
    it("should fetch places", async () => {
      const response = await store.dispatch(placesThunks.fetchPlaces({}));
      console.log("✅ fetchPlaces response:", response.payload);
      expect(response.type).toContain("/fulfilled");
    });

    // Toliau pridėsim createPlace, updatePlace, deletePlace testus
  });
});

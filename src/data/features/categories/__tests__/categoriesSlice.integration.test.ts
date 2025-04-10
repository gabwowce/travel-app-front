import { configureStore } from "@reduxjs/toolkit";
import categoriesReducer from "../categoriesSlice";
import { fetchCategories } from "../categoriesThunks";
import { AuthenticationService } from "@/src/api/generated/services/AuthenticationService";
import { OpenAPI } from "@/src/api/generated/core/OpenAPI";

const createTestStore = () =>
  configureStore({
    reducer: {
      categories: categoriesReducer,
    },
  });

describe("🧩 Integration Test: categoriesSlice with real API", () => {
  let store: ReturnType<typeof createTestStore>;

  const testUser = {
    name: "Test User",
    email: `testuser_${Date.now()}@example.com`,
    password: "password123",
    password_confirmation: "password123",
  };

  beforeAll(async () => {
    store = createTestStore();

    // Sukuriam user
    await AuthenticationService.registerUser(testUser);

    // Login
    const response = await AuthenticationService.loginUser({
      email: testUser.email,
      password: testUser.password,
    });

    console.log("✅ Login response:", response);
    expect(response.data?.token).toBeDefined();

    OpenAPI.TOKEN = response.data?.token!;
  });

  it("should fetch categories successfully", async () => {
    const response = await store.dispatch(fetchCategories());
    console.log("✅ fetchCategories response:", response.payload);

    expect(response.type).toContain("/fulfilled");
    expect(Array.isArray(response.payload)).toBe(true);
  });
});

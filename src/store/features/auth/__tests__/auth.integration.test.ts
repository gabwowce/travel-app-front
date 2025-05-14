// src/data/features/auth/__tests__/auth.integration.test.ts

import { AuthenticationService } from "@/src/api/generated/services/AuthenticationService";
import { OpenAPI } from "@/src/api/generated/core/OpenAPI";

describe("🌍 API Integration Test Suite - Auth", () => {
  const testUser = {
    name: "Test User",
    email: `testuser_${Date.now()}@example.com`,
    password: "password123",
    password_confirmation: "password123",
  };

  let token: string | null = null;

  // ✅ Register
  it("should register new user", async () => {
    const response = await AuthenticationService.registerUser(testUser);
    console.log("✅ Registration response:", response);

    expect(response.status).toBe("success");
    expect(response.data?.token).toBeDefined();
    expect(response.data?.user?.email).toBe(testUser.email);

    token = response.data?.token!;
    OpenAPI.TOKEN = token; // saugom tolesniems testams
  });

  // ✅ Login
  it("should login existing user", async () => {
    const response = await AuthenticationService.loginUser({
      email: testUser.email,
      password: testUser.password,
    });
    console.log("✅ Login response:", response);

    expect(response.status).toBe("success");
    expect(response.data?.token).toBeDefined();
    expect(response.data?.user?.email).toBe(testUser.email);

    token = response.data?.token!;
    OpenAPI.TOKEN = token;
  });

  // ✅ Get current user
  it("should get current user info", async () => {
    if (!token) throw new Error("No token available");

    const response = await AuthenticationService.getCurrentUser();
    console.log("✅ Current user response:", response);

    expect(response.status).toBe("success");
    expect(response.data?.email).toBe(testUser.email);
  });

  // ✅ Logout
  it("should logout user", async () => {
    if (!token) throw new Error("No token available");

    const response = await AuthenticationService.logoutUser();
    console.log("✅ Logout response:", response);

    expect(response.status).toBe("success");
    expect(response.message).toContain("successfully");

    // Išvalom token po logout
    OpenAPI.TOKEN = undefined;
  });
});

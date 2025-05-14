// src/data/features/auth/__tests__/authSlice.test.ts

import { configureStore } from "@reduxjs/toolkit";
import authReducer, { setUserFromStorage, clearErrors } from "../authSlice";
import * as authThunks from "../authThunks";
import { AuthenticationService } from "@/src/api/generated/services/AuthenticationService";

// 🧩 Sukuriam test store
const createTestStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
    },
  });

// 🧩 Mockinam API servisą
jest.mock("@/src/api/generated/services/AuthenticationService", () => ({
  AuthenticationService: {
    registerUser: jest.fn(),
    loginUser: jest.fn(),
    logoutUser: jest.fn(),
    getCurrentUser: jest.fn(),
  },
}));

describe("🧩 Auth Slice Unit Test", () => {
  const mockUser = { id: 1, name: "Test User", email: "test@example.com" };
  const mockToken = "fakeToken";

  let store: ReturnType<typeof createTestStore>;

  const fakeRequestMeta = {
    requestId: "requestId123",
    arg: { email: "test@example.com", password: "password123" },
  };
  const loginRequestMeta = {
    requestId: "requestId123",
    arg: {
      email: "test@example.com",
      password: "password123",
    },
  };
  
  const registerRequestMeta = {
    requestId: "requestId456",
    arg: {
      name: "Test User",
      email: "test@example.com",
      password: "password123",
      password_confirmation: "password123",
    },
  };

  beforeEach(() => {
    store = createTestStore();
    jest.clearAllMocks();
  });

  // ✅ Reducer: setUserFromStorage
  it("should handle setUserFromStorage", () => {
    store.dispatch(setUserFromStorage({ user: mockUser, token: mockToken }));
    const state = store.getState().auth;

    expect(state.isAuthenticated).toBe(true);
    expect(state.user).toEqual(mockUser);
    expect(state.token).toEqual(mockToken);
  });

  // ✅ Reducer: clearErrors
  it("should handle clearErrors", () => {
    store.dispatch(clearErrors());
    const state = store.getState().auth;

    expect(state.errors).toEqual({});
  });

  // ✅ Thunk: initAuth fulfilled
  it("should handle initAuth fulfilled", async () => {
    const fakePayload = { token: mockToken, user: mockUser };

    await store.dispatch(authThunks.initAuth.fulfilled(fakePayload, fakeRequestMeta.requestId, undefined));

    const state = store.getState().auth;
    expect(state.isAuthenticated).toBe(true);
    expect(state.token).toBe(mockToken);
    expect(state.user).toEqual(mockUser);
  });

  // ✅ Thunk: initAuth rejected
  it("should handle initAuth rejected", async () => {
    await store.dispatch(authThunks.initAuth.rejected(new Error("Init error"), fakeRequestMeta.requestId, undefined, "Init error"));

    const state = store.getState().auth;
    expect(state.isAuthenticated).toBe(false);
    expect(state.errors).toEqual("Init error");
  });

  // ✅ Thunk: login pending
  it("should handle login pending", () => {
    store.dispatch(authThunks.login.pending(loginRequestMeta.requestId, loginRequestMeta.arg));
    const state = store.getState().auth;

    expect(state.loading).toBe(true);
    expect(state.errors).toEqual({});
  });

  // ✅ Thunk: login fulfilled
  it("should handle login fulfilled", async () => {
    const fakePayload = { token: mockToken, user: mockUser };

    store.dispatch(authThunks.login.fulfilled(fakePayload, loginRequestMeta.requestId, loginRequestMeta.arg));

    const state = store.getState().auth;
    expect(state.isAuthenticated).toBe(true);
    expect(state.token).toBe(mockToken);
    expect(state.user).toEqual(mockUser);
  });

  // ✅ Thunk: login rejected
  it("should handle login rejected", async () => {
    store.dispatch(authThunks.login.rejected(new Error("Login error"), loginRequestMeta.requestId, loginRequestMeta.arg, "Login error"));

    const state = store.getState().auth;
    expect(state.loading).toBe(false);
    expect(state.errors).toEqual("Login error");
    expect(state.isAuthenticated).toBe(false);
  });

  // ✅ Thunk: register pending
  it("should handle register pending", () => {
    store.dispatch(authThunks.register.pending(registerRequestMeta.requestId, registerRequestMeta.arg));
    const state = store.getState().auth;

    expect(state.loading).toBe(true);
    expect(state.errors).toEqual({});
  });

  // ✅ Thunk: register fulfilled
  it("should handle register fulfilled", async () => {
    const fakePayload = { token: mockToken, user: mockUser };

    await store.dispatch(authThunks.register.fulfilled(fakePayload, registerRequestMeta.requestId, registerRequestMeta.arg));

    const state = store.getState().auth;
    expect(state.isAuthenticated).toBe(true);
    expect(state.token).toBe(mockToken);
    expect(state.user).toEqual(mockUser);
  });

  // ✅ Thunk: register rejected
  it("should handle register rejected", async () => {
    await store.dispatch(authThunks.register.rejected(new Error("Register error"), registerRequestMeta.requestId, registerRequestMeta.arg, "Register error"));

    const state = store.getState().auth;
    expect(state.loading).toBe(false);
    expect(state.errors).toEqual("Register error");
    expect(state.isAuthenticated).toBe(false);
  });

  // ✅ Thunk: logout fulfilled
  it("should handle logout fulfilled", async () => {
    await store.dispatch(authThunks.logout.fulfilled({}, fakeRequestMeta.requestId, undefined));

    const state = store.getState().auth;
    expect(state.isAuthenticated).toBe(false);
    expect(state.token).toBeNull();
    expect(state.user).toBeNull();
  });
});

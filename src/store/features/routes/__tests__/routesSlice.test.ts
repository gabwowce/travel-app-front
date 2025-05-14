import { configureStore } from "@reduxjs/toolkit";
import routesReducer, { clearRoutes, clearSelectedRoute } from "../routesSlice";
import * as routesThunks from "../routesThunks";
import { Route } from "@/src/api/generated/models/Route";

// 🧩 Sukuriam test store
const createTestStore = () =>
  configureStore({
    reducer: {
      routes: routesReducer,
    },
  });

describe("🧩 Routes Slice Unit Test", () => {
  const mockRoutes: Route[] = [
    { id: 1, name: "Test Route 1" },
    { id: 2, name: "Test Route 2" },
  ];

  const mockRouteDetails: Route = { id: 1, name: "Test Route 1" };

  let store: ReturnType<typeof createTestStore>;

  const fakeMeta = { requestId: "testRequestId", arg: {} };

  beforeEach(() => {
    store = createTestStore();
  });

  // ✅ Reducer: clearRoutes
  it("should handle clearRoutes", () => {
    store.dispatch(clearRoutes());
    const state = store.getState().routes;

    expect(state.routes).toEqual([]);
  });

  // ✅ Reducer: clearSelectedRoute
  it("should handle clearSelectedRoute", () => {
    store.dispatch(clearSelectedRoute());
    const state = store.getState().routes;

    expect(state.selectedRoute).toBeNull();
    expect(state.isEmptyResults).toBe(false);
  });

  // ✅ Thunk: fetchRoutes.fulfilled
  it("should handle fetchRoutes fulfilled", () => {
    store.dispatch(routesThunks.fetchRoutes.fulfilled(mockRoutes, fakeMeta.requestId, fakeMeta.arg));

    const state = store.getState().routes;
    expect(state.routes).toEqual(mockRoutes);
    expect(state.isEmptyResults).toBe(false);
  });

  // ✅ Thunk: fetchFeaturedRoutes.fulfilled
  it("should handle fetchFeaturedRoutes fulfilled", () => {
    store.dispatch(routesThunks.fetchFeaturedRoutes.fulfilled(mockRoutes, fakeMeta.requestId, fakeMeta.arg));

    const state = store.getState().routes;
    expect(state.featuredRoutes).toEqual(mockRoutes);
  });

  // ✅ Thunk: fetchRouteById.fulfilled
  it("should handle fetchRouteById fulfilled", () => {
    store.dispatch(routesThunks.fetchRouteById.fulfilled(mockRouteDetails, fakeMeta.requestId, 1));

    const state = store.getState().routes;
    expect(state.selectedRoute).toEqual(mockRouteDetails);
  });

  // ✅ Thunk: fetchRoutes.rejected
  it("should handle fetchRoutes rejected", () => {
    store.dispatch(routesThunks.fetchRoutes.rejected(new Error("Fetch failed"), fakeMeta.requestId, fakeMeta.arg));

    const state = store.getState().routes;
    expect(state.loading).toBe(false);
  });
});

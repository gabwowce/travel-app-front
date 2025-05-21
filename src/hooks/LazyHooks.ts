import { travelApi } from '../store/travelApi'; 

// 🔧 Pridedam lazy hook'us patys
export const useLazyGetCurrentUserQuery = () =>
  travelApi.endpoints.getUserProfile.useLazyQuery();

export const useLazyGetRoutesQuery = () =>
  travelApi.endpoints.getRoutes.useLazyQuery();

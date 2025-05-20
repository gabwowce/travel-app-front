import { emptySplitApi as api } from "./emptyApi";
import * as SecureStore from 'expo-secure-store';
import { setCredentials, clearAuth } from '@/src/data/features/auth/authSlice';

const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    registerUser: build.mutation<RegisterUserApiResponse, RegisterUserApiArg>({
      query: (queryArg) => ({
        url: `/api/v1/auth/register`,
        method: "POST",
        body: queryArg.registerRequest,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
    try {
      const { data } = await queryFulfilled;
      const token = data.data?.token ?? '';
      const user = data.data?.user ?? null;

      dispatch(setCredentials({ token, user }));
      await SecureStore.setItemAsync('token', token);
      await SecureStore.setItemAsync('user', JSON.stringify(user));
    } catch {}
  },
    }),

    loginUser: build.mutation<LoginUserApiResponse, LoginUserApiArg>({
      query: (arg) => ({
        url: '/api/v1/auth/login',
        method: 'POST',
        body: arg.loginRequest,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const token = data.data?.token ?? '';
          const user = data.data?.user ?? null;

          dispatch(setCredentials({ token, user }));
          await SecureStore.setItemAsync('token', token);
          await SecureStore.setItemAsync('user', JSON.stringify(user));
        } catch {}
      },
    }),
    logoutUser: build.mutation<LogoutUserApiResponse, void>({
      query: () => ({ url: '/api/v1/auth/logout', method: 'POST' }),

      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try { await queryFulfilled; } catch {}
        /* 1️⃣ Redux → tuščias */
        dispatch(clearAuth());
        /* 2️⃣ Storage → ištrinam */
        await SecureStore.deleteItemAsync('token');
        await SecureStore.deleteItemAsync('user');
      },
    }),
    getCurrentUser: build.query<
      GetCurrentUserApiResponse,
      GetCurrentUserApiArg
    >({
      query: () => ({ url: `/api/v1/auth/me` }),
    }),
    getCategories: build.query<GetCategoriesApiResponse, GetCategoriesApiArg>({
      query: () => ({ url: `/api/v1/categories` }),
    }),
    storeCategory: build.mutation<
      StoreCategoryApiResponse,
      StoreCategoryApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/categories`,
        method: "POST",
        body: queryArg.categoryRequest,
      }),
    }),
    getCategoryById: build.query<
      GetCategoryByIdApiResponse,
      GetCategoryByIdApiArg
    >({
      query: (queryArg) => ({ url: `/api/v1/categories/${queryArg.category}` }),
    }),
    updateCategory: build.mutation<
      UpdateCategoryApiResponse,
      UpdateCategoryApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/categories/${queryArg.category}`,
        method: "PUT",
        body: queryArg.categoryRequest,
      }),
    }),
    deleteCategory: build.mutation<
      DeleteCategoryApiResponse,
      DeleteCategoryApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/categories/${queryArg.category}`,
        method: "DELETE",
      }),
    }),
    getCategoryPlaces: build.query<
      GetCategoryPlacesApiResponse,
      GetCategoryPlacesApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/categories/${queryArg.category}/places`,
        params: {
          cursor: queryArg.cursor,
          limit: queryArg.limit,
          direction: queryArg.direction,
          sort: queryArg.sort,
          per_page: queryArg.perPage,
          page: queryArg.page,
        },
      }),
    }),
    getCategoryRoutes: build.query<
      GetCategoryRoutesApiResponse,
      GetCategoryRoutesApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/categories/${queryArg.category}/routes`,
        params: {
          cursor: queryArg.cursor,
          limit: queryArg.limit,
          direction: queryArg.direction,
          sort: queryArg.sort,
          per_page: queryArg.perPage,
          page: queryArg.page,
        },
      }),
    }),
    getCities: build.query<GetCitiesApiResponse, GetCitiesApiArg>({
      query: (queryArg) => ({
        url: `/api/v1/cities`,
        params: {
          country_id: queryArg.countryId,
        },
      }),
    }),
    storeCity: build.mutation<StoreCityApiResponse, StoreCityApiArg>({
      query: (queryArg) => ({
        url: `/api/v1/cities`,
        method: "POST",
        body: queryArg.cityRequest,
      }),
    }),
    getCityById: build.query<GetCityByIdApiResponse, GetCityByIdApiArg>({
      query: (queryArg) => ({ url: `/api/v1/cities/${queryArg.city}` }),
    }),
    updateCity: build.mutation<UpdateCityApiResponse, UpdateCityApiArg>({
      query: (queryArg) => ({
        url: `/api/v1/cities/${queryArg.city}`,
        method: "PUT",
        body: queryArg.cityRequest,
      }),
    }),
    deleteCity: build.mutation<DeleteCityApiResponse, DeleteCityApiArg>({
      query: (queryArg) => ({
        url: `/api/v1/cities/${queryArg.city}`,
        method: "DELETE",
      }),
    }),
    getCityRoutes: build.query<GetCityRoutesApiResponse, GetCityRoutesApiArg>({
      query: (queryArg) => ({
        url: `/api/v1/cities/${queryArg.city}/routes`,
        params: {
          cursor: queryArg.cursor,
          limit: queryArg.limit,
          direction: queryArg.direction,
          sort: queryArg.sort,
          per_page: queryArg.perPage,
          page: queryArg.page,
        },
      }),
    }),
    getCityPlaces: build.query<GetCityPlacesApiResponse, GetCityPlacesApiArg>({
      query: (queryArg) => ({ url: `/api/v1/cities/${queryArg.city}/places` }),
    }),
    getCountries: build.query<GetCountriesApiResponse, GetCountriesApiArg>({
      query: () => ({ url: `/api/v1/countries` }),
    }),
    getCountryById: build.query<
      GetCountryByIdApiResponse,
      GetCountryByIdApiArg
    >({
      query: (queryArg) => ({ url: `/api/v1/countries/${queryArg.country}` }),
    }),
    getCountryCities: build.query<
      GetCountryCitiesApiResponse,
      GetCountryCitiesApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/countries/${queryArg.country}/cities`,
        params: {
          cursor: queryArg.cursor,
          limit: queryArg.limit,
          direction: queryArg.direction,
          sort: queryArg.sort,
        },
      }),
    }),
    getCountryRoutes: build.query<
      GetCountryRoutesApiResponse,
      GetCountryRoutesApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/countries/${queryArg.country}/routes`,
        params: {
          cursor: queryArg.cursor,
          limit: queryArg.limit,
          direction: queryArg.direction,
          sort: queryArg.sort,
        },
      }),
    }),
    getUserFavorites: build.query<
      GetUserFavoritesApiResponse,
      GetUserFavoritesApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/favorites`,
        params: {
          cursor: queryArg.cursor,
          limit: queryArg.limit,
          direction: queryArg.direction,
          sort: queryArg.sort,
          per_page: queryArg.perPage,
          page: queryArg.page,
        },
      }),
    }),
    addRouteToFavorites: build.mutation<
      AddRouteToFavoritesApiResponse,
      AddRouteToFavoritesApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/favorites/${queryArg.route}`,
        method: "POST",
      }),
    }),
    removeRouteFromFavorites: build.mutation<
      RemoveRouteFromFavoritesApiResponse,
      RemoveRouteFromFavoritesApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/favorites/${queryArg.route}`,
        method: "DELETE",
      }),
    }),
    getApiV1GeoPoints: build.query<
      GetApiV1GeoPointsApiResponse,
      GetApiV1GeoPointsApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/geo-points`,
        params: {
          cursor: queryArg.cursor,
          limit: queryArg.limit,
          route_id: queryArg.routeId,
          place_id: queryArg.placeId,
        },
      }),
    }),
    a8Eb7087F46Bb8E91A1Dfce6Fe98Ba0B: build.mutation<
      A8Eb7087F46Bb8E91A1Dfce6Fe98Ba0BApiResponse,
      A8Eb7087F46Bb8E91A1Dfce6Fe98Ba0BApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/geo-points`,
        method: "POST",
        body: queryArg.body,
      }),
    }),
    d51F8C13A133544B57Bb9F545D3F2C3C: build.query<
      D51F8C13A133544B57Bb9F545D3F2C3CApiResponse,
      D51F8C13A133544B57Bb9F545D3F2C3CApiArg
    >({
      query: (queryArg) => ({ url: `/api/v1/geo-points/${queryArg.id}` }),
    }),
    putApiV1GeoPointsById: build.mutation<
      PutApiV1GeoPointsByIdApiResponse,
      PutApiV1GeoPointsByIdApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/geo-points/${queryArg.id}`,
        method: "PUT",
        body: queryArg.body,
      }),
    }),
    d5A8A272785D771766F5814512228C47: build.mutation<
      D5A8A272785D771766F5814512228C47ApiResponse,
      D5A8A272785D771766F5814512228C47ApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/geo-points/${queryArg.id}`,
        method: "DELETE",
      }),
    }),
    getPlaces: build.query<GetPlacesApiResponse, GetPlacesApiArg>({
      query: (queryArg) => ({
        url: `/api/v1/places`,
        params: {
          city_id: queryArg.cityId,
          category_id: queryArg.categoryId,
          cursor: queryArg.cursor,
          limit: queryArg.limit,
          direction: queryArg.direction,
          sort: queryArg.sort,
          per_page: queryArg.perPage,
          page: queryArg.page,
        },
      }),
    }),
    storePlace: build.mutation<StorePlaceApiResponse, StorePlaceApiArg>({
      query: (queryArg) => ({
        url: `/api/v1/places`,
        method: "POST",
        body: queryArg.placeRequest,
      }),
    }),
    getPlaceById: build.query<GetPlaceByIdApiResponse, GetPlaceByIdApiArg>({
      query: (queryArg) => ({ url: `/api/v1/places/${queryArg.place}` }),
    }),
    updatePlace: build.mutation<UpdatePlaceApiResponse, UpdatePlaceApiArg>({
      query: (queryArg) => ({
        url: `/api/v1/places/${queryArg.place}`,
        method: "PUT",
        body: queryArg.placeRequest,
      }),
    }),
    deletePlace: build.mutation<DeletePlaceApiResponse, DeletePlaceApiArg>({
      query: (queryArg) => ({
        url: `/api/v1/places/${queryArg.place}`,
        method: "DELETE",
      }),
    }),
    getPlaceRoutes: build.query<
      GetPlaceRoutesApiResponse,
      GetPlaceRoutesApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/places/${queryArg.place}/routes`,
        params: {
          cursor: queryArg.cursor,
          limit: queryArg.limit,
          direction: queryArg.direction,
          sort: queryArg.sort,
          per_page: queryArg.perPage,
          page: queryArg.page,
        },
      }),
    }),
    getUserRatingsList: build.query<
      GetUserRatingsListApiResponse,
      GetUserRatingsListApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/ratings`,
        params: {
          cursor: queryArg.cursor,
          limit: queryArg.limit,
          direction: queryArg.direction,
          per_page: queryArg.perPage,
          page: queryArg.page,
        },
      }),
    }),
    getRouteRatings: build.query<
      GetRouteRatingsApiResponse,
      GetRouteRatingsApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/routes/${queryArg.route}/ratings`,
        params: {
          cursor: queryArg.cursor,
          limit: queryArg.limit,
          direction: queryArg.direction,
          per_page: queryArg.perPage,
          page: queryArg.page,
        },
      }),
    }),
    storeRating: build.mutation<StoreRatingApiResponse, StoreRatingApiArg>({
      query: (queryArg) => ({
        url: `/api/v1/routes/${queryArg.route}/ratings`,
        method: "POST",
        body: queryArg.ratingRequest,
      }),
    }),
    updateRating: build.mutation<UpdateRatingApiResponse, UpdateRatingApiArg>({
      query: (queryArg) => ({
        url: `/api/v1/ratings/${queryArg.rating}`,
        method: "PUT",
        body: queryArg.ratingRequest,
      }),
    }),
    deleteRating: build.mutation<DeleteRatingApiResponse, DeleteRatingApiArg>({
      query: (queryArg) => ({
        url: `/api/v1/ratings/${queryArg.rating}`,
        method: "DELETE",
      }),
    }),
    getRoutes: build.query<GetRoutesApiResponse, GetRoutesApiArg>({
      query: (queryArg) => ({
        url: `/api/v1/routes`,
        params: {
          country_id: queryArg.countryId,
          city_id: queryArg.cityId,
          category_id: queryArg.categoryId,
          difficulty: queryArg.difficulty,
          min_distance: queryArg.minDistance,
          max_distance: queryArg.maxDistance,
          min_elevation: queryArg.minElevation,
          max_elevation: queryArg.maxElevation,
          search: queryArg.search,
          cursor: queryArg.cursor,
          limit: queryArg.limit,
          direction: queryArg.direction,
          sort: queryArg.sort,
        },
      }),
    }),
    getFeaturedRoutes: build.query<
      GetFeaturedRoutesApiResponse,
      GetFeaturedRoutesApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/routes/featured`,
        params: {
          limit: queryArg.limit,
        },
      }),
    }),
    getRouteById: build.query<GetRouteByIdApiResponse, GetRouteByIdApiArg>({
      query: (queryArg) => ({ url: `/api/v1/routes/${queryArg.route}` }),
    }),
    getRoutePlaces: build.query<
      GetRoutePlacesApiResponse,
      GetRoutePlacesApiArg
    >({
      query: (queryArg) => ({ url: `/api/v1/routes/${queryArg.route}/places` }),
    }),
    searchResources: build.query<
      SearchResourcesApiResponse,
      SearchResourcesApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/search`,
        params: {
          query: queryArg.query,
          type: queryArg["type"],
          cursor: queryArg.cursor,
          limit: queryArg.limit,
          direction: queryArg.direction,
        },
      }),
    }),
    searchContent: build.query<SearchContentApiResponse, SearchContentApiArg>({
      query: (queryArg) => ({
        url: `/search`,
        params: {
          query: queryArg.query,
          type: queryArg["type"],
          cursor: queryArg.cursor,
          limit: queryArg.limit,
          direction: queryArg.direction,
        },
      }),
    }),
    getUserProfile: build.query<
      GetUserProfileApiResponse,
      GetUserProfileApiArg
    >({
      query: () => ({ url: `/api/v1/user` }),
    }),
    updateUserProfile: build.mutation<
      UpdateUserProfileApiResponse,
      UpdateUserProfileApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/user`,
        method: "PUT",
        body: queryArg.userUpdateRequest,
      }),
    }),
    getUserProfileFavorites: build.query<
      GetUserProfileFavoritesApiResponse,
      GetUserProfileFavoritesApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/user/favorites`,
        params: {
          cursor: queryArg.cursor,
          limit: queryArg.limit,
          direction: queryArg.direction,
          sort: queryArg.sort,
          per_page: queryArg.perPage,
          page: queryArg.page,
        },
      }),
    }),
    getUserRatings: build.query<
      GetUserRatingsApiResponse,
      GetUserRatingsApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/user/ratings`,
        params: {
          cursor: queryArg.cursor,
          limit: queryArg.limit,
          direction: queryArg.direction,
          per_page: queryArg.perPage,
          page: queryArg.page,
        },
      }),
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as travelApi };
export type RegisterUserApiResponse =
  /** status 201 User registered successfully */ AuthResponse;
export type RegisterUserApiArg = {
  registerRequest: RegisterRequest;
};
export type LoginUserApiResponse =
  /** status 200 User logged in successfully */ {
    status?: string;
    message?: string;
    data?: {
      user?: UserResponse;
      token?: string;
    };
  };
export type LoginUserApiArg = {
  loginRequest: LoginRequest;
};
export type LogoutUserApiResponse = /** status 200 Logged out successfully */ {
  status?: string;
  message?: string;
  data?: object;
};
export type LogoutUserApiArg = void;
export type GetCurrentUserApiResponse =
  /** status 200 User information retrieved */ {
    status?: string;
    message?: string;
    data?: {
      id?: number;
      name?: string;
      email?: string;
    };
  };
export type GetCurrentUserApiArg = void;
export type GetCategoriesApiResponse = /** status 200 List of categories */ {
  status?: string;
  message?: string;
  data?: Category[];
};
export type GetCategoriesApiArg = void;
export type StoreCategoryApiResponse =
  /** status 201 Category created successfully */ {
    status?: string;
    message?: string;
    data?: Category;
  };
export type StoreCategoryApiArg = {
  categoryRequest: CategoryRequest;
};
export type GetCategoryByIdApiResponse = /** status 200 Category found */ {
  status?: string;
  message?: string;
  data?: Category;
};
export type GetCategoryByIdApiArg = {
  /** Category ID or slug */
  category: string;
};
export type UpdateCategoryApiResponse =
  /** status 200 Category updated successfully */ {
    status?: string;
    message?: string;
    data?: Category;
  };
export type UpdateCategoryApiArg = {
  /** Category ID or slug */
  category: string;
  categoryRequest: CategoryRequest;
};
export type DeleteCategoryApiResponse =
  /** status 200 Category deleted successfully */ {
    status?: string;
    message?: string;
    data?: string[];
  };
export type DeleteCategoryApiArg = {
  /** Category ID or slug */
  category: string;
};
export type GetCategoryPlacesApiResponse =
  /** status 200 List of places in the category */ {
    status?: string;
    message?: string;
    data?: object[];
    pagination?: {
      next_cursor?: string | null;
      previous_cursor?: string | null;
      has_next?: boolean;
      has_previous?: boolean;
      total?: number;
      limit?: number;
    };
  };
export type GetCategoryPlacesApiArg = {
  /** Category ID or slug */
  category: string;
  /** Cursor for pagination */
  cursor?: string;
  /** Maximum items per page */
  limit?: number;
  /** Pagination direction */
  direction?: "forward" | "backend";
  /** Sort field */
  sort?: "name" | "name_desc" | "created_at" | "created_at_desc";
  /** Results per page (DEPRECATED - use limit instead) */
  perPage?: number;
  /** Page number (DEPRECATED - use cursor instead) */
  page?: number;
};
export type GetCategoryRoutesApiResponse =
  /** status 200 List of routes in the category */ {
    status?: string;
    message?: string;
    data?: object[];
    pagination?: {
      next_cursor?: string | null;
      previous_cursor?: string | null;
      has_next?: boolean;
      has_previous?: boolean;
      total?: number;
      limit?: number;
    };
  };
export type GetCategoryRoutesApiArg = {
  /** Category ID or slug */
  category: string;
  /** Cursor for pagination */
  cursor?: string;
  /** Maximum items per page */
  limit?: number;
  /** Pagination direction */
  direction?: "forward" | "backend";
  /** Sort field */
  sort?:
    | "name"
    | "name_desc"
    | "created_at"
    | "created_at_desc"
    | "rating"
    | "rating_desc";
  /** Results per page (DEPRECATED - use limit instead) */
  perPage?: number;
  /** Page number (DEPRECATED - use cursor instead) */
  page?: number;
};
export type GetCitiesApiResponse = /** status 200 List of cities */ {
  status?: string;
  message?: string;
  data?: City[];
};
export type GetCitiesApiArg = {
  /** Filter cities by country ID */
  countryId?: number;
};
export type StoreCityApiResponse = /** status 201 City created successfully */ {
  message?: string;
  data?: City;
};
export type StoreCityApiArg = {
  cityRequest: CityRequest;
};
export type GetCityByIdApiResponse = /** status 200 City details */ {
  status?: string;
  message?: string;
  data?: City & {
    routes?: Route[];
  };
};
export type GetCityByIdApiArg = {
  /** City ID or slug */
  city: string;
};
export type UpdateCityApiResponse =
  /** status 200 City updated successfully */ {
    message?: string;
    data?: City;
  };
export type UpdateCityApiArg = {
  /** City ID or slug */
  city: string;
  cityRequest: CityRequest;
};
export type DeleteCityApiResponse =
  /** status 200 City deleted successfully */ {
    message?: string;
  };
export type DeleteCityApiArg = {
  /** City ID or slug */
  city: string;
};
export type GetCityRoutesApiResponse = /** status 200 List of routes */ {
  status?: string;
  message?: string;
  data?: Route[];
  pagination?: {
    next_cursor?: string | null;
    previous_cursor?: string | null;
    has_next?: boolean;
    has_previous?: boolean;
    total?: number;
    limit?: number;
  };
};
export type GetCityRoutesApiArg = {
  /** City ID or slug */
  city: string;
  /** Cursor for pagination */
  cursor?: string;
  /** Maximum items per page */
  limit?: number;
  /** Pagination direction */
  direction?: "forward" | "backend";
  /** Sort field */
  sort?: "name" | "name_desc" | "created_at" | "created_at_desc";
  /** Results per page (DEPRECATED - use limit instead) */
  perPage?: number;
  /** Page number (DEPRECATED - use cursor instead) */
  page?: number;
};
export type GetCityPlacesApiResponse = /** status 200 List of places */ {
  status?: string;
  message?: string;
  data?: Place[];
};
export type GetCityPlacesApiArg = {
  /** City ID or slug */
  city: string;
};
export type GetCountriesApiResponse = /** status 200 List of countries */ {
  status?: string;
  message?: string;
  data?: Country[];
};
export type GetCountriesApiArg = void;
export type GetCountryByIdApiResponse = /** status 200 Country details */ {
  status?: string;
  message?: string;
  data?: CountryWithCities;
};
export type GetCountryByIdApiArg = {
  /** Country ID or code */
  country: string;
};
export type GetCountryCitiesApiResponse = /** status 200 List of cities */ {
  status?: string;
  message?: string;
  data?: {
    id?: number;
    name?: string;
    country_id?: number;
    routes_count?: number;
  }[];
  pagination?: {
    next_cursor?: string | null;
    previous_cursor?: string | null;
    has_next?: boolean;
    has_previous?: boolean;
    total?: number;
    limit?: number;
  };
};
export type GetCountryCitiesApiArg = {
  /** Country ID or code */
  country: string;
  /** Cursor for pagination */
  cursor?: string;
  /** Maximum items per page */
  limit?: number;
  /** Pagination direction */
  direction?: "forward" | "backend";
  /** Sort field */
  sort?: "name" | "name_desc" | "routes_count" | "routes_count_desc";
};
export type GetCountryRoutesApiResponse = /** status 200 List of routes */ {
  status?: string;
  message?: string;
  data?: Route[];
  pagination?: {
    next_cursor?: string | null;
    previous_cursor?: string | null;
    has_next?: boolean;
    has_previous?: boolean;
    total?: number;
    limit?: number;
  };
};
export type GetCountryRoutesApiArg = {
  /** Country ID or code */
  country: string;
  /** Cursor for pagination */
  cursor?: string;
  /** Maximum items per page */
  limit?: number;
  /** Pagination direction */
  direction?: "forward" | "backend";
  /** Sort field */
  sort?: "name" | "name_desc" | "created_at" | "created_at_desc";
};
export type GetUserFavoritesApiResponse =
  /** status 200 List of favorite routes */ {
    status?: string;
    message?: string;
    data?: Route[];
    pagination?: {
      next_cursor?: string | null;
      previous_cursor?: string | null;
      has_next?: boolean;
      has_previous?: boolean;
      total?: number;
      limit?: number;
    };
  };
export type GetUserFavoritesApiArg = {
  /** Cursor for pagination */
  cursor?: string;
  /** Maximum items per page */
  limit?: number;
  /** Pagination direction */
  direction?: "forward" | "backend";
  /** Sort field */
  sort?: "created_at" | "created_at_desc" | "name" | "name_desc";
  /** Results per page (DEPRECATED - use limit instead) */
  perPage?: number;
  /** Page number (DEPRECATED - use cursor instead) */
  page?: number;
};
export type AddRouteToFavoritesApiResponse =
  /** status 201 Route added to favorites */ {
    status?: string;
    message?: string;
    data?: {
      route_id?: number;
    };
  };
export type AddRouteToFavoritesApiArg = {
  /** Route ID */
  route: number;
};
export type RemoveRouteFromFavoritesApiResponse =
  /** status 204 Route removed from favorites */ {
    status?: string;
    message?: string;
    data?: null;
  };
export type RemoveRouteFromFavoritesApiArg = {
  /** Route ID */
  route: number;
};
export type GetApiV1GeoPointsApiResponse =
  /** status 200 Successful operation */ {
    data?: GeoPoint[];
    pagination?: CursorPagination;
  };
export type GetApiV1GeoPointsApiArg = {
  /** Cursor for pagination */
  cursor?: string;
  /** Number of items per page (default: 20, max: 100) */
  limit?: number;
  /** Filter by route ID */
  routeId?: number;
  /** Filter by place ID */
  placeId?: number;
};
export type A8Eb7087F46Bb8E91A1Dfce6Fe98Ba0BApiResponse =
  /** status 201 Geo point created successfully */ {
    data?: GeoPoint;
    meta?: Meta;
  };
export type A8Eb7087F46Bb8E91A1Dfce6Fe98Ba0BApiArg = {
  body: {
    route_id: number;
    place_id?: number | null;
    latitude: number;
    longitude: number;
    name: string;
    description?: string;
    elevation?: number;
    order?: number;
    type?: string;
  };
};
export type D51F8C13A133544B57Bb9F545D3F2C3CApiResponse =
  /** status 200 Successful operation */ {
    data?: GeoPoint;
    meta?: Meta;
  };
export type D51F8C13A133544B57Bb9F545D3F2C3CApiArg = {
  /** ID of geo point */
  id: number;
};
export type PutApiV1GeoPointsByIdApiResponse =
  /** status 200 Geo point updated successfully */ {
    data?: GeoPoint;
    meta?: Meta;
  };
export type PutApiV1GeoPointsByIdApiArg = {
  /** ID of geo point */
  id: number;
  body: {
    route_id?: number;
    place_id?: number | null;
    latitude?: number;
    longitude?: number;
    name?: string;
    description?: string;
    elevation?: number;
    order?: number;
    type?: string;
  };
};
export type D5A8A272785D771766F5814512228C47ApiResponse =
  /** status 200 Geo point deleted successfully */ {
    meta?: Meta;
  };
export type D5A8A272785D771766F5814512228C47ApiArg = {
  /** ID of geo point */
  id: number;
};
export type GetPlacesApiResponse = /** status 200 List of places */ {
  status?: string;
  message?: string;
  data?: Place[];
  pagination?: {
    next_cursor?: string | null;
    previous_cursor?: string | null;
    has_next?: boolean;
    has_previous?: boolean;
    total?: number;
    limit?: number;
  };
};
export type GetPlacesApiArg = {
  /** Filter by city ID */
  cityId?: number;
  /** Filter by category ID */
  categoryId?: number;
  /** Cursor for pagination */
  cursor?: string;
  /** Maximum items per page */
  limit?: number;
  /** Pagination direction */
  direction?: "forward" | "backend";
  /** Sort field */
  sort?: "name" | "name_desc" | "created_at" | "created_at_desc";
  /** Results per page (DEPRECATED - use limit instead) */
  perPage?: number;
  /** Page number (DEPRECATED - use cursor instead) */
  page?: number;
};
export type StorePlaceApiResponse =
  /** status 201 Place created successfully */ {
    status?: string;
    message?: string;
    data?: Place;
  };
export type StorePlaceApiArg = {
  placeRequest: PlaceRequest;
};
export type GetPlaceByIdApiResponse = /** status 200 Place details */ {
  status?: string;
  message?: string;
  data?: Place;
};
export type GetPlaceByIdApiArg = {
  /** Place ID */
  place: number;
};
export type UpdatePlaceApiResponse =
  /** status 200 Place updated successfully */ {
    status?: string;
    message?: string;
    data?: Place;
  };
export type UpdatePlaceApiArg = {
  /** Place ID */
  place: number;
  placeRequest: PlaceRequest;
};
export type DeletePlaceApiResponse =
  /** status 204 Place deleted successfully */ {
    status?: string;
    message?: string;
    data?: null;
  };
export type DeletePlaceApiArg = {
  /** Place ID */
  place: number;
};
export type GetPlaceRoutesApiResponse =
  /** status 200 List of routes containing the place */ {
    status?: string;
    message?: string;
    data?: Route[];
    pagination?: {
      next_cursor?: string | null;
      previous_cursor?: string | null;
      has_next?: boolean;
      has_previous?: boolean;
      total?: number;
      limit?: number;
    };
  };
export type GetPlaceRoutesApiArg = {
  /** Place ID */
  place: number;
  /** Cursor for pagination */
  cursor?: string;
  /** Maximum items per page */
  limit?: number;
  /** Pagination direction */
  direction?: "forward" | "backend";
  /** Sort field */
  sort?:
    | "name"
    | "name_desc"
    | "created_at"
    | "created_at_desc"
    | "rating"
    | "rating_desc";
  /** Results per page (DEPRECATED - use limit instead) */
  perPage?: number;
  /** Page number (DEPRECATED - use cursor instead) */
  page?: number;
};
export type GetUserRatingsListApiResponse =
  /** status 200 List of user ratings */ {
    status?: string;
    message?: string;
    data?: Rating[];
  };
export type GetUserRatingsListApiArg = {
  /** Cursor for pagination */
  cursor?: string;
  /** Maximum items per page */
  limit?: number;
  /** Pagination direction */
  direction?: "forward" | "backend";
  /** Results per page (DEPRECATED - use limit instead) */
  perPage?: number;
  /** Page number (DEPRECATED - use cursor instead) */
  page?: number;
};
export type GetRouteRatingsApiResponse = /** status 200 List of ratings */ {
  status?: string;
  message?: string;
  data?: Rating[];
  pagination?: {
    next_cursor?: string | null;
    previous_cursor?: string | null;
    has_next?: boolean;
    has_previous?: boolean;
    total?: number;
    limit?: number;
  };
};
export type GetRouteRatingsApiArg = {
  /** Route ID or slug */
  route: string;
  /** Cursor for pagination */
  cursor?: string;
  /** Maximum items per page */
  limit?: number;
  /** Pagination direction */
  direction?: "forward" | "backend";
  /** Results per page (DEPRECATED - use limit instead) */
  perPage?: number;
  /** Page number (DEPRECATED - use cursor instead) */
  page?: number;
};
export type StoreRatingApiResponse =
  /** status 201 Rating created successfully */ {
    status?: string;
    message?: string;
    data?: Rating;
  };
export type StoreRatingApiArg = {
  /** Route ID or slug */
  route: string;
  ratingRequest: RatingRequest;
};
export type UpdateRatingApiResponse =
  /** status 200 Rating updated successfully */ {
    status?: string;
    message?: string;
    data?: Rating;
  };
export type UpdateRatingApiArg = {
  /** Rating ID */
  rating: number;
  ratingRequest: RatingRequest;
};
export type DeleteRatingApiResponse = unknown;
export type DeleteRatingApiArg = {
  /** Rating ID */
  rating: number;
};
export type GetRoutesApiResponse = /** status 200 List of routes */ {
  data?: Route[];
  pagination?: {
    next_cursor?: string | null;
    previous_cursor?: string | null;
    has_next?: boolean;
    has_previous?: boolean;
    total?: number;
    limit?: number;
  };
};
export type GetRoutesApiArg = {
  /** Filter by country ID */
  countryId?: number;
  /** Filter by city ID */
  cityId?: number;
  /** Filter by category ID */
  categoryId?: number;
  /** Filter by difficulty level */
  difficulty?: ("easy" | "moderate" | "challenging" | "difficult")[];
  /** Filter by minimum distance (km) */
  minDistance?: number;
  /** Filter by maximum distance (km) */
  maxDistance?: number;
  /** Filter by minimum elevation gain (m) */
  minElevation?: number;
  /** Filter by maximum elevation gain (m) */
  maxElevation?: number;
  /** Search routes by name */
  search?: string;
  /** Opaque string pointing to a specific item in the result set. Valid for 30 minutes after generation. */
  cursor?: string;
  /** Maximum items per page */
  limit?: number;
  /** Pagination direction */
  direction?: "forward" | "backend";
  /** Sort results by field */
  sort?:
    | "name"
    | "name_desc"
    | "distance"
    | "distance_desc"
    | "elevation"
    | "elevation_desc"
    | "rating"
    | "rating_desc"
    | "created_at"
    | "created_at_desc";
};
export type GetFeaturedRoutesApiResponse =
  /** status 200 List of featured routes */ {
    status?: string;
    message?: string;
    data?: Route[];
  };
export type GetFeaturedRoutesApiArg = {
  /** Number of routes to return */
  limit?: number;
};
export type GetRouteByIdApiResponse = /** status 200 Route details */ {
  status?: string;
  message?: string;
  data?: Route;
};
export type GetRouteByIdApiArg = {
  /** Route ID or slug */
  route: string;
};
export type GetRoutePlacesApiResponse = /** status 200 List of places */ {
  status?: string;
  message?: string;
  data?: Place[];
};
export type GetRoutePlacesApiArg = {
  /** Route ID or slug */
  route: string;
};
export type SearchResourcesApiResponse = /** status 200 Search results */ {
  data?: {
    query?: string;
    type?: string;
    total_results?: number;
    results?: {
      routes?: {
        id?: number;
        name?: string;
        description?: string;
      }[];
      places?: {
        id?: number;
        name?: string;
        description?: string;
      }[];
      cities?: {
        id?: number;
        name?: string;
      }[];
      countries?: {
        id?: number;
        name?: string;
      }[];
      categories?: {
        id?: number;
        name?: string;
      }[];
    };
  };
  pagination?: {
    next_cursor?: string | null;
    previous_cursor?: string | null;
    has_next?: boolean;
    has_previous?: boolean;
    total?: number;
    limit?: number;
  };
  meta?: {
    request_id?: string;
    timestamp?: string;
  };
};
export type SearchResourcesApiArg = {
  /** Search term */
  query: string;
  /** Resource type to search */
  type?: "all" | "routes" | "places" | "cities" | "countries" | "categories";
  /** Opaque string pointing to a specific item in the result set */
  cursor?: string;
  /** Maximum items per resource type */
  limit?: number;
  /** Pagination direction */
  direction?: "forward" | "backend";
};
export type SearchContentApiResponse =
  /** status 200 Search results with pagination metadata */ {
    data?: {
      /** The search term used */
      query?: string;
      /** The content type that was searched */
      type?: string;
      /** Total number of results across all types */
      total_results?: number;
      /** Search results grouped by content type */
      results?: {
        /** Routes matching the search criteria */
        routes?: Route[];
        /** Places matching the search criteria */
        places?: Place[];
        /** Cities matching the search criteria */
        cities?: City[];
        /** Countries matching the search criteria */
        countries?: Country[];
        /** Categories matching the search criteria */
        categories?: Category[];
      };
    };
    pagination?: PaginationLinks;
    meta?: {
      /** Unique identifier for the request */
      request_id?: string;
      /** ISO 8601 timestamp of when the response was generated */
      timestamp?: string;
      /** Success message */
      message?: string;
    };
  };
export type SearchContentApiArg = {
  /** Search term */
  query: string;
  /** Type of content to search for. Use 'all' to search across all content types. */
  type?: "all" | "routes" | "places" | "cities" | "countries" | "categories";
  /** Opaque cursor string for pagination. For forward pagination, use the next_cursor from previous response. For backend pagination, use the previous_cursor. */
  cursor?: string;
  /** Number of items per page (default: 20, max: 100) */
  limit?: number;
  /** Pagination direction. Use 'forward' for getting the next page, 'backend' for returning to previous pages. */
  direction?: "forward" | "backend";
};
export type GetUserProfileApiResponse =
  /** status 200 User profile retrieved successfully */ {
    data?: User;
    meta?: {
      request_id?: string;
      timestamp?: string;
    };
  };
export type GetUserProfileApiArg = void;
export type UpdateUserProfileApiResponse =
  /** status 200 User profile updated successfully */ {
    data?: User;
    meta?: {
      request_id?: string;
      timestamp?: string;
    };
  };
export type UpdateUserProfileApiArg = {
  userUpdateRequest: UserUpdateRequest;
};
export type GetUserProfileFavoritesApiResponse =
  /** status 200 User favorites retrieved successfully */ {
    data?: Route[];
    pagination?: {
      next_cursor?: string | null;
      previous_cursor?: string | null;
      has_next?: boolean;
      has_previous?: boolean;
      total?: number;
      limit?: number;
    };
  };
export type GetUserProfileFavoritesApiArg = {
  /** Cursor for pagination */
  cursor?: string;
  /** Maximum items per page */
  limit?: number;
  /** Pagination direction */
  direction?: "forward" | "backend";
  /** Sort field */
  sort?: "created_at" | "created_at_desc" | "name" | "name_desc";
  /** Results per page (DEPRECATED - use limit instead) */
  perPage?: number;
  /** Page number (DEPRECATED - use cursor instead) */
  page?: number;
};
export type GetUserRatingsApiResponse =
  /** status 200 User ratings retrieved successfully */ {
    data?: Rating[];
    pagination?: {
      next_cursor?: string | null;
      previous_cursor?: string | null;
      has_next?: boolean;
      has_previous?: boolean;
      total?: number;
      limit?: number;
    };
  };
export type GetUserRatingsApiArg = {
  /** Cursor for pagination */
  cursor?: string;
  /** Maximum items per page */
  limit?: number;
  /** Pagination direction */
  direction?: "forward" | "backend";
  /** Results per page (DEPRECATED - use limit instead) */
  perPage?: number;
  /** Page number (DEPRECATED - use cursor instead) */
  page?: number;
};
export type UserResponse = {
  /** User ID */
  id?: number;
  /** User's full name */
  name?: string;
  /** User's email address */
  email?: string;
  /** Creation timestamp */
  created_at?: string;
};
export type AuthResponse = {
  status?: string;
  message?: string;
  data?: {
    user?: UserResponse;
    token?: string;
  };
};
export type RegisterRequest = {
  /** User's full name */
  name: string;
  /** User's email address */
  email: string;
  /** User's password */
  password: string;
  /** Password confirmation */
  password_confirmation: string;
};
export type LoginRequest = {
  /** User's email address */
  email: string;
  /** User's password */
  password: string;
};
export type Category = {
  id?: number;
  name?: string;
  slug?: string;
  icon?: string;
  color?: string;
  created_at?: string;
  updated_at?: string;
  places_count?: number;
  routes_count?: number;
};
export type CategoryRequest = {
  /** Category name */
  name: string;
  /** Category icon name */
  icon?: string;
  /** Category color in hex format */
  color?: string;
};
export type Country = {
  id?: number;
  name?: string;
  code?: string;
  created_at?: string;
  updated_at?: string;
  cities_count?: number;
  routes_count?: number;
};
export type City = {
  id?: number;
  name?: string;
  slug?: string;
  country_id?: number;
  latitude?: number;
  longitude?: number;
  created_at?: string;
  updated_at?: string;
  routes_count?: number;
  country?: Country;
};
export type CityRequest = {
  name: string;
  country_id: number;
  latitude?: number;
  longitude?: number;
};
export type PaginationResponse = {
  pagination?: {
    /** Opaque cursor string for the next page */
    next_cursor?: string | null;
    /** Opaque cursor string for the previous page */
    previous_cursor?: string | null;
    /** Whether there is a next page available */
    has_next?: boolean;
    /** Whether there is a previous page available */
    has_previous?: boolean;
    /** Total number of items */
    total?: number;
    /** Maximum items per page */
    limit?: number;
    /** Error information if there was a problem with the cursor */
    error?: {
      /** Error code */
      code?: string;
      /** Human-readable error message */
      message?: string;
    } | null;
  };
};
export type Route = PaginationResponse & {
  id?: number;
  name?: string;
  description?: string;
  city_id?: number;
  user_id?: number;
  /** Duration in minutes */
  duration?: number;
  /** Distance in kilometers */
  distance?: number;
  /** Elevation gain in meters */
  elevation?: number;
  difficulty?: "easy" | "moderate" | "challenging" | "difficult";
  is_featured?: boolean;
  created_at?: string;
  updated_at?: string;
  city?: {
    id?: number;
    name?: string;
    country?: object;
  };
  categories?: object[];
  media?: object[];
  ratings_avg?: number;
  ratings_count?: number;
};
export type Place = {
  id?: number;
  name?: string;
  address?: string;
  description?: string;
  city_id?: number;
  category_id?: number;
  user_id?: number;
  latitude?: number;
  longitude?: number;
  created_at?: string;
  updated_at?: string;
  city?: {
    id?: number;
    name?: string;
    country?: object;
  };
  category?: {
    id?: number;
    name?: string;
  };
  media?: object[];
};
export type CountryWithCities = Country & {
  cities?: {
    id?: number;
    name?: string;
    country_id?: number;
    routes_count?: number;
  }[];
};
export type GeoPoint = {
  id: number;
  route_id: number;
  place_id?: number | null;
  latitude: number;
  longitude: number;
  elevation?: number | null;
  order?: number;
  type?: string;
  name?: string;
  description?: string | null;
  image_path?: string | null;
  audio_path?: string | null;
  created_at?: string;
  updated_at?: string;
};
export type CursorPagination = {
  next_cursor?: string | null;
  previous_cursor?: string | null;
  has_next?: boolean;
  has_previous?: boolean;
  total?: number;
  limit?: number;
};
export type Meta = {
  request_id?: string;
  timestamp?: string;
};
export type PlaceRequest = {
  name: string;
  address?: string;
  description?: string;
  city_id: number;
  category_id: number;
  latitude: number;
  longitude: number;
};
export type Rating = {
  id?: number;
  user_id?: number;
  route_id?: number;
  /** Rating value from 1 to 5 */
  rating?: number;
  comment?: string | null;
  created_at?: string;
  updated_at?: string;
  user?: {
    id?: number;
    name?: string;
    profile_image?: string | null;
  };
  route?: Route;
};
export type RatingRequest = PaginationResponse & {
  /** Rating value from 1 to 5 */
  rating: number;
  comment?: string | null;
};
export type PaginationLinks = {
  /** Cursor for the next page of results. Valid for 30 minutes after generation. Will be null if there are no more results. */
  next_cursor?: string | null;
  /** Cursor for the previous page of results. Valid for 30 minutes after generation. Will be null if this is the first page. */
  previous_cursor?: string | null;
  /** Whether there is a next page of results. Use with next_cursor for forward pagination. */
  has_next?: boolean;
  /** Whether there is a previous page of results. Use with previous_cursor for backend pagination. */
  has_previous?: boolean;
  /** Total number of items matching the query */
  total?: number;
  /** Maximum number of items per page used for this request */
  limit?: number;
};
export type ErrorResponse = {
  error?: {
    /** Error code */
    code?: string;
    /** Human-readable error message */
    message?: string;
    /** Additional error details */
    details?: object | null;
  };
};
export type UserProfile = {
  id?: number;
  user_id?: number;
  bio?: string | null;
  location?: string | null;
  website?: string | null;
  created_at?: string;
  updated_at?: string;
};
export type User = {
  id?: number;
  name?: string;
  email?: string;
  email_verified_at?: string | null;
  created_at?: string;
  updated_at?: string;
  profile?: UserProfile;
};
export type UserUpdateRequest = {
  name?: string;
  email?: string;
  password?: string;
  password_confirmation?: string;
  profile?: {
    bio?: string;
    location?: string;
    website?: string;
  };
};


export const useLazyGetCitiesQuery = injectedRtkApi.endpoints.getCities.useLazyQuery;
export const useLazyGetCountriesQuery = injectedRtkApi.endpoints.getCountries.useLazyQuery;
export const useLazyGetRoutesQuery = injectedRtkApi.endpoints.getRoutes.useLazyQuery;
export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
  useGetCurrentUserQuery,
  useGetCategoriesQuery,
  useStoreCategoryMutation,
  useGetCategoryByIdQuery,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoryPlacesQuery,
  useGetCategoryRoutesQuery,
  useGetCitiesQuery,
  useStoreCityMutation,
  useGetCityByIdQuery,
  useUpdateCityMutation,
  useDeleteCityMutation,
  useGetCityRoutesQuery,
  useGetCityPlacesQuery,
  useGetCountriesQuery,
  useGetCountryByIdQuery,
  useGetCountryCitiesQuery,
  useGetCountryRoutesQuery,
  useGetUserFavoritesQuery,
  useAddRouteToFavoritesMutation,
  useRemoveRouteFromFavoritesMutation,
  useGetApiV1GeoPointsQuery,
  useA8Eb7087F46Bb8E91A1Dfce6Fe98Ba0BMutation,
  useD51F8C13A133544B57Bb9F545D3F2C3CQuery,
  usePutApiV1GeoPointsByIdMutation,
  useD5A8A272785D771766F5814512228C47Mutation,
  useGetPlacesQuery,
  useStorePlaceMutation,
  useGetPlaceByIdQuery,
  useUpdatePlaceMutation,
  useDeletePlaceMutation,
  useGetPlaceRoutesQuery,
  useGetUserRatingsListQuery,
  useGetRouteRatingsQuery,
  useStoreRatingMutation,
  useUpdateRatingMutation,
  useDeleteRatingMutation,
  useGetRoutesQuery,
  useGetFeaturedRoutesQuery,
  useGetRouteByIdQuery,
  useGetRoutePlacesQuery,
  useSearchResourcesQuery,
  useSearchContentQuery,
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useGetUserProfileFavoritesQuery,
  useGetUserRatingsQuery,
} = injectedRtkApi;

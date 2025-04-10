/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Place } from '../models/Place';
import type { Route } from '../models/Route';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class RoutesService {
    /**
     * Get all routes
     * Returns a paginated list of travel routes with filtering options
     * @param countryId Filter by country ID
     * @param cityId Filter by city ID
     * @param categoryId Filter by category ID
     * @param difficulty Filter by difficulty level
     * @param minDistance Filter by minimum distance (km)
     * @param maxDistance Filter by maximum distance (km)
     * @param minElevation Filter by minimum elevation gain (m)
     * @param maxElevation Filter by maximum elevation gain (m)
     * @param search Search routes by name
     * @param sort Sort results by field
     * @param perPage Results per page
     * @param page Page number
     * @returns any List of routes
     * @throws ApiError
     */
    public static getRoutes(
        countryId?: number,
        cityId?: number,
        categoryId?: number,
        difficulty?: Array<'easy' | 'moderate' | 'challenging' | 'difficult'>,
        minDistance?: number,
        maxDistance?: number,
        minElevation?: number,
        maxElevation?: number,
        search?: string,
        sort: 'name' | 'name_desc' | 'distance' | 'distance_desc' | 'elevation' | 'elevation_desc' | 'rating' | 'rating_desc' = 'name',
        perPage: number = 15,
        page: number = 1,
    ): CancelablePromise<{
        status?: string;
        message?: string;
        data?: {
            current_page?: number;
            data?: Array<Route>;
            total?: number;
            per_page?: number;
        };
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/routes',
            query: {
                'country_id': countryId,
                'city_id': cityId,
                'category_id': categoryId,
                'difficulty': difficulty,
                'min_distance': minDistance,
                'max_distance': maxDistance,
                'min_elevation': minElevation,
                'max_elevation': maxElevation,
                'search': search,
                'sort': sort,
                'per_page': perPage,
                'page': page,
            },
        });
    }
    /**
     * Get featured routes
     * Returns a list of featured routes
     * @param limit Maximum number of routes to return
     * @returns any List of featured routes
     * @throws ApiError
     */
    public static getFeaturedRoutes(
        limit: number = 6,
    ): CancelablePromise<{
        status?: string;
        message?: string;
        data?: Array<Route>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/routes/featured',
            query: {
                'limit': limit,
            },
        });
    }
    /**
     * Get route details
     * Returns details of a specific route by ID
     * @param route Route ID
     * @returns any Route details
     * @throws ApiError
     */
    public static getRouteById(
        route: number,
    ): CancelablePromise<{
        status?: string;
        message?: string;
        data?: Route;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/routes/{route}',
            path: {
                'route': route,
            },
            errors: {
                404: `Route not found`,
            },
        });
    }
    /**
     * Get places in a route
     * Returns all places included in a specific route
     * @param route Route ID
     * @returns any List of places in the route
     * @throws ApiError
     */
    public static getRoutePlaces(
        route: number,
    ): CancelablePromise<{
        status?: string;
        message?: string;
        data?: Array<Place>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/routes/{route}/places',
            path: {
                'route': route,
            },
            errors: {
                404: `Route not found`,
            },
        });
    }
    /**
     * Get ratings for a route
     * Returns paginated ratings for a specific route
     * @param route Route ID
     * @param perPage Results per page
     * @param page Page number
     * @returns any List of ratings
     * @throws ApiError
     */
    public static getRouteRatings(
        route: number,
        perPage: number = 15,
        page: number = 1,
    ): CancelablePromise<{
        status?: string;
        message?: string;
        data?: {
            current_page?: number;
            data?: Array<Record<string, any>>;
            total?: number;
            per_page?: number;
        };
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/routes/{route}/ratings',
            path: {
                'route': route,
            },
            query: {
                'per_page': perPage,
                'page': page,
            },
            errors: {
                404: `Route not found`,
            },
        });
    }
}

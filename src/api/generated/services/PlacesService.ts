/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Place } from '../models/Place';
import type { PlaceRequest } from '../models/PlaceRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PlacesService {
    /**
     * Get all places
     * Returns a paginated list of places with optional filtering
     * @param cityId Filter by city ID
     * @param categoryId Filter by category ID
     * @param perPage Results per page
     * @param page Page number
     * @returns any List of places
     * @throws ApiError
     */
    public static getPlaces(
        cityId?: number,
        categoryId?: number,
        perPage: number = 15,
        page: number = 1,
    ): CancelablePromise<{
        status?: string;
        message?: string;
        data?: {
            current_page?: number;
            data?: Array<Place>;
            total?: number;
            per_page?: number;
        };
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/places',
            query: {
                'city_id': cityId,
                'category_id': categoryId,
                'per_page': perPage,
                'page': page,
            },
        });
    }
    /**
     * Create a new place
     * Creates a new place (requires authentication)
     * @param requestBody
     * @returns any Place created successfully
     * @throws ApiError
     */
    public static storePlace(
        requestBody: PlaceRequest,
    ): CancelablePromise<{
        status?: string;
        message?: string;
        data?: Place;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/places',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Unauthenticated`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Get a specific place
     * Returns details of a specific place by ID
     * @param place Place ID
     * @returns any Place details
     * @throws ApiError
     */
    public static getPlaceById(
        place: number,
    ): CancelablePromise<{
        status?: string;
        message?: string;
        data?: Place;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/places/{place}',
            path: {
                'place': place,
            },
            errors: {
                404: `Place not found`,
            },
        });
    }
    /**
     * Update a place
     * Updates an existing place (requires authentication)
     * @param place Place ID
     * @param requestBody
     * @returns any Place updated successfully
     * @throws ApiError
     */
    public static updatePlace(
        place: number,
        requestBody: PlaceRequest,
    ): CancelablePromise<{
        status?: string;
        message?: string;
        data?: Place;
    }> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/places/{place}',
            path: {
                'place': place,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Unauthenticated`,
                404: `Place not found`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Delete a place
     * Deletes a place (requires authentication)
     * @param place Place ID
     * @returns void
     * @throws ApiError
     */
    public static deletePlace(
        place: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/places/{place}',
            path: {
                'place': place,
            },
            errors: {
                401: `Unauthenticated`,
                404: `Place not found`,
                422: `Cannot delete place with associated media`,
            },
        });
    }
    /**
     * Get routes for a place
     * Returns routes that include this place
     * @param place Place ID
     * @param perPage Results per page
     * @param page Page number
     * @returns any List of routes
     * @throws ApiError
     */
    public static getPlaceRoutes(
        place: number,
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
            url: '/api/v1/places/{place}/routes',
            path: {
                'place': place,
            },
            query: {
                'per_page': perPage,
                'page': page,
            },
            errors: {
                404: `Place not found`,
            },
        });
    }
}

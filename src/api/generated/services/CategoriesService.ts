/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Category } from '../models/Category';
import type { CategoryRequest } from '../models/CategoryRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CategoriesService {
    /**
     * Get all categories
     * Returns a list of all travel categories
     * @returns any List of categories
     * @throws ApiError
     */
    public static getCategories(): CancelablePromise<{
        status?: string;
        message?: string;
        data?: Array<Category>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/categories',
        });
    }
    /**
     * Create a new category
     * Creates a new travel category (admin only)
     * @param requestBody
     * @returns any Category created successfully
     * @throws ApiError
     */
    public static storeCategory(
        requestBody: CategoryRequest,
    ): CancelablePromise<{
        status?: string;
        message?: string;
        data?: Category;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/categories',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Unauthenticated`,
                403: `Forbidden - Not an admin`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Get a specific category
     * Returns details of a specific category by ID or slug
     * @param category Category ID or slug
     * @returns any Category found
     * @throws ApiError
     */
    public static getCategoryById(
        category: string,
    ): CancelablePromise<{
        status?: string;
        message?: string;
        data?: Category;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/categories/{category}',
            path: {
                'category': category,
            },
            errors: {
                404: `Category not found`,
            },
        });
    }
    /**
     * Update a category
     * Updates a category's information (admin only)
     * @param category Category ID or slug
     * @param requestBody
     * @returns any Category updated successfully
     * @throws ApiError
     */
    public static updateCategory(
        category: string,
        requestBody: CategoryRequest,
    ): CancelablePromise<{
        status?: string;
        message?: string;
        data?: Category;
    }> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/categories/{category}',
            path: {
                'category': category,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Category not found`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Delete a category
     * Deletes a category if it has no associated places or routes (admin only)
     * @param category Category ID or slug
     * @returns any Category deleted successfully
     * @throws ApiError
     */
    public static deleteCategory(
        category: string,
    ): CancelablePromise<{
        status?: string;
        message?: string;
        data?: Array<string>;
    }> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/categories/{category}',
            path: {
                'category': category,
            },
            errors: {
                404: `Category not found`,
                422: `Cannot delete - has associated data`,
            },
        });
    }
    /**
     * Get places in a category
     * Returns a paginated list of places associated with a category
     * @param category Category ID or slug
     * @param perPage Results per page (max 50)
     * @param page Page number
     * @returns any List of places in the category
     * @throws ApiError
     */
    public static getCategoryPlaces(
        category: string,
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
            url: '/api/v1/categories/{category}/places',
            path: {
                'category': category,
            },
            query: {
                'per_page': perPage,
                'page': page,
            },
            errors: {
                404: `Category not found`,
            },
        });
    }
    /**
     * Get routes in a category
     * Returns a paginated list of routes associated with a category
     * @param category Category ID or slug
     * @param perPage Results per page (max 50)
     * @param page Page number
     * @returns any List of routes in the category
     * @throws ApiError
     */
    public static getCategoryRoutes(
        category: string,
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
            url: '/api/v1/categories/{category}/routes',
            path: {
                'category': category,
            },
            query: {
                'per_page': perPage,
                'page': page,
            },
            errors: {
                404: `Category not found`,
            },
        });
    }
}

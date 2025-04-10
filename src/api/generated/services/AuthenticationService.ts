/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AuthResponse } from '../models/AuthResponse';
import type { LoginRequest } from '../models/LoginRequest';
import type { RegisterRequest } from '../models/RegisterRequest';
import type { UserResponse } from '../models/UserResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AuthenticationService {
    /**
     * Register a new user
     * Register a new user account and receive an authentication token
     * @param requestBody
     * @returns AuthResponse User registered successfully
     * @throws ApiError
     */
    public static registerUser(
        requestBody: RegisterRequest,
    ): CancelablePromise<AuthResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/auth/register',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation error`,
            },
        });
    }
    /**
     * User login
     * Authenticates a user and issues a token
     * @param requestBody
     * @returns any User logged in successfully
     * @throws ApiError
     */
    public static loginUser(
        requestBody: LoginRequest,
    ): CancelablePromise<{
        status?: string;
        message?: string;
        data?: {
            user?: UserResponse;
            token?: string;
        };
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/auth/login',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Invalid credentials`,
            },
        });
    }
    /**
     * Logout user
     * Logout user and invalidate token
     * @returns any Logged out successfully
     * @throws ApiError
     */
    public static logoutUser(): CancelablePromise<{
        status?: string;
        message?: string;
        data?: Record<string, any>;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/auth/logout',
            errors: {
                401: `Unauthenticated`,
            },
        });
    }
    /**
     * Get current user info
     * Returns information about the authenticated user
     * @returns any User information retrieved
     * @throws ApiError
     */
    public static getCurrentUser(): CancelablePromise<{
        status?: string;
        message?: string;
        data?: {
            id?: number;
            name?: string;
            email?: string;
        };
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/auth/me',
            errors: {
                401: `Unauthenticated`,
            },
        });
    }
}

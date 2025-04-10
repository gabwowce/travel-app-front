/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UserResponse } from './UserResponse';
export type AuthResponse = {
    status?: string;
    message?: string;
    data?: {
        user?: UserResponse;
        token?: string;
    };
};


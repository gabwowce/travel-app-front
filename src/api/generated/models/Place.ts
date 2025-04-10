/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
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
        country?: Record<string, any>;
    };
    category?: {
        id?: number;
        name?: string;
    };
    media?: Array<Record<string, any>>;
};


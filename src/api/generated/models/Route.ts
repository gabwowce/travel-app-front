/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Route = {
    id?: number;
    name?: string;
    description?: string;
    city_id?: number;
    user_id?: number;
    /**
     * Duration in minutes
     */
    duration?: number;
    /**
     * Distance in kilometers
     */
    distance?: number;
    /**
     * Elevation gain in meters
     */
    elevation?: number;
    difficulty?: Route.difficulty;
    is_featured?: boolean;
    created_at?: string;
    updated_at?: string;
    city?: {
        id?: number;
        name?: string;
        country?: Record<string, any>;
    };
    categories?: Array<Record<string, any>>;
    media?: Array<Record<string, any>>;
    ratings_avg?: number;
    ratings_count?: number;
};
export namespace Route {
    export enum difficulty {
        EASY = 'easy',
        MODERATE = 'moderate',
        CHALLENGING = 'challenging',
        DIFFICULT = 'difficult',
    }
}


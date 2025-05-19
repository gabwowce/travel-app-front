// validation/routesFilterSchema.ts
import * as Yup from 'yup';

export const routesFilterSchema = Yup.object({
  /* Primary filters (dropdown / picker) */
  // country_id:   Yup.number().positive().integer().nullable(),
  // city_id:      Yup.number().positive().integer().nullable(),
  // category_id:  Yup.number().positive().integer().nullable(),

  // /* Difficulty – multi-select (checkbox group) */
  // difficulty:   Yup.array()
  //   .of(
  //     Yup.mixed<'easy' | 'moderate' | 'challenging' | 'difficult'>()
  //       .oneOf(['easy', 'moderate', 'challenging', 'difficult'])
  //   )
  //   .min(0)
  //   .nullable(),

  // /* Distance range (km) */
  // min_distance: Yup.number()
  //   .min(0, 'Cannot be less than 0 km')
  //   .max(Yup.ref('max_distance'), 'Must be less than or equal to maximum')
  //   .nullable(),

  // max_distance: Yup.number()
  //   .min(Yup.ref('min_distance'), 'Must be greater than or equal to minimum')
  //   .nullable(),

  // /* Elevation gain (m) */
  // min_elevation: Yup.number()
  //   .min(0, 'Cannot be less than 0 m')
  //   .max(Yup.ref('max_elevation'), 'Must be less than or equal to maximum')
  //   .nullable(),

  // max_elevation: Yup.number()
  //   .min(Yup.ref('min_elevation'), 'Must be greater than or equal to minimum')
  //   .nullable(),

  // /* Search text */
  // search: Yup.string().max(100).trim().nullable(),

  // /* Pagination */
  // cursor: Yup.string().nullable(),
  // limit:  Yup.number()
  //   .integer()
  //   .min(1)
  //   .max(100)
  //   .default(20),

  // direction: Yup.mixed<'forward' | 'backward'>()
  //   .oneOf(['forward', 'backward'])
  //   .default('forward'),

  // /* Sorting options as defined by API */
  // sort: Yup.mixed<'created_at_desc' | 'created_at_asc' | 'distance_desc' | 'distance_asc'>()
  //   .oneOf(['created_at_desc', 'created_at_asc', 'distance_desc', 'distance_asc'])
  //   .default('created_at_desc')
  //   .nullable(),

    categoryId: Yup.number().optional(),
    countryId: Yup.number().optional(),
    cityId: Yup.number().optional(),
    difficulty: Yup.string().oneOf(["easy", "moderate", "hard"]).optional(),
    minRating: Yup.number().min(0).max(5).optional(),
    minDistance: Yup.number().min(0).max(1000).optional(),
    maxDistance: Yup.number().min(0).max(1000).optional(),
    minElevation: Yup.number().min(0).max(5000).optional(),
    maxElevation: Yup.number().min(0).max(5000).optional(),
    onlyFavorites: Yup.boolean().optional(),
    search: Yup.string().optional(),
});

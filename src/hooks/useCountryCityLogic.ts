// src/hooks/useCountryCityLogic.ts
import { useCallback, useMemo } from "react";
import { useAppDispatch } from "@/src/data/hooks";
import { mergeFiltersForKey } from "@/src/data/features/filters/filtersSlice";
import type { RouteFilters } from "@/src/components/filters/FilterForm";

type City = { id: number; name: string };

interface Params {
  formik: {
    values: RouteFilters;
    setFieldValue: (field: string, val: any) => void;
  };
  routeKey: string;
  cities: City[];
  onCountryChange: (countryId?: number) => void;
}

export function useCountryCityLogic({
  formik,
  routeKey,
  cities,
  onCountryChange,
}: Params) {
  const dispatch = useAppDispatch();

  /* --- ŠALIS --- */
  const handleCountryChange = useCallback(
    (rawVal: string) => {
      const countryId = rawVal === "" ? undefined : Number(rawVal);

      // išvalom miestą
      formik.setFieldValue("countryId", countryId);
      formik.setFieldValue("cityId", undefined);

      dispatch(
        mergeFiltersForKey({
          key: routeKey,
          filters: { ...formik.values, countryId, cityId: undefined },
        })
      );

      if (countryId !== undefined) onCountryChange(countryId);
    },
    [dispatch, formik, onCountryChange, routeKey]
  );

  /* --- MIESTAS --- */
  const handleCityChange = useCallback(
    (rawVal: string) => {
      const cityId = rawVal === "" ? undefined : Number(rawVal);

      formik.setFieldValue("cityId", cityId);

      // svarbu – perduodam ir `undefined`, kad iš Redux dingtų senas miestas
      dispatch(
        mergeFiltersForKey({
          key: routeKey,
          filters: { cityId },
        })
      );
    },
    [dispatch, formik, routeKey]
  );

  const isCityDisabled = formik.values.countryId === undefined;

  const cityOptions = useMemo(
    () => [
      { label: "All", value: "" },
      ...cities.map((c) => ({ label: c.name, value: c.id.toString() })),
    ],
    [cities]
  );

  return { handleCountryChange, handleCityChange, isCityDisabled, cityOptions };
}

// src/hooks/useFiltersForm.ts
import { useMemo, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/src/data/hooks";
import { mergeFiltersDraftForKey } from "@/src/data/features/filters/filtersSlice";
import { useGetCitiesQuery } from "@/src/store/travelApi";
import type { RouteFilters } from "@/src/components/filters/FilterForm";

// numeriniai laukai
const NUMERIC_FIELDS = new Set([
  "categoryId",
  "countryId",
  "cityId",
  "minRating",
  "maxDistance",
]);

function normalizeValue(field: string, raw: any) {
  if (raw === "") return undefined; // "All"
  if (NUMERIC_FIELDS.has(field)) {
    const n = Number(raw);
    return Number.isFinite(n) ? n : undefined;
  }
  return raw;
}

export function useFiltersForm(
  routeKey: string,
  formik: { values: RouteFilters; setFieldValue: (f: string, v: any) => void }
) {
  const dispatch = useAppDispatch();
  const draft = useAppSelector((st) => st.filters.drafts[routeKey] ?? {});

  const currentCountryId =
    typeof formik.values.countryId === "number"
      ? formik.values.countryId
      : undefined;

  // miestai pagal pasirinktą šalį
  const { data: citiesRes } = useGetCitiesQuery(
    { countryId: currentCountryId },
    { skip: !currentCountryId }
  );

  const cityOptions = useMemo(() => {
    const list: Array<{ id: number; name: string }> = citiesRes?.data ?? [];
    return [{ label: "All", value: "" }].concat(
      list.map((c) => ({ label: c.name, value: String(c.id) }))
    );
  }, [citiesRes]);

  const isCityDisabled = !currentCountryId;

  // vieno lauko atnaujinimas (-> DRAFT + Formik)
  const updateField = useCallback(
    (field: string, rawValue: any) => {
      const value = normalizeValue(field, rawValue);
      formik.setFieldValue(field, value);
      dispatch(
        mergeFiltersDraftForKey({ key: routeKey, filters: { [field]: value } })
      );
    },
    [dispatch, formik, routeKey]
  );

  // šalis (resetina city)
  const handleCountryChange = useCallback(
    (rawVal: string) => {
      const countryId = normalizeValue("countryId", rawVal) as
        | number
        | undefined;
      formik.setFieldValue("countryId", countryId);
      formik.setFieldValue("cityId", undefined);
      dispatch(
        mergeFiltersDraftForKey({
          key: routeKey,
          filters: { ...formik.values, countryId, cityId: undefined },
        })
      );
    },
    [dispatch, formik, routeKey]
  );

  const handleCityChange = useCallback(
    (rawVal: string) => updateField("cityId", rawVal),
    [updateField]
  );

  return {
    draft,
    updateField,
    handleCountryChange,
    handleCityChange,
    isCityDisabled,
    cityOptions,
  };
}

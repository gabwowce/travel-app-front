// src/components/ui/forms/FilterForm.tsx
import React, {
  forwardRef,
  useEffect,
  useRef,
  useImperativeHandle,
} from "react";
import { View } from "react-native";
import { VStack, HStack, Button, ScrollView } from "native-base";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { useFormik, FormikHelpers, FormikProps } from "formik";
import { useAppDispatch } from "@/src/data/hooks";
import {
  clearFilters,
  mergeFiltersForKey,
} from "@/src/data/features/filters/filtersSlice";

import CustomInput from "../input/CustomInput";
import CustomSelect from "../forms/CustomSelect";
import CustomSlider from "../forms/CustomSlider";
import CustomButton from "../btns/Button";
import FlexContainer from "@/src/components/layout/FlexContainer";
import { routesFilterSchema as schema } from "@/src/validation/routesFilterSchema";

export interface RouteFilters {
  categoryId?: number;
  countryId?: number;
  cityId?: number;
  difficulty?: "easy" | "moderate" | "hard";
  minRating?: number;
  minDistance?: number;
  maxDistance?: number;
  minElevation?: number;
  maxElevation?: number;
  onlyFavorites?: boolean;
  search?: string;
}

const blankValues: RouteFilters = {
  categoryId: undefined,
  countryId: undefined,
  cityId: undefined,
  difficulty: undefined,
  minRating: 0,
  minDistance: 0,
  maxDistance: 0,
  minElevation: 0,
  maxElevation: 0,
  onlyFavorites: false,
  search: "",
};

type Props = {
  initialValues: RouteFilters;
  onSubmit: (
    values: RouteFilters,
    formikHelpers: FormikHelpers<RouteFilters>
  ) => void;
  categories: { id: number; name: string }[];
  countries: { id: number; name: string }[];
  cities: { id: number; name: string }[];
  onCountryChange: (countryId?: number) => void;
  routeKey: string;
};

const FilterForm = forwardRef<FormikProps<RouteFilters>, Props>(
  (
    {
      initialValues,
      onSubmit,
      categories,
      countries,
      cities,
      onCountryChange,
      routeKey,
    },
    ref
  ) => {
    const dispatch = useAppDispatch();

    // 1) Initialize Formik at top level
    const formik = useFormik<RouteFilters>({
      initialValues,
      validationSchema: schema,
      enableReinitialize: true,
      onSubmit,
    });

    const isFirstMount = useRef(true);

    // 3) Only clear cityId when user actually changes country from a defined value
    useEffect(() => {
      const curr = formik.values.countryId;
      console.log("Current countryId:", curr);

      // praleisk pirmą montažą
      if (isFirstMount.current) {
        isFirstMount.current = false;
      } else {
        // jei keičiame šalį į kitą (ar iš undefined į kažką)
        // išvalome miestą ir kviečiame fetch’ą
        formik.setFieldValue("cityId", undefined);
        console.log("Current countryId:", curr);
        if (curr === undefined) {
          dispatch(
            mergeFiltersForKey({
              key: routeKey,
              filters: { countryId: undefined, cityId: undefined },
            })
          );
        } else {
          onCountryChange(curr);
        }
      }
    }, [formik.values.countryId, onCountryChange]);

    // 4) Expose Formik API via ref if parent needs it
    useImperativeHandle(ref, () => formik, [formik]);

    // 5) Clear all filters handler
    const handleClear = () => {
      formik.resetForm({ values: blankValues });
      onCountryChange(undefined);
      dispatch(clearFilters({ key: routeKey }));
    };

    const { values, setFieldValue, handleSubmit } = formik;

    return (
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: wp("5%"),
          paddingBottom: wp("5%"),
        }}
      >
        <Button
          accessibilityRole="button"
          accessibilityLabel="Clear all active filters"
          variant="ghost"
          size="sm"
          colorScheme="primary"
          mt={2}
          mb={2}
          onPress={handleClear}
        >
          Clear all filters
        </Button>
        <FlexContainer gap={16} px={wp("4%")}>
          {/* Search */}
          <CustomInput
            label="Search keywords"
            placeholder="Search keywords"
            value={values.search}
            onChangeText={(t) => setFieldValue("search", t)}
          />

          {/* Category */}
          <CustomSelect
            label="Select category"
            selectedValue={values.categoryId?.toString() ?? ""}
            onValueChange={(v) =>
              setFieldValue("categoryId", v === "" ? undefined : Number(v))
            }
            options={[
              { label: "All", value: "" },
              ...categories.map((c) => ({
                label: c.name,
                value: c.id.toString(),
              })),
            ]}
          />

          {/* Country */}
          <CustomSelect
            label="Select country"
            selectedValue={values.countryId?.toString() ?? ""}
            onValueChange={(v) => {
              const cid = v === "" ? undefined : Number(v);
              setFieldValue("countryId", cid);
            }}
            options={[
              { label: "All", value: "" },
              ...countries.map((c) => ({
                label: c.name,
                value: c.id.toString(),
              })),
            ]}
          />

          {/* City (disabled until a country is chosen) */}
          <CustomSelect
            label="Select city"
            isDisabled={!values.countryId}
            selectedValue={values.cityId?.toString() ?? ""}
            onValueChange={(v) =>
              setFieldValue("cityId", v === "" ? undefined : Number(v))
            }
            options={[
              { label: "All", value: "" },
              ...cities.map((ci) => ({
                label: ci.name,
                value: ci.id.toString(),
              })),
            ]}
          />

          {/* Difficulty */}
          <CustomSelect
            label="Select difficulty"
            selectedValue={values.difficulty ?? ""}
            onValueChange={(v) => setFieldValue("difficulty", v || undefined)}
            options={[
              { label: "All", value: "" },
              { label: "Easy", value: "easy" },
              { label: "Moderate", value: "moderate" },
              { label: "Hard", value: "hard" },
            ]}
          />

          {/* Sliders */}
          <CustomSlider
            label="Min rating"
            value={values.minRating ?? 0}
            min={0}
            max={5}
            step={0.5}
            onChange={(v) => setFieldValue("minRating", v)}
          />
          <CustomSlider
            label="Max distance (km)"
            value={values.maxDistance ?? 0}
            min={0}
            max={1000}
            step={10}
            onChange={(v) => setFieldValue("maxDistance", v)}
          />
          <CustomSlider
            label="Min elevation (m)"
            value={values.minElevation ?? 0}
            min={0}
            max={5000}
            step={50}
            onChange={(v) => setFieldValue("minElevation", v)}
          />
          <CustomSlider
            label="Max elevation (m)"
            value={values.maxElevation ?? 0}
            min={0}
            max={5000}
            step={50}
            onChange={(v) => setFieldValue("maxElevation", v)}
          />

          <View style={{ justifyContent: "flex-end", paddingTop: 4 }}>
            {/* <CustomButton variant="outline" onPress={handleClear}>
              Clear All
            </CustomButton> */}

            <CustomButton onPress={() => handleSubmit()}>
              Apply Filters
            </CustomButton>
          </View>
        </FlexContainer>
      </ScrollView>
    );
  }
);

export default FilterForm;

import React, { useEffect,forwardRef } from "react";
import { Formik, FormikProps, useFormik } from "formik";
import * as Yup from "yup";
import { VStack, HStack, Switch, ScrollView, Button } from "native-base";
import { Text } from "react-native";
import { View } from "react-native";
import { FormikHelpers } from "formik";

import CustomSelect from "@/src/components/ui/forms/CustomSelect";
import CustomSlider from "@/src/components/ui/forms/CustomSlider";
import FlexContainer from "@/src/components/layout/FlexContainer";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import CustomInput from "../input/CustomInput";
import CustomButton from "../btns/Button";
import { clearFilters } from "@/src/data/features/filters/filtersSlice";
import { useAppDispatch } from "@/src/data/hooks";

import {routesFilterSchema as schema} from "@/src/validation/routesFilterSchema";

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
  categoryId:    undefined,
  countryId:     undefined,
  cityId:        undefined,
  difficulty:    undefined,
  minRating:     0,
  minDistance:   0,
  maxDistance:   0,
  minElevation:  0,
  maxElevation:  0,
  onlyFavorites: false,
  search:        "",
};


type Props = {
  initialValues: RouteFilters;
  onSubmit:      (v: RouteFilters) => void;
  categories:    { id: number; name: string }[];
  countries:     { id: number; name: string }[];
  cities:        { id: number; name: string }[];
  onCountryChange: (id: number | undefined) => void;
  routeKey: string;
};


const FilterForm = forwardRef<FormikProps<RouteFilters>, Props>(
  ({ initialValues, onSubmit, categories, countries, cities, onCountryChange, routeKey }, ref) => {
  const dispatch = useAppDispatch();
  return (
    <Formik<RouteFilters>
      initialValues={initialValues}
      validationSchema={schema}
      enableReinitialize
      onSubmit={onSubmit}
      innerRef={ref}
    >
      {({ values, setFieldValue, handleSubmit, resetForm  }) => {
        /* kai keičiasi šalis – resetinam miestą */
        useEffect(() => {
          setFieldValue("cityId", undefined);
          onCountryChange(values.countryId);
        }, [values.countryId]);

        const handleClear = () => {
          resetForm({ values: blankValues });
          onCountryChange(undefined);
          dispatch(clearFilters({ key: routeKey }));
        };
        return (
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }} 
          contentContainerStyle={{ paddingBottom: wp("5%"), paddingTop: wp("5%") }}
          accessible={true}
  accessibilityLabel="Route filter form"
  accessibilityRole="form"
        >
          <FlexContainer gap={16} px={wp("4%")}>
            <HStack space={3}>
            {/* <Button
              ml="auto"
              variant="ghost"
              colorScheme="coolGray"
              onPress={handleClear}
            >
              Clear
            </Button> */}
          </HStack>

            <CustomInput
              label="Search keywords"
              placeholder="Search keywords"
              value={values.search}
              onChangeText={(t) => setFieldValue("search", t)}
            />

             {/* --- Category --- */}
              <CustomSelect
                label="Select category"
                selectedValue={values.categoryId?.toString()}
                onValueChange={(v) => setFieldValue("categoryId", Number(v))}
                options={[
                  { label: "All", value: "" }, 
                  ...categories.map((c) => ({ label: c.name, value: c.id.toString() })),
                ]}
              />

              {/* --- Country --- */}
              <CustomSelect
                label="Select country"
                selectedValue={values.countryId?.toString() ?? ""}
                onValueChange={(v) =>
                  setFieldValue("countryId", v === "" ? undefined : Number(v))
                }
                options={[
                  { label: "All", value: "" }, 
                  ...countries.map((c) => ({ label: c.name, value: c.id.toString() })),
                ]}
              />

              {/* --- City (disabled kol nėra country) --- */}
              <CustomSelect
                label="Select city"
                isDisabled={!values.countryId}
                selectedValue={values.cityId?.toString() ?? ""}
                onValueChange={(v) => setFieldValue("cityId", v === "" ? undefined : Number(v))}
                options={[
                  { label: "All", value: "" }, 
                  ...cities.map((ci) => ({
                  label: ci.name,
                  value: ci.id.toString(),})),
                ]}
              />

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
              label="Min elev (m)"
              value={values.minElevation ?? 0}
              min={0}
              max={5000}
              step={50}
              onChange={(v) => setFieldValue("minElevation", v)}
            />

            <CustomSlider
              label="Max elev (m)"
              value={values.maxElevation ?? 0}
              min={0}
              max={5000}
              step={50}
              onChange={(v) => setFieldValue("maxElevation", v)}
            />

            {/* <HStack alignItems="center" space={3}>
              <Text>Only favorites</Text>
              <Switch
                isChecked={values.onlyFavorites ?? false}
                onToggle={(v) => setFieldValue("onlyFavorites", v)}
              />
            </HStack> */}

            <HStack py={10}>
              <CustomButton onPress={() => handleSubmit()}>
                Apply filters
              </CustomButton>

            </HStack>

            
          </FlexContainer>
        </ScrollView>
      )}
    }</Formik>
  );
})

export default FilterForm;

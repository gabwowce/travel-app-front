import React, { useEffect } from "react";
import { Formik, useFormik } from "formik";
import * as Yup from "yup";
import { Button, VStack, HStack, Switch, ScrollView } from "native-base";
import { Text } from "react-native";
import { View } from "react-native";

import CustomSelect from "@/src/components/ui/forms/CustomSelect";
import CustomSlider from "@/src/components/ui/forms/CustomSlider";
import FlexContainer from "@/src/components/layout/FlexContainer";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import CustomInput from "../input/CustomInput";

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

const schema = Yup.object({
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

type Props = {
  initialValues: RouteFilters;
  onSubmit:      (v: RouteFilters) => void;
  categories:    { id: number; name: string }[];
  countries:     { id: number; name: string }[];
  cities:        { id: number; name: string }[];
  onCountryChange: (id: number | undefined) => void;
};

export default function FilterForm({
  initialValues,
  onSubmit,
  categories,
  countries,
  cities,
  onCountryChange,
}: Props) {
  return (
    <Formik<RouteFilters>
      initialValues={initialValues}
      validationSchema={schema}
      enableReinitialize
      onSubmit={onSubmit}
    >
      {({ values, setFieldValue, handleSubmit }) => {
        /* kai keičiasi šalis – resetinam miestą */
        useEffect(() => {
          setFieldValue("cityId", undefined);
          onCountryChange(values.countryId);
        }, [values.countryId]);

        return (
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: wp("5%"), paddingTop: wp("5%") }}
        >
          <FlexContainer gap={16} px={wp("4%")}>
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
                options={categories.map((c) => ({ label: c.name, value: c.id.toString() }))}
              />

              {/* --- Country --- */}
              <CustomSelect
                label="Select country"
                selectedValue={values.countryId?.toString()}
                onValueChange={(v) => setFieldValue("countryId", Number(v))}
                options={countries.map((c) => ({ label: c.name, value: c.id.toString() }))}
              />

              {/* --- City (disabled kol nėra country) --- */}
              <CustomSelect
                label="Select city"
                isDisabled={!values.countryId}
                selectedValue={values.cityId?.toString()}
                onValueChange={(v) => setFieldValue("cityId", Number(v))}
                options={cities.map((ci) => ({
                  label: ci.name,
                  value: ci.id.toString(),
                }))}
              />

            <CustomSelect
              label="Select difficulty"
              selectedValue={values.difficulty}
              onValueChange={(v) => setFieldValue("difficulty", v)}
              options={[
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

            <HStack alignItems="center" space={3}>
              <Text>Only favorites</Text>
              <Switch
                isChecked={values.onlyFavorites ?? false}
                onToggle={(v) => setFieldValue("onlyFavorites", v)}
              />
            </HStack>

            <Button mt="auto" onPress={() => handleSubmit()}>
              Apply filters
            </Button>
          </FlexContainer>
        </ScrollView>
      )}
    }</Formik>
  );
}
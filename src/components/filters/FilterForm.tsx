import React, { forwardRef, useImperativeHandle, useState } from "react";
import { View, StyleSheet, FlatList, Text } from "react-native";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { useFormik, FormikProps, FormikHelpers } from "formik";

import FlexContainer from "@/src/components/layout/FlexContainer";
import SearchBar from "../SearchBar";
import CustomSelect from "../ui/forms/CustomSelect";
import CustomButton from "../ui/btns/Button";

import { routesFilterSchema as schema } from "@/src/validation/routesFilterSchema";
import { usePrevious } from "@/src/utils/usePrevious";
import { useFiltersForm } from "@/src/hooks/useFiltersForm";
import { Category } from "@/src/store/travelApi";
import RatingMinChips from "../ui/forms/chips/RatingMinChips";
import ElevationRangePresets from "../ui/forms/chips/ElevationRangePresets";
import DifficultyChips from "../ui/forms/chips/DifficultyChips";
import {
  DifficultyLevel,
  RouteFilters,
} from "@/src/data/features/types/routeFilters";
import FormField from "../ui/forms/FormField";
import RatingStars from "../ui/forms/RatingStars";
import DistancePresets from "../ui/forms/chips/DistancePresets";
import DistanceRange from "../ui/forms/DistanceRange";
import { distanceCfg } from "@/src/config/distanceRange";

type Props = {
  initialValues: RouteFilters;
  onSubmit: (
    values: RouteFilters,
    helpers: FormikHelpers<RouteFilters>
  ) => void;
  onCancel?: () => void;
  categories: Category[];
  countries: { id: number; name: string }[];
  cities: { id: number; name: string }[]; // palikta suderinamumui
  routeKey: string;
};

const FilterForm = forwardRef<FormikProps<RouteFilters>, Props>(
  (
    { initialValues, onSubmit, categories, countries, routeKey, onCancel },
    ref
  ) => {
    const prevInitial = usePrevious(initialValues);
    const formik = useFormik<RouteFilters>({
      initialValues,
      validationSchema: schema,
      enableReinitialize: !!(prevInitial && prevInitial !== initialValues),
      onSubmit,
    });

    const { values, handleSubmit } = formik;
    useImperativeHandle(ref, () => formik, [formik]);

    const [scrollEnabled, setScrollEnabled] = useState(true);
    const {
      updateField,
      handleCountryChange,
      handleCityChange,
      isCityDisabled,
      cityOptions,
    } = useFiltersForm(routeKey, formik);

    const categoryOptions = [
      { label: "All", value: "" },
      ...categories.map((c) => ({
        label: c.name ?? "Unknown",
        value: String(c.id),
      })),
    ];

    const countryOptions = [
      { label: "All", value: "" },
      ...countries.map((c) => ({
        label: c.name ?? "Unknown",
        value: String(c.id),
      })),
    ];

    const renderHeader = () => (
      <FlexContainer gap={16} px={wp("4%")}>
        <SearchBar
          placeholder="Search keywords"
          value={values.search ?? ""}
          onChangeText={(t) => updateField("search", t)}
          onClear={() => updateField("search", "")}
        />

        <FormField label="Category">
          <CustomSelect
            placeholder="Select category"
            selectedValue={values.categoryId?.toString() ?? ""}
            onValueChange={(v) =>
              updateField("categoryId", v ? Number(v) : undefined)
            }
            options={categoryOptions}
          />
        </FormField>

        <FormField label="Country">
          <CustomSelect
            placeholder="Select country"
            selectedValue={values.countryId?.toString() ?? ""}
            onValueChange={handleCountryChange}
            options={countryOptions}
          />
        </FormField>

        <FormField label="City">
          <CustomSelect
            placeholder="Select city"
            selectedValue={values.cityId?.toString() ?? ""}
            onValueChange={handleCityChange}
            options={cityOptions}
            isDisabled={isCityDisabled}
          />
        </FormField>

        <FormField label="Difficulty">
          <DifficultyChips
            value={(values.difficulty as DifficultyLevel) ?? ""}
            onChange={(v) =>
              updateField("difficulty", (v as DifficultyLevel) || undefined)
            }
          />
        </FormField>

        <FormField label="Minimum rating">
          <RatingStars
            value={values.minRating}
            onChange={(v) => updateField("minRating", v)}
          />
        </FormField>

        <FormField label="Distance">
          <DistanceRange
            value={[
              values.minDistance ?? distanceCfg.min,
              values.maxDistance ?? distanceCfg.max,
            ]}
            config={distanceCfg}
            onChange={([lo, hi]) => {
              // kviečiama tik atleidus
              updateField("minDistance", lo);
              updateField("maxDistance", hi);
            }}
          />
        </FormField>
        {/* <FormField
          label="Elevation range"
          hint="Set minimum and maximum elevation."
        >
          <ElevationRangePresets
            value={values.elevation}
            onChange={(v) => updateField("elevation", v)} // v: [number, number]
          />
        </FormField> */}
      </FlexContainer>
    );

    return (
      <>
        <FlatList
          data={[null]}
          keyExtractor={() => "filters"}
          renderItem={() => null}
          ListHeaderComponent={renderHeader}
          nestedScrollEnabled
          keyboardShouldPersistTaps="handled"
          scrollEnabled={scrollEnabled} // 👈 naudok
          contentContainerStyle={{ paddingBottom: wp("5%") }}
        />

        <View style={styles.btnsContainer}>
          {/* ✅ typo: 'outline' */}
          <CustomButton
            isFlex1={true}
            variant="ouline"
            onPress={onCancel ?? (() => {})}
          >
            Clear Filters
          </CustomButton>
          <CustomButton isFlex1={true} onPress={handleSubmit}>
            Apply Filters
          </CustomButton>
        </View>
      </>
    );
  }
);

export default FilterForm;

const styles = StyleSheet.create({
  btnsContainer: {
    flexDirection: "row",
    padding: wp("4%"),
    justifyContent: "space-between",
    backgroundColor: "#fff",
    gap: 8,
  },
});

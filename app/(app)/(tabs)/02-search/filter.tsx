import React, { useState } from "react";
import { ScrollView, Keyboard, TouchableWithoutFeedback, TextInput, View, Text } from "react-native";
import { useGetRoutesQuery } from "@/src/store/travelApi";
import { routesFilterSchema } from "@/src/validation/routesFilterSchema";
import { Formik } from "formik";
import * as Yup from "yup";
import Button from "@/src/components/ui/btns/Button";

export const routesFilterInitial = {
  country_id: null,
  city_id: null,
  category_id: null,
  difficulty: [] as ("easy" | "moderate" | "challenging" | "difficult")[],
  min_distance: null,
  max_distance: null,
  min_elevation: null,
  max_elevation: null,
  search: '',
  cursor: null,
  limit: 2,
  direction: 'forward',
  sort: 'created_at_desc',
} as Yup.InferType<typeof routesFilterSchema>;

export default function FilterScreen() {
  const [filters, setFiltersState] = useState(routesFilterInitial);
  const { data, isFetching, isError, refetch } = useGetRoutesQuery(filters, {
    skip: true,
  });

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView style={{ padding: 16, backgroundColor: "#fff" }} keyboardShouldPersistTaps="handled">
        <Formik
          initialValues={routesFilterInitial}
          validationSchema={routesFilterSchema}
          onSubmit={(values) => {
            const cleaned = Object.fromEntries(
              Object.entries(values).filter(
                ([key, v]) =>
                  v !== null &&
                  v !== '' &&
                  !(Array.isArray(v) && key !== 'difficulty' && v.length === 0)
              )
            );

            setFiltersState(cleaned);
            refetch(); // trigger API call
          }}
        >
          {({ values, handleChange, handleSubmit, errors }) => (
            <>
              <Text>Min Distance (km)</Text>
              <TextInput
                style={{ borderWidth: 1, padding: 8, marginBottom: 8 }}
                value={values.min_distance?.toString() ?? ''}
                onChangeText={handleChange("min_distance")}
                keyboardType="numeric"
              />
              {errors.min_distance && <Text style={{ color: 'red' }}>{errors.min_distance}</Text>}

              <Text>Search</Text>
              <TextInput
                style={{ borderWidth: 1, padding: 8, marginBottom: 8 }}
                value={values.search}
                onChangeText={handleChange("search")}
              />

              <Button label="Apply Filters" onPress={handleSubmit as any} />
            </>
          )}
        </Formik>

        {isFetching && <Text>Loading...</Text>}
        {isError && <Text>Error loading data</Text>}
        {data && <Text style={{ marginTop: 16 }}>Found {data.data.length} routes.</Text>}
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

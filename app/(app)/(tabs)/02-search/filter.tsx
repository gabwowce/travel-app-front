import React, { useEffect, useState } from "react";
import { Box, Text, FlatList, Spinner } from "native-base";
import { Keyboard, ScrollView, TouchableWithoutFeedback, View } from "react-native";
import { useAppDispatch, useAppSelector } from "@/src/data/hooks";
import { fetchRoutes } from "@/src/data/features/routes/routesThunks";
import MiniTourCard from "@/src/components/MiniTourCard";
import SearchBar from "@/src/components/SearchBar"; 
import Header from "@/src/components/Header";
import FlexContainer from "@/src/components/layout/FlexContainer";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { Formik } from 'formik';
import { routesFilterSchema, routesFilterInitial } from '@/src/validation/routesFilterSchema';
import { useGetRoutesQuery, useLazyGetRoutesQuery  } from '@/src/store/travelApi';
import { useAppDispatch } from '@/src/data/hooks';
import { setFilters } from '@/src/data/features/filters/filtersSlice';

export const routesFilterInitial = {
  country_id:    null,
  city_id:       null,
  category_id:   null,
  difficulty:    [],        // checkbox group
  min_distance:  null,
  max_distance:  null,
  min_elevation: null,
  max_elevation: null,
  search:        '',
  cursor:        null,
  limit:         20,
  direction:     'forward',
  sort:          'created_at_desc',
} as Yup.InferType<typeof routesFilterSchema>;



export default function FilterScreen() {
  const [triggerGetRoutes, { data, isFetching, isError }] = useLazyGetRoutesQuery();

  onSubmit={(values) => {
    const cleaned = Object.fromEntries(
      Object.entries(values).filter(
        ([_, v]) =>
          v !== null && v !== '' && !(Array.isArray(v) && v.length === 0)
      )
    );
  
    dispatch(setFilters(cleaned));         // pasirenkama: naudinga, jei nori išsaugoti pasirinktus filtrus
    triggerGetRoutes(cleaned);             // Pagrindinis dalykas – paleidžiam užklausą
    router.back();                         // grįžtam į SearchScreen
  };


  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <ScrollView
      keyboardShouldPersistTaps="handled"
      style={{ backgroundColor: "#FFF" }}
    >
      <FlexContainer gap={16}>
        <Header title="Filter" />
       <Formik
          initialValues={routesFilterInitial}
          validationSchema={routesFilterSchema}
          onSubmit={(values) => {
            // Formą paverčiame query parametrais:
            const cleaned = Object.fromEntries(
              Object.entries(values).filter(([_, v]) =>
                v !== null && v !== '' && !(Array.isArray(v) && v.length === 0))
            );
            refetch(cleaned);     // RTK Query → /routes?country_id=...&difficulty=easy,moderate...
          }}
        >
          {({ values, errors, handleChange, handleSubmit }) => (
            <>
              {/* pavyzdys – Distance range */}
              <NumberInput
                label="Min distance (km)"
                value={values.min_distance ?? ''}
                onChangeText={handleChange('min_distance')}
                error={errors.min_distance}
              />
        
              {/* Difficulty checkbox group */}
              <CheckboxGroup
                options={['easy', 'moderate', 'challenging', 'difficult']}
                value={values.difficulty}
                onChange={handleChange('difficulty')}
              />
        
              <Button label="Apply filters" onPress={handleSubmit} />
            </>
          )}
        </Formik>
      </FlexContainer>
    </ScrollView>
  </TouchableWithoutFeedback>
  
  );
}

import { Box } from "native-base";
import { router } from "expo-router";
import React, { useLayoutEffect } from "react";
import { useNavigation } from "expo-router";
import Header from "@/src/components/Header";
import FilterForm from "@/src/components/ui/forms/FilterForm";
import CircleButton from "@/src/components/ui/btns/CircleButton";
import { mergeFiltersForKey } from "@/src/data/features/filters/filtersSlice";
import useAnnounceForAccessibility from "@/src/hooks/useAnnounceForAccessibility";
import { useFiltersModalData } from "@/src/hooks/useFiltersModalData";

export default function FiltersModal() {
  const {
    from,
    formRef,
    initial,
    categories,
    countries,
    cities,
    setSelectedCountryId,
    dispatch,
  } = useFiltersModalData();
  const navigation = useNavigation();
  useAnnounceForAccessibility(
    "Filters modal opened. Use the form to refine your search."
  );
  const handleSubmit = (values: typeof initial) => {
    dispatch(mergeFiltersForKey({ key: from, filters: values }));
    router.back();
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <CircleButton
          variant="apply"
          label="Apply"
          onPress={() => formRef.current?.handleSubmit()}
        />
      ),
    });
  }, [navigation, formRef]);

  return (
    <Box flex={1} bg="white">
      {/* <Header
        title="Filters"
        onBackPress={() => router.back()}
        rightIcon={
          <CircleButton
            variant="apply"
            label="Apply"
            onPress={() => formRef.current?.handleSubmit()}
          />
        }
      /> */}

      <FilterForm
        ref={formRef}
        initialValues={initial}
        onSubmit={handleSubmit}
        categories={categories}
        countries={countries}
        cities={cities}
        onCountryChange={setSelectedCountryId}
        routeKey={from}
      />
    </Box>
  );
}

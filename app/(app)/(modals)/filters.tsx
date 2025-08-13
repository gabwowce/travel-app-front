// app/(modals)/filters.tsx
import React, { useEffect, useCallback, useLayoutEffect } from "react";
import { router, useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import FilterForm from "@/src/components/filters/FilterForm";
import { useFiltersModalData } from "@/src/hooks/useFiltersModalData";
import { useAppDispatch, useAppSelector } from "@/src/data/hooks";
import {
  applyDraftForKey,
  mergeFiltersDraftForKey,
  clearFiltersDraft,
  clearAppliedForKey,
} from "@/src/data/features/filters/filtersSlice";
import {
  selectAppliedByKey,
  selectDraftByKey,
} from "@/src/data/features/filters/selectors";
import CircleButton from "@/src/components/ui/btns/CircleButton";

export const unstable_settings = { presentation: "modal" };

export default function FiltersModal() {
  const { routeKey, formRef, categories, countries } = useFiltersModalData();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  const applied = useAppSelector((st) => selectAppliedByKey(st, routeKey));
  const draft = useAppSelector((st) => selectDraftByKey(st, routeKey));

  // ATIDARANT: draft = applied (jokio seno „šlamšto“)
  useEffect(() => {
    dispatch(clearFiltersDraft({ key: routeKey }));
    dispatch(
      mergeFiltersDraftForKey({ key: routeKey, filters: applied ?? {} })
    );
    // UŽDARANT (back/gestas/Close): visada nuvalom draft
    const sub = navigation.addListener("beforeRemove", () => {
      dispatch(clearFiltersDraft({ key: routeKey }));
    });
    return () => {
      sub();
      dispatch(clearFiltersDraft({ key: routeKey }));
    };
  }, [routeKey, applied, dispatch, navigation]);

  // APPLY: form values → draft → applied, tada uždarom
  const handleSubmit = useCallback(
    (values: any) => {
      dispatch(
        mergeFiltersDraftForKey({ key: routeKey, filters: values ?? {} })
      );
      dispatch(applyDraftForKey({ key: routeKey }));
      router.back();
    },
    [dispatch, routeKey]
  );

  const handleClose = useCallback(() => {
    dispatch(clearFiltersDraft({ key: routeKey }));

    router.back();
  }, [dispatch, routeKey]);

  // CLOSE: tik uždarom ir išvalom draft (applied neliečiam)
  const handleCancel = useCallback(() => {
    dispatch(clearFiltersDraft({ key: routeKey }));
    dispatch(clearAppliedForKey({ key: routeKey }));
    router.back();
  }, [dispatch, routeKey]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <CircleButton variant="close" label="Close" onPress={handleClose} />
      ),
    });
  });

  return (
    <>
      <StatusBar style="light" translucent backgroundColor="transparent" />
      <SafeAreaView
        style={{ flex: 1, backgroundColor: "#fff" }}
        edges={["bottom", "right", "left"]}
      >
        <FilterForm
          ref={formRef}
          initialValues={applied ?? {}}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          categories={categories}
          countries={countries}
          cities={[]}
          routeKey={routeKey}
        />
      </SafeAreaView>
    </>
  );
}

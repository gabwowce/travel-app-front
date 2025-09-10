// app/(modals)/filters.tsx
import FilterForm from "@/src/components/filters/FilterForm";
import CircleButton from "@/src/components/ui/btns/CircleButton";
import {
  applyDraftForKey,
  clearAppliedForKey,
  clearFiltersDraft,
  mergeFiltersDraftForKey,
} from "@/src/data/features/filters/filtersSlice";
import {
  makeSelectAppliedByKey,
  makeSelectDraftByKey,
} from "@/src/data/features/filters/selectFiltersByKey";
import { useAppDispatch, useAppSelector } from "@/src/data/hooks";
import { useFiltersModalData } from "@/src/hooks/useFiltersModalData";
import { router, useNavigation } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useLayoutEffect, useMemo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export const unstable_settings = { presentation: "modal" };

export default function FiltersModal() {
  const { routeKey, formRef, categories, countries } = useFiltersModalData();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  const selectApplied = useMemo(makeSelectAppliedByKey, []);
  const applied = useAppSelector((st) => selectApplied(st, routeKey));

  const selectDraft = useMemo(makeSelectDraftByKey, []);
  const draft = useAppSelector((st) => selectDraft(st, routeKey));

  // const applied = useAppSelector((st) => selectAppliedByKey(st, routeKey));
  // const draft = useAppSelector((st) => selectDraftByKey(st, routeKey));

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
      <StatusBar style="dark" />
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

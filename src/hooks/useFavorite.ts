// src/hooks/useFavorite.ts
import { useAppDispatch } from "@/src/data/hooks";
import {
  travelApi,
  useAddRouteToFavoritesMutation,
  useGetUserFavoritesQuery,
  useRemoveRouteFromFavoritesMutation,
} from "@/src/store/travelApi";
import {
  normalizeFavorites,
  pickRouteIdFromFavorite,
  toNum,
} from "@/src/utils/favorites/utils";
import { useEffect, useMemo, useRef, useState } from "react";

// ---- GLOBAL arg registras (vienoje vietoje visam app) -----------------
const FAV_ARGS_REGISTRY = new Map<string, any>();
function registerFavArg(arg: any) {
  const key = JSON.stringify(arg ?? {});
  FAV_ARGS_REGISTRY.set(key, arg ?? {});
}
function listFavArgs(): any[] {
  return Array.from(FAV_ARGS_REGISTRY.values());
}
// -----------------------------------------------------------------------

function getErrorMessage(e: unknown): string {
  if (!e || typeof e !== "object") return "";
  const data: any = (e as any).data;
  if (typeof data?.message === "string") return data.message;
  if (typeof (e as any).error === "string") return (e as any).error;
  return "";
}

type UseFavoriteOpts = {
  initialSelected?: boolean;
  useTagsInvalidation?: boolean;
};

export function useFavorite(routeId: number, opts?: UseFavoriteOpts) {
  const idNum = toNum(routeId);
  const dispatch = useAppDispatch();

  // ⚠️ Naudok vienodą arg visur. Jei kažkur turi {page:1,per_page:20} – dėk tą patį.
  const favArg = useMemo(() => ({}) as const, []);
  registerFavArg(favArg); // <- registruojam, kad vėliau atnaujintume VISUS

  const {
    data: favResp,
    isFetching: fetchingFavs,
    isLoading: loadingFavs,
    refetch: refetchFavs,
  } = useGetUserFavoritesQuery(favArg, {
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
  });

  const [add, addState] = useAddRouteToFavoritesMutation();
  const [remove, removeState] = useRemoveRouteFromFavoritesMutation();

  const [optimistic, setOptimistic] = useState<boolean | null>(null);

  const serverSelected: boolean | undefined = useMemo(() => {
    if (idNum === undefined) return undefined;
    const list = normalizeFavorites(favResp);
    const ids = new Set<number>();
    for (const it of list) {
      const rid = pickRouteIdFromFavorite(it);
      if (typeof rid === "number") ids.add(rid);
    }
    return ids.has(idNum);
  }, [favResp, idNum]);

  const selected =
    (optimistic ?? serverSelected ?? opts?.initialSelected ?? false) === true;

  const busy =
    fetchingFavs || loadingFavs || addState.isLoading || removeState.isLoading;

  // ✅ Reconcile: nuimam optimistic, kai tik serverio tiesa pasikeičia
  useEffect(() => {
    if (
      optimistic !== null &&
      serverSelected !== undefined &&
      optimistic !== serverSelected
    ) {
      if (__DEV__)
        console.log("[useFavorite] reconcile optimistic→server", {
          routeId: idNum,
          optimistic,
          serverSelected,
        });
      setOptimistic(null);
    }
  }, [serverSelected, idNum]); // klausom serverSelected

  // Rasti masyvą, kurį patchinsim (tavo backendas grąžina data.items)
  const pickContainer = (draft: any): any[] | null => {
    if (Array.isArray(draft)) return draft;
    if (Array.isArray(draft?.data?.items)) return draft.data.items; // <-- svarbu
    if (Array.isArray(draft?.data?.data)) return draft.data.data;
    if (Array.isArray(draft?.data)) return draft.data;
    if (Array.isArray(draft?.favorites)) return draft.favorites;
    if (Array.isArray(draft?.favorites?.data)) return draft.favorites.data;
    if (Array.isArray(draft?.items)) return draft.items;
    return null;
  };

  const undoersRef = useRef<Array<() => void>>([]);

  async function toggle() {
    if (idNum === undefined) return;

    try {
      if (__DEV__)
        console.log("[useFavorite] toggle start", { idNum, selected });

      // 1) OPTIMISTINIS PATCH visiems žinomiems arg’ams (Home, Details ir t. t.)
      const allArgs = listFavArgs();
      undoersRef.current = allArgs.map((arg) => {
        const action = travelApi.util.updateQueryData(
          "getUserFavorites",
          arg,
          (draft: any) => {
            const container = pickContainer(draft);
            if (!container) return;
            const idx = container.findIndex(
              (it: any) => pickRouteIdFromFavorite(it) === idNum
            );
            if (selected) {
              if (idx !== -1) container.splice(idx, 1);
            } else {
              // minimalus įrašas – UI turi bent id/pivot
              if (idx === -1)
                container.unshift({ id: idNum, pivot: { route_id: idNum } });
            }
          }
        );
        const res = dispatch(action) as unknown as { undo?: () => void };
        return res?.undo ?? (() => {});
      });

      // 2) Lokalus pojūtis ikonai
      setOptimistic(!selected);

      // 3) Tikras serverio kvietimas
      if (selected) await remove({ route: idNum }).unwrap();
      else await add({ route: idNum }).unwrap();

      // 4) REFETCH visiems žinomiems arg’ams (kad tikrai atsinaujintų Home ir Details)
      if (!opts?.useTagsInvalidation) {
        const args = listFavArgs();
        if (__DEV__)
          console.log("[useFavorite] refetch for args count:", args.length);
        await Promise.allSettled(
          args.map(
            (arg) =>
              dispatch(
                travelApi.endpoints.getUserFavorites.initiate(arg, {
                  subscribe: false,
                  forceRefetch: true,
                })
              ) as any
          )
        );
      }

      // sėkmė: išvalom undo’erius
      undoersRef.current = [];
      if (__DEV__) console.log("[useFavorite] toggle success");
    } catch (e) {
      // rollback visiems patch’ams
      for (const undo of undoersRef.current) {
        try {
          undo();
        } catch {}
      }
      undoersRef.current = [];
      const msg = getErrorMessage(e).toLowerCase();
      if (msg.includes("already in favorites")) setOptimistic(true);
      else if (msg.includes("not in favorites")) setOptimistic(false);
      else setOptimistic(null);
      if (__DEV__) console.warn("[useFavorite] toggle failed:", e);
    }
  }

  return { selected, busy, toggle };
}

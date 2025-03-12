import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/src/data/store";

// ✅ Taisome tipizavimą: grąžiname `dispatch` funkciją
export const useAppDispatch = () => useDispatch<AppDispatch>();
// src/hooks/useAppSelector.ts
import { TypedUseSelectorHook, useSelector } from "react-redux";
import type { RootState } from "@/src/data/store";

// ✅ Teisingai tipizuotas `useSelector`
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

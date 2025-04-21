// src/hooks/useBreakpoint.ts
import { useWindowDimensions } from "react-native";

export type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl";
export type HeightBreakpoint = "short" | "regular" | "tall";

export default function useBreakpoint() {
  const { width, height } = useWindowDimensions();

  let breakpoint: Breakpoint;
  if (width >= 1200) breakpoint = "xl";
  else if (width >= 900) breakpoint = "lg";
  else if (width >= 600) breakpoint = "md";
  else if (width >= 400) breakpoint = "sm";
  else breakpoint = "xs";

  let heightBreakpoint: HeightBreakpoint;
  if (height < 840) heightBreakpoint = "short";
  else if (height > 840) heightBreakpoint = "regular";
  else heightBreakpoint = "tall";

  return {
    width,
    height,
    breakpoint,        
    heightBreakpoint,
  };
}

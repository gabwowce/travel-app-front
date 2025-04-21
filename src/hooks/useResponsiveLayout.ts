// src/hooks/useResponsiveLayout.ts
import { useWindowDimensions } from 'react-native';
import useBreakpoint from "@/src/hooks/useBreakpoint";
import { layout } from "@/src/tokens/layout";

interface ResponsiveLayoutConfig {
  width: number;
  height: number;
  margin: number;
  columns: number;
  imageWidth: number;
  imageHeight: number;
  spacing: number;
  headingTopOffset: number;
  cardWidth: number;
  cardHeight: number;
}

export default function useResponsiveLayout(): ResponsiveLayoutConfig {
  const { width } = useWindowDimensions();
  const breakpoint = useBreakpoint();

  const cardWidth = width * layout.cardWidth[breakpoint];
  const cardHeight = cardWidth * 1.2;
  const imageWidth = cardWidth;
  const imageHeight = imageWidth * 1.2;
  const spacing = layout.spacing[breakpoint];
  const headingTopOffset = layout.headingTop[breakpoint];

  const columns = (() => {
    switch (breakpoint) {
      case 'xl': return 4;
      case 'lg': return 3;
      case 'md': return 2;
      case 'sm': return 2;
      default: return 1;
    }
  })();

  return {
    width: cardWidth,
    height: cardHeight,
    margin: 12,
    columns,
    imageWidth,
    imageHeight,
    spacing,
    headingTopOffset,
    cardWidth,
    cardHeight,
  };
}
// vieninga tema abiem slankikliams
export const sliderTheme = {
  trackHeight: 6,
  trackBg: "#E2E8F0", // coolGray.200
  trackBgDark: "#334155", // coolGray.700
  selectedBg: "#3B82F6", // primary.500
  thumbSize: 24,
  thumbActiveSize: 28,
  thumbBorderWidth: 2,
  thumbBorderColor: "#fff",
  containerVPad: 16,
  // didesnė touch zona aplink nykštį (SingleSlider)
  hitSlop: { top: 14, bottom: 14, left: 14, right: 14 } as const,
  // didesnė touch zona (RangeSlider)
  touchDimensions: {
    height: 48,
    width: 48,
    borderRadius: 24,
    slipDisplacement: 200,
  },
};

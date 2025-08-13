// Bendras konfigo tipas, naudojamas tiek RangeSlider, tiek DistanceRange
export type RangeSliderConfig = {
  // reikšmės
  min: number;
  max: number;
  step?: number;

  // formatas
  unit?: string; // pvz. "km"
  precision?: number; // skaičiai po kablelio

  // elgsena
  live?: boolean; // jei false – commit daromas tik "finish"
  showBubbles?: boolean;
  showEdgeLabels?: boolean;

  // spalvos
  colors: {
    active: string; // tarp thumb’ų
    inactive: string; // už thumb’ų (kairė/dešinė)
    thumb: string; // žymeklio užpildas
    thumbBorder: string;
  };

  // geometrija / UX
  trackHeight?: number;
  trackRadius?: number;
  horizontalPadding?: number;

  // didesnė "touch" zona ir slip tolerancija (kad drag nenutrūktų)
  touchSize?: number; // px
  slipTolerance?: number; // px vertikaliai iki drag nutraukimo

  // pilka bazinė juosta "po apačia"
  baseTrackColor?: string;
};

// 👉 Numatytoji Distance slider konfigūracija
export const distanceCfg: RangeSliderConfig = {
  min: 0,
  max: 300,
  step: 1,

  unit: "km",
  precision: 0,

  live: false, // smooth – nekeliam Formik/Redux kas frame
  showBubbles: true,
  showEdgeLabels: true,

  colors: {
    active: "#001F3F",
    inactive: "transparent", // bazinė juosta bus atskirai
    thumb: "#fff",
    thumbBorder: "#001F3F",
  },

  trackHeight: 6,
  trackRadius: 999,
  horizontalPadding: 16,

  touchSize: 140, // didelis "hitbox"
  slipTolerance: 10000, // realiai „nepaleidžia“ iki atleidimo

  baseTrackColor: "#E5E7EB",
};

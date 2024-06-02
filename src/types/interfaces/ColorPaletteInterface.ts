import type { ColorPaletteEnum } from "../enums/ColorPaletteEnums";

export interface ColorPaletteI {
  mode: ColorPaletteEnum;
  count: number;
  colors: ColorI[];
}

export interface ColorI {
  // TODO: Break down further if needed
  hex: string;
  rgb: string;
  hsl: string;
  hsv: string;
  isDark: boolean;
}

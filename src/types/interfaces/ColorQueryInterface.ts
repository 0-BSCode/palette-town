import type { ColorPaletteEnum } from "../enums/ColorPaletteEnum";

// Schema based on scheme fields from https://www.thecolorapi.com/docs
export interface ColorQueryI {
  hex: string;
  mode: ColorPaletteEnum;
  count?: number;
}

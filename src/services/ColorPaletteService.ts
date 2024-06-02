import { ColorPaletteEnum } from "../types/enums/ColorPaletteEnum";
import type { ColorPaletteI } from "../types/interfaces/ColorPaletteInterface";
import type { ColorQueryI } from "../types/interfaces/ColorQueryInterface";
import type { ColorResponseI } from "../types/interfaces/ColorResponseInterface";
import calculateRGBBrightness from "../utils/calculateRGBBrightness";

const BASE_URL = "https://www.thecolorapi.com/scheme";
const colorPaletteStringToEnumMapping = {
  analogic: ColorPaletteEnum.ANALOGIC,
  "analogic-complement": ColorPaletteEnum.ANALOGIC_COMPLEMENT,
  complementary: ColorPaletteEnum.COMPLEMENTARY,
  monochrome: ColorPaletteEnum.MONOCHROME,
  "monochrome-dark": ColorPaletteEnum.MONOCHROME_DARK,
  "monochrome-light": ColorPaletteEnum.MONOCHROME_LIGHT,
  quad: ColorPaletteEnum.QUAD,
  triad: ColorPaletteEnum.TRIAD,
};

class ColorPaletteService {
  async fetchPalette(hexString: string, mode: ColorPaletteEnum) {
    const hex = hexString.replace("#", "");

    const queryObject: ColorQueryI = {
      hex,
      mode: mode,
    };

    const urlParams = this.#generateQueryParams(queryObject);

    const result = await fetch(`${BASE_URL}?${urlParams}`);
    const data: ColorResponseI = await result.json();
    const colorPalette = this.#parseResponseInfo(data);
    console.log(colorPalette);

    return colorPalette;
  }

  #parseResponseInfo(data: ColorResponseI) {
    const colorPalette: ColorPaletteI = {
      mode: colorPaletteStringToEnumMapping[
        data.mode as keyof typeof colorPaletteStringToEnumMapping
      ],
      count: data.count,
      colors: data.colors.map((c) => {
        return {
          hex: c.hex.value,
          rgb: c.rgb.value,
          hsl: c.hsl.value,
          hsv: c.hsv.value,
          isDark: calculateRGBBrightness(c.rgb.r, c.rgb.g, c.rgb.b) < 128,
        };
      }),
    };

    return colorPalette;
  }

  #generateQueryParams(queryObject: ColorQueryI) {
    const params = new URLSearchParams();
    Object.entries(queryObject).forEach(([key, value]) => {
      params.append(key, value);
    });
    return params.toString();
  }
}

export default ColorPaletteService;

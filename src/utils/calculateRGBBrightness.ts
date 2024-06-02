const calculateRGBBrightness = (r: number, g: number, b: number) => {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

export default calculateRGBBrightness;

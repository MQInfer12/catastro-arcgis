import type { TypeColor } from "../interfaces/SearchOption";
import { SimpleMarkerSymbol, SimpleFillSymbol, SimpleLineSymbol } from "@arcgis/core/symbols";

export const createJSColor = (color: TypeColor, opacity: number = 1) => {
  const cssColor1 = getComputedStyle(document.documentElement).getPropertyValue(`--${color}-1`);
  const hexColor1 = cssColor1.replace('#', '');
  const r1 = parseInt(hexColor1.slice(0, 2), 16);
  const g1 = parseInt(hexColor1.slice(2, 4), 16);
  const b1 = parseInt(hexColor1.slice(4, 6), 16);
  const cssColor2 = getComputedStyle(document.documentElement).getPropertyValue(`--${color}-2`);
  const hexColor2 = cssColor2.replace('#', '');
  const r2 = parseInt(hexColor2.slice(0, 2), 16);
  const g2 = parseInt(hexColor2.slice(2, 4), 16);
  const b2 = parseInt(hexColor2.slice(4, 6), 16);
  
  return {
    color1: [r1, g1, b1, opacity],
    color2: [r2, g2, b2, opacity]
  }
}

export const createPointSymbol = (color: TypeColor, opacity: number = 1, size = 8) => {
  const colors = createJSColor(color, opacity);
  const markerSymbol = new SimpleMarkerSymbol({
    color: colors.color1,
    size: size,
    outline: {
      color: colors.color2,
      width: 1,
    },
  });
  return markerSymbol;
};

export const colorToSymbol = (color: TypeColor, opacity: number = 1) => {
  const colors = createJSColor(color, opacity);
  return {
    type: "simple-fill",
    color: colors.color1,
    outline: {
      color: colors.color2,
      width: 1
    }
  } 
}
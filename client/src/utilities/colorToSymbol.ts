import type { TypeColor } from "../interfaces/SearchOption";

export const colorToSymbol = (color: TypeColor, opacity: number = 1) => {
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
    type: "simple-fill",
    color: [r1, g1, b1, opacity],
    outline: {
      color: [r2, g2, b2, opacity],
      width: 1
    }
  } 
}
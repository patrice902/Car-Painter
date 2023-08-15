import * as getCanvasPixelColor from "get-canvas-pixel-color";

import { calcAverageColor } from "./calcAverageColor";
import { extractColors } from "./extractColors";

export const getColor = (
  targetCanvas: HTMLCanvasElement,
  e: MouseEvent,
  pickRadius?: number
) => {
  const { offsetX, offsetY, pageX, pageY } = e;
  const x = offsetX || pageX;
  const y = offsetY || pageY;
  if (pickRadius === undefined || pickRadius === 0) {
    return getCanvasPixelColor(targetCanvas, x, y);
  } else {
    const colorBlock = extractColors(targetCanvas, pickRadius, x, y);
    return calcAverageColor(colorBlock);
  }
};

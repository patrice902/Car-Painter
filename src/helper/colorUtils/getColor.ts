import * as getCanvasPixelColor from "get-canvas-pixel-color";

import { calcAverageColor } from "./calcAverageColor";
import { extractColors } from "./extractColors";

export const getColor = (
  targetCanvas: HTMLCanvasElement,
  e: MouseEvent,
  pickRadius?: number
) => {
  const { offsetX, offsetY } = e;
  if (pickRadius === undefined || pickRadius === 0) {
    return getCanvasPixelColor(targetCanvas, offsetX, offsetY);
  } else {
    const colorBlock = extractColors(
      targetCanvas,
      pickRadius,
      offsetX,
      offsetY
    );
    return calcAverageColor(colorBlock);
  }
};

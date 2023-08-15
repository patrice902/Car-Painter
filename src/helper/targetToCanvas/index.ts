import html2canvas from "html2canvas";

import { elementToCanvas } from "./elementToCanvas";
import { imageToCanvas } from "./imageToCanvas";

export const targetToCanvas = (
  target: EventTarget
): Promise<HTMLCanvasElement> => {
  if (!(target instanceof HTMLElement)) {
    throw new Error("targetToCanvas: event target not HTML element");
  }
  if (target instanceof HTMLImageElement) {
    return imageToCanvas(target);
  }
  const targetBackgroundImage = window.getComputedStyle(target).backgroundImage;
  if (targetBackgroundImage && targetBackgroundImage !== "none") {
    return elementToCanvas(target);
  }
  return html2canvas(target, { logging: false, scale: 1 });
};

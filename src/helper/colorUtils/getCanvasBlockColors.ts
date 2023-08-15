import { RgbObj } from "./types";

type ExtractionValues = {
  x: number;
  y: number;
  targetWidth: number;
  targetHeight: number;
  canvasWidth: number;
  canvasHeight: number;
};

const validateCanvasExtractionValues = (extractionValues: ExtractionValues) => {
  // do not compute data if they're out of canvas area
  const {
    x,
    y,
    targetHeight,
    targetWidth,
    canvasHeight,
    canvasWidth,
  } = extractionValues;

  const newExtractionValues = { ...extractionValues };

  if (x < 0) {
    newExtractionValues.x = 0;
  }
  if (y < 0) {
    newExtractionValues.y = 0;
  }
  if (x + targetWidth > canvasWidth) {
    newExtractionValues.targetWidth = canvasWidth - x;
  }
  if (y + targetHeight > canvasHeight) {
    newExtractionValues.targetHeight = canvasHeight - y;
  }

  return newExtractionValues;
};

export const getCanvasBlockColors = (
  canvas: HTMLCanvasElement,
  x: number,
  y: number,
  width: number,
  height: number
): Array<RgbObj> => {
  if (!canvas.getContext) {
    throw new Error("getCanvasBlockColors: element is not of type canvas");
  }
  const ctx = canvas.getContext("2d");

  const validatedExtractionValues = validateCanvasExtractionValues({
    x,
    y,
    targetHeight: height,
    targetWidth: width,
    canvasHeight: canvas.height,
    canvasWidth: canvas.width,
  });

  if (!ctx) {
    throw new Error("getCanvasBlockColors: ctx is null");
  }

  const imageData = ctx.getImageData(
    validatedExtractionValues.x,
    validatedExtractionValues.y,
    validatedExtractionValues.targetWidth,
    validatedExtractionValues.targetHeight
  ).data;

  const colorBlock = [];
  for (let i = 0; i < imageData.length; i += 4) {
    const color = imageData.slice(i, i + 4);
    colorBlock.push({ r: color[0], g: color[1], b: color[2] });
  }

  return colorBlock;
};

import { RgbObj } from "./types";

export const calcAverageColor = (colorBlock: Array<RgbObj>): RgbObj => {
  const totalPixels = colorBlock.length;

  if (
    typeof colorBlock !== "object" ||
    typeof colorBlock.reduce === "undefined"
  ) {
    throw new Error("calcAverageColor: only accepts array of colors");
  }

  if (totalPixels === 0) {
    throw new Error("calcAverageColor: 0 pixels found");
  }

  if (totalPixels === 1) {
    return colorBlock[0];
  }

  const rgbPrimary = colorBlock
    .map((array) => JSON.stringify(array))
    .filter((item, index, array) => array.indexOf(item) === index)
    .map((string) => JSON.parse(string));

  return { r: rgbPrimary[0][0], g: rgbPrimary[0][1], b: rgbPrimary[0][2] };
};

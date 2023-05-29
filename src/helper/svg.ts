// download svg file and get its content as string
export async function urlToString(url: string) {
  const req = await fetch(url, { mode: "cors" });
  const svgString = await req.text();
  return svgString;
}

// parse svg string into DOM
export function parseSVG(svgString: string) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString, "image/svg+xml");
  return doc;
}

export function getViewBoxSizeFromSVG(svgDoc: Document) {
  const svgElement = svgDoc.querySelector("svg");

  if (svgElement) {
    const viewBoxValue = svgElement.getAttribute("viewBox");
    if (viewBoxValue) {
      const [, , viewBoxWidth, viewBoxHeight] = viewBoxValue.split(" ");
      return {
        width: Number(viewBoxWidth),
        height: Number(viewBoxHeight),
      };
    }
  }
}

// convert svg document to string
export function svgToString(svgDoc: Document) {
  const s = new XMLSerializer();
  return s.serializeToString(svgDoc);
}

// get color of element
// we can also check styles of element and other properties like "stroke"
export function getElementColor(el: Element) {
  return el.getAttribute("fill");
}

export function getElementStrokeColor(el: Element) {
  return el.getAttribute("stroke");
}

// find all colors used in svg
export function getColors(svgString: string) {
  const doc = parseSVG(svgString);
  const elements = doc.getElementsByTagName("*");
  const usedColors = [];
  for (const element of elements) {
    const color = getElementColor(element);
    // if color is defined and uniq we will add it
    if (color && usedColors.indexOf(color) === -1) {
      usedColors.push(color);
    }
  }
  return usedColors;
}

// convert svg string into base64 data URL
export function svgToURL(s: string) {
  const uri = window.btoa(unescape(encodeURIComponent(s)));
  return "data:image/svg+xml;base64," + uri;
}

// replace colors in svg string
export function replaceColors(
  svgString: string,
  options: {
    color?: string;
    stroke?: string;
    strokeWidth?: number;
    opacity?: number;
  }
) {
  // we can do some RegExp magic here
  // but I will just manually check every element
  const doc = parseSVG(svgString);
  const elements = doc.getElementsByTagName("*");

  for (const element of elements) {
    // Check and Remove existing style on svg
    if (
      element.tagName === "style" &&
      (options.color ||
        options.stroke ||
        options.strokeWidth ||
        options.opacity)
    ) {
      element.remove();
      continue;
    }
    element.removeAttribute("style");

    // Fill
    if (options.color) element.setAttribute("fill", options.color);

    // Stroke
    if (options.stroke) element.setAttribute("stroke", options.stroke);

    // Stroke Width
    element.setAttribute(
      "stroke-width",
      options.strokeWidth !== undefined && options.strokeWidth !== null
        ? options.strokeWidth.toString()
        : "1"
    );

    // Opacity
    if (options.opacity)
      element.setAttribute("opacity", options.opacity.toString());
  }

  const xmlSerializer = new XMLSerializer();
  const str = xmlSerializer.serializeToString(doc);
  return str;
}

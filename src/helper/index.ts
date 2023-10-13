import Color from "color";
import { Node } from "konva/types/Node";
import { Stage } from "konva/types/Stage";
import _ from "lodash";
import { MutableRefObject, RefObject } from "react";
import config from "src/config";
import { AllowedLayerProps } from "src/constant";
import {
  BoundBox,
  BuilderLayerJSONParitalAll,
  CarObjLayerData,
  FrameSize,
  LogoObjLayerData,
  Position,
  ScrollPosition,
  ShapeObjLayerData,
  UploadObjLayerData,
} from "src/types/common";
import { Browser, LayerTypes, MouseModes } from "src/types/enum";
import {
  BuilderBase,
  BuilderLayer,
  BuilderScheme,
  BuilderUpload,
  CarMake,
} from "src/types/model";
import {
  BuilderLayerJSON,
  BuilderLayerPayload,
  BuilderSchemeJSON,
  UserWithoutPassword,
} from "src/types/query";
import TGA from "src/utils/tga";
import { v4 as uuidv4 } from "uuid";

export const getDifferenceFromToday = (past_date: Date | string | number) => {
  const difference_In_Second =
    new Date().getTime() / 1000 - new Date(past_date).getTime();
  let returnValue;
  if (difference_In_Second < 60) {
    returnValue = Math.round(difference_In_Second);
    return `${returnValue} second${returnValue > 1 ? "s" : ""} ago`;
  }
  const difference_In_Min = difference_In_Second / 60;
  if (difference_In_Min < 60) {
    returnValue = Math.round(difference_In_Min);
    return `${returnValue} minute${returnValue > 1 ? "s" : ""} ago`;
  }
  const difference_In_Hour = difference_In_Min / 60;
  if (difference_In_Hour < 24) {
    returnValue = Math.round(difference_In_Hour);
    return `${returnValue} hour${returnValue > 1 ? "s" : ""} ago`;
  }
  const difference_In_Day = difference_In_Hour / 24;
  if (difference_In_Day < 30) {
    returnValue = Math.round(difference_In_Day);
    return `${returnValue} day${returnValue > 1 ? "s" : ""} ago`;
  }
  if (difference_In_Day < 365) {
    const difference_In_Month = difference_In_Day / 30;
    returnValue = Math.round(difference_In_Month);
    return `${returnValue} month${returnValue > 1 ? "s" : ""} ago`;
  }
  const difference_In_Year = difference_In_Day / 365;
  returnValue = Math.round(difference_In_Year);
  return `${returnValue} year${returnValue > 1 ? "s" : ""} ago`;
};

export const mathRound2 = (num: number) =>
  Math.round((num + Number.EPSILON) * 100) / 100;

export const mathRound4 = (num: number) => Math.round(num * 10000) / 10000;

export const colorValidatorWithoutAlpha = (
  color: string | null | undefined
) => {
  if (!color?.length) return true;

  if (
    color[0] === "#" &&
    (color.length === 1 || color.length === 4 || color.length === 7)
  )
    return true;
  return false;
};

export const colorValidator = (color: string | null | undefined) => {
  if (!color?.length) return true;

  if (color.length > 100) return false;

  try {
    return Color(color) ? true : false;
  } catch (error) {
    return false;
  }
};

export const getRelativePointerPosition = (node: Node) => {
  const transform = node.getAbsoluteTransform().copy();
  // to detect relative position we need to invert transform
  transform.invert();
  // get pointer (say mouse or touch) position
  const pos = node.getStage()?.getPointerPosition();
  // now we can find relative point
  return pos ? transform.point(pos) : pos;
};

export const getRelativeShadowOffset = (
  boardRotate: number,
  offset: Position
) => {
  const shadowOffset = { ...offset };
  if (boardRotate === 90) {
    shadowOffset.x = -offset.y;
    shadowOffset.y = offset.x;
  } else if (boardRotate === 180) {
    shadowOffset.x = -offset.x;
    shadowOffset.y = -offset.y;
  } else if (boardRotate === 270) {
    shadowOffset.x = offset.y;
    shadowOffset.y = -offset.x;
  }
  return shadowOffset;
};

export const removeDuplicatedPointFromEnd = (points: number[]) => {
  const new_points = [...points];
  if (new_points.length >= 4) {
    while (
      new_points[new_points.length - 1] === new_points[new_points.length - 3] &&
      new_points[new_points.length - 2] === new_points[new_points.length - 4]
    ) {
      new_points.splice(-2, 2);
    }
  }
  return new_points;
};

export const isBuilderLayerJSON = (
  layer:
    | BuilderLayer
    | BuilderLayerJSON
    | BuilderLayerPayload
    | Partial<BuilderLayer | BuilderLayerJSON | BuilderLayerPayload>
): layer is BuilderLayerJSON =>
  !!layer.layer_data && typeof layer.layer_data !== "string";

export const parseLayer = (layer: BuilderLayer | BuilderLayerJSON) => {
  if (isBuilderLayerJSON(layer)) return layer;

  const newLayer: BuilderLayerJSON = {
    ...layer,
    layer_data: JSON.parse(layer.layer_data ?? "{}"),
  };
  return newLayer;
};

export const mergeTwoLayer = (
  originLayer?: BuilderLayer | BuilderLayerJSON | null,
  targetLayer?: BuilderLayer | BuilderLayerJSON | null
) => {
  if (!targetLayer) return null;

  const convertedOriginLayer = originLayer && parseLayer(originLayer);
  const convertedTargetLayer = targetLayer && parseLayer(targetLayer);

  const newLayer = {
    ...(convertedOriginLayer || {}),
    ...(convertedTargetLayer || {}),
    layer_data: {
      ...(convertedOriginLayer?.layer_data ?? {}),
      ...(convertedTargetLayer?.layer_data ?? {}),
    },
  };

  return newLayer as BuilderLayerJSON;
};

export const isBuilderSchemeJSON = (
  layer: BuilderScheme | BuilderSchemeJSON
): layer is BuilderSchemeJSON =>
  !!layer.guide_data && typeof layer.guide_data !== "string";

export const parseScheme = (
  scheme:
    | BuilderScheme
    | BuilderSchemeJSON
    | Partial<BuilderScheme | BuilderSchemeJSON>
) => {
  if (
    !scheme ||
    isBuilderSchemeJSON(scheme as BuilderScheme | BuilderSchemeJSON)
  )
    return scheme as BuilderSchemeJSON | Partial<BuilderSchemeJSON>;

  const newScheme: BuilderSchemeJSON | Partial<BuilderSchemeJSON> = {
    ...scheme,
    guide_data: JSON.parse((scheme as BuilderScheme).guide_data ?? "{}"),
  };

  return newScheme;
};

export const mergeTwoScheme = (
  originScheme?: BuilderScheme | BuilderSchemeJSON | null,
  targetScheme?: Partial<BuilderScheme | BuilderSchemeJSON> | null
) => {
  if (!targetScheme) return null;

  const convertedOriginScheme = originScheme && parseScheme(originScheme);
  const convertedTargetScheme =
    targetScheme &&
    parseScheme(targetScheme as BuilderScheme | BuilderSchemeJSON);

  const newScheme = {
    ...(convertedOriginScheme || {}),
    ...(convertedTargetScheme || {}),
    guide_data: {
      ...(convertedOriginScheme?.guide_data ?? {}),
      ...(convertedTargetScheme?.guide_data ?? {}),
    },
  };

  return newScheme as BuilderSchemeJSON;
};

const stringifyReplacer = (key: string, value: unknown) =>
  typeof value === "undefined" ? null : value;

export const stringifyLayerData = (
  layer:
    | Partial<BuilderLayer>
    | Partial<BuilderLayerJSON>
    | Partial<BuilderLayerPayload>
) => {
  if (!isBuilderLayerJSON(layer))
    return layer as Partial<BuilderLayer> | Partial<BuilderLayerPayload>;

  const newLayer: Partial<BuilderLayer> | Partial<BuilderLayerPayload> = {
    ...layer,
    layer_data: JSON.stringify(layer.layer_data, stringifyReplacer),
  };

  return newLayer;
};

export const stringifySchemeGuideData = (
  scheme?:
    | BuilderScheme
    | BuilderSchemeJSON
    | Partial<BuilderScheme | BuilderSchemeJSON>
) => {
  if (
    !scheme ||
    !isBuilderSchemeJSON(scheme as BuilderScheme | BuilderSchemeJSON)
  )
    return scheme;

  const newScheme: BuilderScheme | Partial<BuilderScheme> = {
    ...scheme,
    guide_data: JSON.stringify(scheme.guide_data, stringifyReplacer),
  };

  return newScheme;
};

export const addImageProcess = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

export const alphaToHex = (alpha: number) => {
  let s = Math.floor(alpha * 255).toString(16);
  if (s.length === 1) s = "0" + s;
  return s;
};

export const correctColor = (color: string) => {
  if (color.indexOf("#") === 0) return color;
  if (color.length === 6) return "#" + color;
  return null;
};

export const legacyBasePaintAssetURL = (basepaint: BuilderBase) =>
  `${config.assetsURL}/bases/${basepaint.id}/`;

export const basePaintAssetURL = (carMake?: CarMake | null, index?: number) =>
  `${config.assetsURL}/templates2048/${carMake?.folder_directory.replaceAll(
    " ",
    "_"
  )}/bases/${index}/`;

export const legacyCarMakeAssetURL = (carMake?: CarMake | null) =>
  `${config.assetsURL}/templates/${carMake?.folder_directory.replaceAll(
    " ",
    "_"
  )}/`;
export const carMakeAssetURL = (carMake?: CarMake | null) =>
  `${config.assetsURL}/templates2048/${carMake?.folder_directory.replaceAll(
    " ",
    "_"
  )}/`;

export const generateCarMakeImageURL = (
  layer_data: CarObjLayerData,
  carMake?: CarMake | null,
  legacyMode?: boolean | null
) =>
  layer_data.legacy
    ? `${
        config.legacyAssetURL
      }/templates/${carMake?.folder_directory.replaceAll(" ", "_")}/`
    : (legacyMode ? legacyCarMakeAssetURL(carMake) : carMakeAssetURL(carMake)) +
      layer_data.img;

export const generateLogoImageURL = (
  layer: BuilderLayerJSON<LogoObjLayerData>,
  carMake?: CarMake | null,
  legacyMode?: boolean | null
) =>
  layer.layer_data.fromCarParts
    ? generateCarMakeImageURL(
        layer.layer_data as CarObjLayerData,
        carMake,
        legacyMode
      )
    : layer.layer_data.legacy
    ? `${config.legacyAssetURL}/layers/layer_${layer.id}.png`
    : (layer.layer_data as UploadObjLayerData).fromOldSource
    ? `${config.legacyAssetURL}/${layer.layer_data.source_file}`
    : `${config.assetsURL}/${layer.layer_data.source_file}`;

export const uploadAssetURL = (uploadItem: BuilderUpload) =>
  uploadItem.legacy_mode
    ? `${config.legacyAssetURL}/${uploadItem.file_name}`
    : `${config.assetsURL}/${uploadItem.file_name}`;

export const getZoomedCenterPosition = (
  stageRef: RefObject<Stage | undefined>,
  frameSize: FrameSize,
  zoom: number,
  boardRotate = 0
) => {
  if (!stageRef.current) {
    return { x: 0, y: 0 };
  }
  const transform = stageRef.current.getTransform().m;
  const width = stageRef.current.attrs.width;
  const height = stageRef.current.attrs.height;
  const fitZoom = mathRound4(
    Math.min(width / frameSize.width, height / frameSize.height)
  );
  return rotatePoint(
    -transform[4] / zoom + (frameSize.width * fitZoom) / zoom / 2,
    -transform[5] / zoom + (frameSize.height * fitZoom) / zoom / 2,
    boardRotate
  );
};

export const rotatePoint = (x: number, y: number, angle: number) => {
  const radians = (Math.PI / 180) * angle,
    cos = Math.cos(radians),
    sin = Math.sin(radians),
    nx = cos * x + sin * y,
    ny = cos * y - sin * x;
  return { x: nx, y: ny };
};

export const getCenter = (shape: BoundBox, flop = 0, flip = 0) => ({
  x:
    shape.x +
    shape.width * (flop ? -0.5 : 0.5) * Math.cos(shape.rotation) +
    shape.height * (flip ? -0.5 : 0.5) * Math.sin(-shape.rotation),
  y:
    shape.y +
    shape.height * (flip ? -0.5 : 0.5) * Math.cos(shape.rotation) +
    shape.width * (flop ? -0.5 : 0.5) * Math.sin(shape.rotation),
});

export const rotateAroundPoint = (
  shape: BoundBox,
  deltaDeg: number,
  point: Position
) => {
  const x = Math.round(
    point.x +
      (shape.x - point.x) * Math.cos(deltaDeg) -
      (shape.y - point.y) * Math.sin(deltaDeg)
  );
  const y = Math.round(
    point.y +
      (shape.x - point.x) * Math.sin(deltaDeg) +
      (shape.y - point.y) * Math.cos(deltaDeg)
  );

  return {
    ...shape,
    rotation: shape.rotation + deltaDeg,
    x,
    y,
  };
};

export const rotateAroundCenter = (
  shape: BoundBox,
  deltaDeg: number,
  flop = 0,
  flip = 0
) => {
  const center = getCenter(shape, flop, flip);
  return rotateAroundPoint(shape, deltaDeg, center);
};

export const getSnapRotation = (rot: number) => {
  const rotation = rot < 0 ? 2 * Math.PI + rot : rot;
  const son = Math.PI / 12;
  return Math.round(rotation / son) * son;
};

export const getTwoRandomNumbers = (limit: number) => {
  const arr = [];
  while (arr.length < 2) {
    const r = Math.floor(Math.random() * limit);
    if (arr.indexOf(r) === -1) arr.push(r);
  }
  return arr;
};

export const reduceString = (text: string, limit: number) => {
  if (text.length <= limit) return text;
  return text.slice(0, limit) + "...";
};

export const getNameFromUploadFileName = (
  file_name: string,
  userID?: number
) => {
  const temp = file_name.substring(
    file_name.lastIndexOf("uploads/") + "uploads/".length,
    file_name.indexOf(".")
  );

  if (userID && temp.indexOf(userID.toString()) === 0)
    return temp.slice(userID.toString().length + 1);
  return temp;
};

export const dataURItoBlob = (dataURI: string, type = "image/png") => {
  const binary = atob(dataURI.split(",")[1]);
  const array = [];
  for (let i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i));
  }
  return new Blob([new Uint8Array(array)], { type });
};

export const getTGA = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
) => {
  const imageData = ctx.getImageData(0, 0, width, height);
  const tga = new TGA({
    width,
    height,
    imageType: TGA.Type.RGB,
  });
  tga.setImageData(imageData);
  return tga;
};

export const getTGADataURL = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
) => {
  const tga = getTGA(ctx, width, height);
  return tga.getDataURL("image/x-tga");
};

export const getTGABlob = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
) => {
  const tga = getTGA(ctx, width, height);
  return new Blob(tga.arrayBuffer ? [tga.arrayBuffer] : [], {
    type: "image/x-tga",
  });
};

export const getTGABlobURL = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
) => {
  // get a blob url which can be used to download the file
  const tga = getTGA(ctx, width, height);
  const url = tga.getBlobURL();

  return url;
};

export const downloadTGA = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  fileName: string
) => {
  // get a blob url which can be used to download the file
  const url = getTGABlobURL(ctx, width, height);

  const a = document.createElement("a");
  a.setAttribute("style", "display: none;");
  a.href = url;
  a.download = fileName;
  a.click();
  window.URL.revokeObjectURL(url);
};

export const focusBoard = () => {
  setTimeout(() => (document.activeElement as HTMLElement)?.blur(), 500);
};

export const focusBoardQuickly = () => {
  setTimeout(() => (document.activeElement as HTMLElement)?.blur(), 10);
};

export const isCenterBasedShape = (type: MouseModes) =>
  [
    MouseModes.CIRCLE,
    MouseModes.STAR,
    MouseModes.RING,
    MouseModes.REGULARPOLYGON,
    MouseModes.WEDGE,
    MouseModes.ARC,
  ].includes(type);

export const fitPoints = (points: number[]) => {
  const leftTopOffset: Position = {
    x: 0,
    y: 0,
  };
  for (const index in points) {
    if (+index % 2 === 0 && leftTopOffset.x > points[index]) {
      leftTopOffset.x = points[index];
    }
    if (+index % 2 === 1 && leftTopOffset.y > points[index]) {
      leftTopOffset.y = points[index];
    }
  }

  const newPoints = points.map((value, index) =>
    index % 2 === 0 ? value - leftTopOffset.x : value - leftTopOffset.y
  );

  return { leftTopOffset, newPoints };
};

export const getPointsBoxSize = (points: number[]) => {
  const leftTop: Position = {
    x: points[0],
    y: points[1],
  };
  const rightBottom: Position = {
    x: points[0],
    y: points[1],
  };
  for (const index in points) {
    if (+index % 2 === 0) {
      if (leftTop.x > points[index]) {
        leftTop.x = points[index];
      }
      if (rightBottom.x < points[index]) {
        rightBottom.x = points[index];
      }
    }
    if (+index % 2 === 1) {
      if (leftTop.y > points[index]) {
        leftTop.y = points[index];
      }
      if (rightBottom.y < points[index]) {
        rightBottom.y = points[index];
      }
    }
  }

  return {
    width: rightBottom.x - leftTop.x,
    height: rightBottom.y - leftTop.y,
  };
};

export const getPixelRatio = (node: Node, image: HTMLImageElement) => {
  if (image) {
    if (image.width && image.height)
      return Math.max(
        1,
        image.width / node.width(),
        image.height / node.height()
      );
    return 5;
  }
  return 1;
};

export const loadImage = async (
  imageSource: string,
  imageRef: MutableRefObject<HTMLImageElement | undefined>,
  handleLoad?: () => void,
  handleError?: (error?: ErrorEvent) => void
) => {
  const img = new window.Image();
  img.src = imageSource;
  img.crossOrigin = "anonymous";
  imageRef.current = img;
  if (handleLoad) imageRef.current.addEventListener("load", handleLoad);
  if (handleError) imageRef.current.addEventListener("error", handleError);
};

export const isInSameSideBar = (type1: LayerTypes, type2: LayerTypes) => {
  if (
    [LayerTypes.LOGO, LayerTypes.TEXT, LayerTypes.UPLOAD].includes(type1) &&
    [LayerTypes.LOGO, LayerTypes.TEXT, LayerTypes.UPLOAD].includes(type2)
  )
    return true;
  if (type1 === type2) return true;
  return false;
};

export const getUserName = (user?: UserWithoutPassword | null) => {
  if (!user) {
    return "";
  }

  if (user.shorten_name) {
    return shortenName(user.drivername);
  }
  return user.drivername;
};

export const shortenName = (fullName: string) => {
  const fullNameSplitted = fullName.split(" ");
  const firstPart = fullNameSplitted.shift();
  const secondPart = fullNameSplitted.pop();
  const shorten =
    firstPart +
    (secondPart ? " " + secondPart.charAt(0).toUpperCase() + "." : "");
  return shorten;
};

export const setScrollPostion = (path: string, position: number) => {
  localStorage.setItem(
    "scrollPosition",
    JSON.stringify({
      path,
      position,
    })
  );
};

export const clearScrollPosition = () => {
  localStorage.removeItem("scrollPosition");
};

export const scrollBackOnProjectList = () => {
  const scrollPositionObjText = localStorage.getItem("scrollPosition");
  if (scrollPositionObjText) {
    const scrollPositionObj = JSON.parse(
      scrollPositionObjText
    ) as ScrollPosition;
    if (
      scrollPositionObj &&
      scrollPositionObj.path === window.location.pathname
    ) {
      const schemeListContent = document.getElementById("scheme-list-content");

      if (schemeListContent) {
        schemeListContent.scrollTop = scrollPositionObj.position;

        if (schemeListContent.scrollTop !== scrollPositionObj.position) {
          setTimeout(
            () => (schemeListContent.scrollTop = scrollPositionObj.position),
            500
          );
        }
      }
    }
  }
};

export const scrollTopOnProjectList = () => {
  const schemeListContent = document.getElementById("scheme-list-content");
  if (schemeListContent) {
    schemeListContent.scrollTop = 0;

    if (schemeListContent.scrollTop !== 0) {
      setTimeout(() => (schemeListContent.scrollTop = 0), 500);
    }
  }
};

export const sleep = (milliseconds: number) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

export const isWindows = () => window.navigator.userAgent.includes("Win");

export const getDistance = (p1: Position, p2: Position) =>
  Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));

export const getCenterOfPoints = (p1: Position, p2: Position) => ({
  x: (p1.x + p2.x) / 2,
  y: (p1.y + p2.y) / 2,
});

export const detectBrowser = () => {
  const userAgent = navigator.userAgent;
  let browserName;

  if (userAgent.match(/chrome|chromium|crios/i)) {
    browserName = Browser.CHROME;
  } else if (userAgent.match(/firefox|fxios/i)) {
    browserName = Browser.FIREFOX;
  } else if (userAgent.match(/safari/i)) {
    browserName = Browser.SAFARI;
  } else if (userAgent.match(/opr\//i)) {
    browserName = Browser.OPERA;
  } else if (userAgent.match(/edg/i)) {
    browserName = Browser.EDGE;
  }

  return browserName;
};

export const enhanceFontFamily = (fontName?: string) =>
  !fontName
    ? undefined
    : detectBrowser() !== Browser.FIREFOX
    ? fontName
    : `"${fontName}"`;

export const modifyFileName = (file: File, userID?: number) => {
  let newName = file.name;
  const lastDotPosition = file.name.lastIndexOf(".");
  const prefix = userID ? userID + "_" : "";
  newName =
    prefix +
    file.name.slice(0, lastDotPosition) +
    "." +
    uuidv4() +
    file.name.slice(lastDotPosition);

  return newName;
};

export const getAllowedLayerTypes = (
  values?: BuilderLayerJSON | BuilderLayerJSONParitalAll | null
) =>
  !values?.layer_type
    ? []
    : values.layer_type !== LayerTypes.SHAPE
    ? (AllowedLayerProps[values.layer_type as LayerTypes] as string[])
    : AllowedLayerProps[LayerTypes.SHAPE][
        (values.layer_data as ShapeObjLayerData)
          .type as keyof typeof AllowedLayerProps[LayerTypes.SHAPE]
      ];

export const decodeHtml = (str?: string) => {
  const txt = new DOMParser().parseFromString(str ?? "", "text/html");

  return txt.documentElement.textContent ?? "";
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const stopPropagation = (event: any) => {
  event?.stopPropagation();
  event?.nativeEvent?.stopImmediatePropagation();
};

export const positiveNumGuard = (num?: string | number | typeof NaN) =>
  Number.isNaN(Number(num)) || num === undefined || num === null
    ? 0
    : Math.abs(Number(num));

export const numberGuard = (num?: string | number | typeof NaN) =>
  Number.isNaN(Number(num)) || num === undefined || num === null
    ? 0
    : Number(num);

import { Canvg } from "canvg";
import { Node } from "konva/types/Node";
import {
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { TemplateVariables } from "src/constant";
import {
  detectBrowser,
  getPixelRatio,
  loadImage,
  mathRound2,
  rotatePoint,
} from "src/helper";
import {
  getViewBoxSizeFromSVG,
  parseSVG,
  replaceColors,
  svgToString,
  svgToURL,
  urlToString,
} from "src/helper/svg";
import { RootState } from "src/redux";
import { setMessage } from "src/redux/reducers/messageReducer";
import {
  FrameSize,
  LogoObjLayerData,
  MovableObjLayerData,
  PartialAllLayerData,
} from "src/types/common";
import { Browser } from "src/types/enum";
import { BuilderLayerJSON } from "src/types/query";

const clearCache = (node: Node) => {
  const canvasCache = node._cache.get("canvas");
  if (canvasCache) {
    canvasCache.scene._canvas.width = 0;
    canvasCache.scene._canvas.height = 0;
    canvasCache.hit._canvas.width = 0;
    canvasCache.hit._canvas.height = 0;
    canvasCache.filter._canvas.width = 0;
    canvasCache.filter._canvas.height = 0;
  }
  node.clearCache();
};

interface UseKonvaImageInit {
  imageshapeRef: RefObject<Node>;
  id: string | number;
  src: string;
  layer?: BuilderLayerJSON<MovableObjLayerData>;
  stroke?: string;
  strokeWidth?: number;
  filterColor?: string;
  shadowColor?: string;
  shadowBlur?: number;
  shadowOpacity?: number;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
  strokeScale?: number;
  allowFit?: boolean;
  frameSize?: FrameSize;
  loadedStatus: boolean;
  boardRotate: number;
  width?: number;
  height?: number;
  x: number;
  y: number;
  onChange?: (data: PartialAllLayerData, pushingToHistory?: boolean) => void;
  tellSize?: (size: FrameSize) => void;
  onLoadLayer?: (id: string | number, flag: boolean) => void;
}

export const useKonvaImageInit = ({
  imageshapeRef,
  id,
  src,
  layer,
  stroke,
  strokeWidth,
  filterColor,
  shadowBlur,
  shadowColor,
  shadowOffsetX,
  shadowOffsetY,
  shadowOpacity,
  strokeScale,
  allowFit,
  frameSize,
  loadedStatus,
  boardRotate = 0,
  width,
  height,
  x,
  y,
  onChange,
  tellSize,
  onLoadLayer,
}: UseKonvaImageInit) => {
  const dispatch = useDispatch();
  const [image, setImage] = useState<CanvasImageSource>();
  const imageRef = useRef<HTMLImageElement>();
  const svgDocRef = useRef<Document>();
  const isSVG = useMemo(() => src.toLowerCase().includes(".svg"), [src]);
  const isAboveMobile = useSelector(
    (state: RootState) => state.boardReducer.isAboveMobile
  );

  const applyCaching = useCallback(() => {
    if (
      imageshapeRef &&
      imageshapeRef.current &&
      imageRef &&
      imageRef.current
    ) {
      clearCache(imageshapeRef.current);
      if (filterColor || isAboveMobile) {
        const pixelRatio = getPixelRatio(
          imageshapeRef.current,
          imageRef.current
        );
        imageshapeRef.current.cache({
          pixelRatio: isAboveMobile
            ? pixelRatio
            : Math.min(pixelRatio * 0.3, 0.3),
          imageSmoothingEnabled: true,
        });
      }
    }
  }, [imageshapeRef, imageRef, isAboveMobile, filterColor]);

  useEffect(() => {
    if (loadedStatus !== false && loadedStatus !== true && onLoadLayer && id)
      onLoadLayer?.(id, false);
    if (isSVG) {
      setImgFromSVG(src);
    } else {
      loadImage(
        // src + `?timestamp=${new Date().toISOString()}`,
        src,
        imageRef,
        handleLoad,
        handleError
      );
    }

    return () => {
      if (imageRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        imageRef.current.removeEventListener("load", handleLoad);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (image && isSVG) {
      setImgFromSVG(src).then(() => applyCaching());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stroke, strokeWidth, filterColor]);

  useEffect(() => {
    if (image) {
      applyCaching();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    shadowBlur,
    shadowColor,
    shadowOffsetX,
    shadowOffsetY,
    shadowOpacity,
    width,
    height,
  ]);

  const getFitSize = useCallback(
    (originSize: { width?: number; height?: number }) => {
      if (!originSize.width || !originSize.height) return undefined;

      if (
        !allowFit ||
        (originSize.width <= (frameSize?.width ?? 0) / 2 &&
          originSize.height <= (frameSize?.height ?? 0) / 2)
      ) {
        return originSize;
      }

      const ratio = originSize.height / originSize.width;
      const targetWidth = (frameSize?.width ?? 0) / 2;
      const targetHeight = targetWidth * ratio;

      return {
        width: targetWidth,
        height: targetHeight,
      };
    },
    [allowFit, frameSize]
  );

  const handleLoad = useCallback(async () => {
    if (!imageRef.current) return;

    const originSize = getFitSize({
      width: imageRef.current.width,
      height: imageRef.current.height,
    });

    const targetSize = {
      width: width || originSize?.width,
      height: height || originSize?.height,
    };

    if (isSVG && detectBrowser() === Browser.FIREFOX) {
      if (svgDocRef.current && !targetSize.width && !targetSize.height) {
        const viewBoxSize = getViewBoxSizeFromSVG(svgDocRef.current);

        if (viewBoxSize) {
          const adjustedSize = getFitSize({
            width: viewBoxSize.width,
            height: viewBoxSize.height,
          });

          if (adjustedSize) {
            targetSize.width = adjustedSize.width;
            targetSize.height = adjustedSize.height;
          }
        }
      }

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (ctx) {
        const v = await Canvg.from(ctx, imageRef.current.src, {
          enableRedraw: true,
        });
        await v.render();
        setImage(canvas);
      }
    } else {
      setImage(imageRef.current);
    }

    if (
      onChange &&
      !width &&
      !height &&
      targetSize.width &&
      targetSize.height
    ) {
      const offset = rotatePoint(
        targetSize.width,
        targetSize.height,
        boardRotate
      );
      onChange(
        {
          left: mathRound2(x - offset.x / 2),
          top: mathRound2(y - offset.y / 2),
          width: mathRound2(targetSize.width),
          height: mathRound2(targetSize.height),
        },
        false
      );
    }

    applyCaching();

    tellSize?.({
      width: targetSize.width ?? 0,
      height: targetSize.height ?? 0,
    });

    if (id) onLoadLayer?.(id, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    imageRef,
    svgDocRef,
    frameSize,
    allowFit,
    width,
    height,
    x,
    y,
    tellSize,
    onChange,
    setImage,
    applyCaching,
  ]);

  const handleError = useCallback(
    (_error) => {
      if (
        (layer?.layer_data as LogoObjLayerData).img !==
        TemplateVariables.PROFILE_AVATAR
      ) {
        // If the image is not an avatar image, show an error message
        // Because some users haven't uploaded their avatar, so we don't want to show avtar image on the board.
        dispatch(
          setMessage({
            message: `Failed to load image: ${layer?.layer_data?.name ?? id}`,
          })
        );
      }

      if (id) onLoadLayer?.(id, true);
    },
    [onLoadLayer, id, layer, dispatch]
  );

  const setImgFromSVG = useCallback(
    async (src) => {
      try {
        let svgString = await urlToString(
          // src + `?timestamp=${new Date().toISOString()}`
          src
        );
        if (filterColor || stroke) {
          svgString = replaceColors(svgString, {
            color: filterColor,
            stroke,
            strokeWidth: (strokeWidth ?? 0) * (strokeScale ?? 0),
          });
        }

        const svgDoc = parseSVG(svgString);
        const svgElement = svgDoc.querySelector("svg");

        if (svgElement) {
          const viewBoxValue = svgElement.getAttribute("viewBox");
          if (viewBoxValue) {
            const [, , viewBoxWidth, viewBoxHeight] = viewBoxValue.split(" ");
            if (viewBoxWidth) svgElement.setAttribute("width", viewBoxWidth);
            if (viewBoxHeight) svgElement.setAttribute("height", viewBoxHeight);
          }
        }

        svgDocRef.current = svgDoc;
        const updatedSvgString = svgToString(svgDoc);

        loadImage(
          svgToURL(updatedSvgString),
          imageRef,
          handleLoad,
          handleError
        );
      } catch (error) {
        console.log("Failed to fetch image: ", error);
      }
    },
    [
      filterColor,
      imageRef,
      handleLoad,
      handleError,
      stroke,
      strokeWidth,
      strokeScale,
    ]
  );

  return { image, imageRef, applyCaching };
};

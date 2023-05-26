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
import { useSelector } from "react-redux";
import {
  detectBrowser,
  getPixelRatio,
  loadImage,
  mathRound2,
  rotatePoint,
} from "src/helper";
import { replaceColors, svgToURL, urlToString } from "src/helper/svg";
import { RootState } from "src/redux";
import { FrameSize, PartialAllLayerData } from "src/types/common";
import { Browser } from "src/types/enum";

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
  width: number;
  height: number;
  x: number;
  y: number;
  onChange?: (data: PartialAllLayerData, pushingToHistory?: boolean) => void;
  tellSize?: (size: FrameSize) => void;
  onLoadLayer: (id: string | number, flag: boolean) => void;
}

export const useKonvaImageInit = ({
  imageshapeRef,
  id,
  src,
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
  const [image, setImage] = useState<CanvasImageSource>();
  const imageRef = useRef<HTMLImageElement>();
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
      onLoadLayer(id, false);
    if (isSVG) {
      setImgFromSVG(src);
    } else {
      loadImage(
        src + `?timestamp=${new Date().toISOString()}`,
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

  const handleLoad = useCallback(async () => {
    if (!imageRef.current) return;

    const originWidth =
      !allowFit ||
      (imageRef.current.width <= (frameSize?.width ?? 0) / 2 &&
        imageRef.current.height <= (frameSize?.height ?? 0) / 2)
        ? imageRef.current.width
        : (frameSize?.width ?? 0) / 2;
    const originHeight =
      !allowFit ||
      (imageRef.current.width <= (frameSize?.width ?? 0) / 2 &&
        imageRef.current.height <= (frameSize?.height ?? 0) / 2)
        ? imageRef.current.height
        : (((frameSize?.width ?? 0) / 2) * imageRef.current.height) /
          imageRef.current.width;
    const targetWidth = width || originWidth || 200;
    const targetHeight = height || originHeight || 200;

    if (isSVG && detectBrowser() === Browser.FIREFOX) {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (ctx) {
        const v = await Canvg.from(ctx, imageRef.current.src, {
          enableRedraw: true,
        });
        v.resize(targetWidth * 2, targetHeight * 2, "xMidYMid meet");
        await v.render();
        setImage(canvas);
      }
    } else {
      setImage(imageRef.current);
    }

    if (onChange && !width && !height && targetWidth && targetHeight) {
      const offset = rotatePoint(targetWidth, targetHeight, boardRotate);
      onChange(
        {
          left: mathRound2(x - offset.x / 2),
          top: mathRound2(y - offset.y / 2),
          width: mathRound2(targetWidth),
          height: mathRound2(targetHeight),
        },
        false
      );
    }

    applyCaching();

    tellSize?.({
      width: targetWidth,
      height: targetHeight,
    });

    if (onLoadLayer && id) onLoadLayer(id, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
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
    (error) => {
      console.log("Failed to fetch image: ", error);
      if (onLoadLayer && id) onLoadLayer(id, true);
    },
    [onLoadLayer, id]
  );

  const setImgFromSVG = useCallback(
    async (src) => {
      try {
        let svgString = await urlToString(
          src + `?timestamp=${new Date().toISOString()}`
        );
        if (filterColor || stroke) {
          svgString = replaceColors(svgString, {
            color: filterColor,
            stroke,
            strokeWidth: (strokeWidth ?? 0) * (strokeScale ?? 0),
          });
        }

        loadImage(svgToURL(svgString), imageRef, handleLoad, handleError);
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

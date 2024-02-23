import Color from "color";
import Konva from "konva";
import { KonvaEventObject } from "konva/types/Node";
import { Stage } from "konva/types/Stage";
import React, { useMemo, useRef } from "react";
import { Image } from "react-konva";
import { useDispatch } from "react-redux";
import { colorValidator } from "src/helper";
import { useDrag, useKonvaImageInit, useTransform } from "src/hooks";
import { setMessage } from "src/redux/reducers/messageReducer";
import {
  DefaultLayerData,
  FrameSize,
  GuideData,
  MovableObjLayerData,
  PartialAllLayerData,
} from "src/types/common";
import { PaintingGuides } from "src/types/enum";
import { BuilderLayerJSON } from "src/types/query";

type URLImageProps = Omit<Konva.NodeConfig, "id"> & {
  id: string | number;
  src: string;
  stageRef?: React.MutableRefObject<Stage | null>;
  x: number;
  y: number;
  width: number;
  height: number;
  boardRotate?: number;
  filterColor?: string;
  frameSize?: FrameSize;
  allowFit?: boolean;
  layer?: BuilderLayerJSON<MovableObjLayerData>;
  cloningLayer?: BuilderLayerJSON<MovableObjLayerData>;
  loadedStatus: boolean;
  onLoadLayer?: (id: string | number, flag: boolean) => void;
  tellSize: (size: FrameSize) => void;
  stroke?: string;
  strokeWidth?: number;
  strokeScale?: number;
  shadowBlur?: number;
  shadowColor?: string;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
  paintingGuides?: PaintingGuides[];
  guideData?: GuideData;
  onSelect?: () => void;
  onDblClick?: (evt: KonvaEventObject<MouseEvent>) => void;
  onChange?: (data: PartialAllLayerData, pushingToHistory?: boolean) => void;
  onHover?: (hovered: boolean) => void;
  onDragStart?: (layer?: BuilderLayerJSON) => void;
  onDragEnd?: () => void;
  onCloneMove?: (
    layer: BuilderLayerJSON<DefaultLayerData & PartialAllLayerData>
  ) => void;
};

export const URLImage = React.memo(
  ({
    id,
    src,
    stageRef,
    filterColor,
    frameSize,
    allowFit,
    layer,
    cloningLayer,
    loadedStatus,
    boardRotate = 0,
    onLoadLayer,
    tellSize,
    stroke,
    strokeWidth,
    strokeScale,
    shadowBlur,
    shadowColor,
    shadowOffsetX,
    shadowOffsetY,
    paintingGuides,
    guideData,
    onSelect,
    onDblClick,
    onChange,
    onHover,
    onDragStart,
    onDragEnd,
    onCloneMove,
    ...props
  }: URLImageProps) => {
    const dispatch = useDispatch();
    const shapeRef = useRef<Konva.Image>(null);

    const isSVG = useMemo(() => src.toLowerCase().includes(".svg"), [src]);
    const allowFilter = useMemo(
      () => !isSVG && filterColor && filterColor.length,
      [filterColor, isSVG]
    );
    const filters = useMemo(() => (allowFilter ? [Konva.Filters.RGBA] : []), [
      allowFilter,
    ]);

    const { image, applyCaching } = useKonvaImageInit({
      imageshapeRef: shapeRef,
      id,
      src,
      stroke,
      strokeWidth,
      filterColor,
      shadowBlur,
      shadowColor,
      shadowOffsetX,
      shadowOffsetY,
      strokeScale,
      allowFit,
      frameSize,
      loadedStatus,
      boardRotate,
      width: props.width,
      height: props.height,
      x: props.x,
      y: props.y,
      onChange,
      tellSize,
      onLoadLayer,
    });

    const {
      dragEnabled,
      handleDragStart,
      handleDragMove,
      handleDragEnd,
      handleTouchMove,
      handleTouchEnd,
    } = useDrag({
      stageRef,
      shapeRef,
      paintingGuides,
      guideData,
      frameSize,
      layer,
      cloningLayer,
      onSelect,
      onChange,
      onDragStart,
      onDragEnd,
      onCloneMove,
    });
    const {
      handleTransformStart,
      handleTransformEnd,
      handleTransform,
    } = useTransform({
      shapeRef,
      layer,
      onChange,
      onDragStart,
      onDragEnd,
      applyCaching,
    });

    const filterColorRGB = useMemo(() => {
      try {
        return filterColor ? Color(filterColor) : undefined;
      } catch (error) {
        dispatch(setMessage({ message: `Invalid Color: ${filterColor}` }));
        return null;
      }
    }, [dispatch, filterColor]);

    const validatedShadowColor = useMemo(() => {
      if (colorValidator(shadowColor)) {
        return shadowColor;
      }
      dispatch(setMessage({ message: `Invalid Color: ${shadowColor}` }));
      return undefined;
    }, [dispatch, shadowColor]);

    return (
      <Image
        {...props}
        id={id?.toString()}
        image={image}
        ref={shapeRef}
        draggable={!!onChange && dragEnabled}
        shadowBlur={shadowBlur}
        shadowColor={validatedShadowColor}
        shadowOffsetX={shadowOffsetX || 0}
        shadowOffsetY={shadowOffsetY || 0}
        red={allowFilter ? filterColorRGB?.red() : null}
        green={allowFilter ? filterColorRGB?.green() : null}
        blue={allowFilter ? filterColorRGB?.blue() : null}
        alpha={allowFilter ? filterColorRGB?.alpha() : null}
        filters={allowFilter ? filters : undefined}
        perfectDrawEnabled={false}
        shadowForStrokeEnabled={false}
        onDblClick={onDblClick}
        onClick={onSelect}
        onTap={onSelect}
        onMouseOver={() => props.listening && onHover?.(true)}
        onMouseOut={() => props.listening && onHover?.(false)}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragMove={handleDragMove}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTransformStart={handleTransformStart}
        onTransformEnd={handleTransformEnd}
        onTransform={handleTransform}
      />
    );
  }
);

export default URLImage;

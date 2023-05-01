import Konva from "konva";
import { KonvaEventObject } from "konva/types/Node";
import { Stage } from "konva/types/Stage";
import React, { useMemo, useRef } from "react";
import { Group, Image, Rect } from "react-konva";
import { hexToRgba } from "src/helper";
import { useDrag, useKonvaImageInit, useTransform } from "src/hooks";
import {
  DefaultLayerData,
  FrameSize,
  GuideData,
  LogoObjLayerData,
  MovableObjLayerData,
  OverlayObjLayerData,
  PartialAllLayerData,
} from "src/types/common";
import { PaintingGuides } from "src/types/enum";
import { BuilderLayerJSON } from "src/types/query";

type GroupedURLImageProps = Omit<Konva.NodeConfig, "id"> & {
  id: string | number;
  src: string;
  editable: boolean;
  stageRef: React.MutableRefObject<Stage | null>;
  bgColor?: string | null;
  paddingX?: number;
  paddingY?: number;
  x: number;
  y: number;
  width: number;
  height: number;
  boardRotate: number;
  filterColor: string;
  frameSize: FrameSize;
  allowFit: boolean;
  layer: BuilderLayerJSON<LogoObjLayerData | OverlayObjLayerData>;
  cloningLayer: BuilderLayerJSON<LogoObjLayerData | OverlayObjLayerData>;
  loadedStatus: boolean;
  onLoadLayer: (id: string | number, flag: boolean) => void;
  tellSize?: (size: FrameSize) => void;
  stroke?: string;
  strokeWidth?: number;
  strokeScale?: number;
  shadowBlur: number;
  shadowColor?: string;
  shadowOffsetX: number;
  shadowOffsetY: number;
  shadowOpacity: number;
  paintingGuides: PaintingGuides[];
  guideData?: GuideData | null;
  onSelect: () => void;
  onDblClick: (evt: KonvaEventObject<MouseEvent>) => void;
  onChange: (data: PartialAllLayerData, pushingToHistory?: boolean) => void;
  onHover: (hovered: boolean) => void;
  onDragStart: (layer?: BuilderLayerJSON<MovableObjLayerData>) => void;
  onDragEnd: () => void;
  onCloneMove: (
    layer: BuilderLayerJSON<DefaultLayerData & PartialAllLayerData>
  ) => void;
  onSetTransformingLayer?: (
    layer: BuilderLayerJSON<MovableObjLayerData> | null
  ) => void;
};

export const GroupedURLImage = React.memo(
  ({
    id,
    src,
    editable,
    stageRef,
    bgColor = null,
    paddingX = 0,
    paddingY = 0,
    boardRotate = 0,
    filterColor,
    frameSize,
    allowFit,
    layer,
    cloningLayer,
    loadedStatus,
    onLoadLayer,
    tellSize,
    stroke,
    strokeWidth,
    strokeScale,
    shadowBlur,
    shadowColor,
    shadowOffsetX,
    shadowOffsetY,
    shadowOpacity,
    paintingGuides,
    guideData,
    onSelect,
    onDblClick,
    onChange,
    onHover,
    onDragStart,
    onDragEnd,
    onCloneMove,
    onSetTransformingLayer,
    ...props
  }: GroupedURLImageProps) => {
    const shapeRef = useRef<Konva.Group>(null);
    const imageshapeRef = useRef<Konva.Image>(null);

    const isSVG = useMemo(() => src.toLowerCase().includes(".svg"), [src]);
    const allowFilter = useMemo(
      () => !isSVG && filterColor && filterColor.length,
      [filterColor, isSVG]
    );
    const filters = useMemo(() => (allowFilter ? [Konva.Filters.RGBA] : []), [
      allowFilter,
    ]);

    const { image, applyCaching } = useKonvaImageInit({
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
      onSetTransformingLayer,
    });
    const {
      handleTransformStart,
      handleTransformEnd,
      handleTransform,
    } = useTransform({
      shapeRef,
      layer,
      imageshapeRef,
      onChange,
      onDragStart,
      onDragEnd,
      onSetTransformingLayer,
      applyCaching,
    });

    const filterColorRGB = hexToRgba(filterColor);

    return (
      <Group
        {...props}
        ref={shapeRef}
        onClick={onSelect}
        onDblClick={onDblClick}
        onTap={onSelect}
        draggable={!!onChange && editable && dragEnabled}
        onDragStart={handleDragStart}
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTransformStart={handleTransformStart}
        onTransformEnd={handleTransformEnd}
        onTransform={handleTransform}
        onMouseOver={() => props.listening && onHover?.(true)}
        onMouseOut={() => props.listening && onHover?.(false)}
      >
        {bgColor ? (
          <Rect
            x={-paddingX || 0}
            y={-paddingY || 0}
            width={props.width + 2 * (paddingX || 0)}
            height={props.height + 2 * (paddingY || 0)}
            fill={bgColor}
          />
        ) : (
          <></>
        )}

        <Image
          x={0}
          y={0}
          width={props.width}
          height={props.height}
          shadowBlur={shadowBlur}
          shadowColor={shadowColor}
          shadowOpacity={shadowOpacity}
          shadowOffsetX={shadowOffsetX || 0}
          shadowOffsetY={shadowOffsetY || 0}
          red={allowFilter ? filterColorRGB?.r : null}
          green={allowFilter ? filterColorRGB?.g : null}
          blue={allowFilter ? filterColorRGB?.b : null}
          alpha={
            allowFilter && filterColorRGB?.a ? filterColorRGB.a / 255 : null
          }
          filters={allowFilter ? filters : undefined}
          image={image}
          ref={imageshapeRef}
          perfectDrawEnabled={false}
          shadowForStrokeEnabled={false}
        />
      </Group>
    );
  }
);

export default GroupedURLImage;

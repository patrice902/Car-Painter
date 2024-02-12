import Konva from "konva";
import { KonvaEventObject } from "konva/types/Node";
import { Stage } from "konva/types/Stage";
import React, { RefObject, useEffect, useRef } from "react";
import {
  Arc,
  Arrow,
  Circle,
  Ellipse,
  Line,
  Rect,
  RegularPolygon,
  Ring,
  Star,
  Wedge,
} from "react-konva";
import { useDrag, useTransform } from "src/hooks";
import {
  DefaultLayerData,
  FrameSize,
  GuideData,
  MovableObjLayerData,
  PartialAllLayerData,
  ShapeBaseObjLayerData,
} from "src/types/common";
import { MouseModes, PaintingGuides } from "src/types/enum";
import { BuilderLayerJSON } from "src/types/query";

type ShapeProps = {
  id?: string | number;
  stageRef?: React.MutableRefObject<Stage | null>;
  x: number;
  y: number;
  width: number;
  height: number;
  frameSize?: FrameSize;
  layer: BuilderLayerJSON<ShapeBaseObjLayerData>;
  cloningLayer: BuilderLayerJSON<ShapeBaseObjLayerData>;
  onLoadLayer?: (id: string | number, flag: boolean) => void;
  stroke?: string;
  strokeWidth: number;
  shadowBlur?: number;
  shadowColor?: string;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
  paintingGuides: PaintingGuides[];
  guideData?: GuideData | null;
  onSelect?: () => void;
  onDblClick?: (evt: KonvaEventObject<MouseEvent>) => void;
  onChange?: (data: PartialAllLayerData, pushingToHistory?: boolean) => void;
  onHover?: (hovered: boolean) => void;
  onDragStart?: (layer?: BuilderLayerJSON<MovableObjLayerData>) => void;
  onDragEnd?: () => void;
  onCloneMove?: (
    layer: BuilderLayerJSON<DefaultLayerData & PartialAllLayerData>
  ) => void;
} & Omit<Konva.NodeConfig, "id">;

export const Shape = React.memo(
  ({
    id,
    type,
    editable,
    stageRef,
    frameSize,
    x,
    y,
    width,
    height,
    radius,
    points,
    lineCap,
    lineJoin,
    offsetsFromStroke,
    pointerLength,
    pointerWidth,
    innerRadius,
    outerRadius,
    cornerRadius,
    numPoints,
    angle,
    shadowColor,
    shadowBlur,
    shadowOpacity,
    shadowOffsetX,
    shadowOffsetY,
    layer,
    cloningLayer,
    paintingGuides,
    guideData,
    onSelect,
    onDblClick,
    onChange,
    onHover,
    onDragStart,
    onDragEnd,
    onLoadLayer,
    onCloneMove,
    onSetTransformingLayer,
    ...props
  }: ShapeProps) => {
    const shapeRef = useRef<Konva.Shape>(null);

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
      offsetsFromStroke,
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
      offsetsFromStroke,
      layer,
      onChange,
      onDragStart,
      onDragEnd,
      onSetTransformingLayer,
    });

    useEffect(() => {
      if (id) onLoadLayer?.(id, true);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <>
        {type === MouseModes.RECT ? (
          <Rect
            {...props}
            id={id?.toString()}
            ref={shapeRef as RefObject<Konva.Rect>}
            shadowColor={shapeRef.current ? shadowColor : undefined}
            shadowBlur={shapeRef.current ? shadowBlur : undefined}
            shadowOpacity={shapeRef.current ? shadowOpacity : undefined}
            shadowOffsetX={shapeRef.current ? shadowOffsetX : undefined}
            shadowOffsetY={shapeRef.current ? shadowOffsetY : undefined}
            cornerRadius={cornerRadius}
            x={x}
            y={y}
            width={width}
            height={height}
            draggable={!!onChange && editable && dragEnabled}
            onClick={onSelect}
            onTap={onSelect}
            onDblClick={onDblClick}
            onDragStart={handleDragStart}
            onDragMove={handleDragMove}
            onDragEnd={handleDragEnd}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onTransformStart={handleTransformStart}
            onTransformEnd={handleTransformEnd}
            onTransform={handleTransform}
            shadowForStrokeEnabled={false}
            onMouseOver={() => props.listening && onHover && onHover(true)}
            onMouseOut={() => props.listening && onHover && onHover(false)}
          />
        ) : type === MouseModes.CIRCLE ? (
          <Circle
            {...props}
            id={id?.toString()}
            ref={shapeRef as RefObject<Konva.Circle>}
            x={x}
            y={y}
            radius={radius}
            shadowColor={shapeRef.current ? shadowColor : undefined}
            shadowBlur={shapeRef.current ? shadowBlur : undefined}
            shadowOpacity={shapeRef.current ? shadowOpacity : undefined}
            shadowOffsetX={shapeRef.current ? shadowOffsetX : undefined}
            shadowOffsetY={shapeRef.current ? shadowOffsetY : undefined}
            draggable={!!onChange && editable && dragEnabled}
            onClick={onSelect}
            onTap={onSelect}
            onDblClick={onDblClick}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onDragMove={handleDragMove}
            onTransformStart={handleTransformStart}
            onTransformEnd={handleTransformEnd}
            onTransform={handleTransform}
            shadowForStrokeEnabled={false}
            onMouseOver={() => props.listening && onHover && onHover(true)}
            onMouseOut={() => props.listening && onHover && onHover(false)}
          />
        ) : type === MouseModes.ELLIPSE ? (
          <Ellipse
            {...props}
            id={id?.toString()}
            ref={shapeRef as RefObject<Konva.Ellipse>}
            x={x}
            y={y}
            radiusX={width}
            radiusY={height}
            shadowColor={shapeRef.current ? shadowColor : undefined}
            shadowBlur={shapeRef.current ? shadowBlur : undefined}
            shadowOpacity={shapeRef.current ? shadowOpacity : undefined}
            shadowOffsetX={shapeRef.current ? shadowOffsetX : undefined}
            shadowOffsetY={shapeRef.current ? shadowOffsetY : undefined}
            draggable={!!onChange && editable && dragEnabled}
            onClick={onSelect}
            onTap={onSelect}
            onDblClick={onDblClick}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onDragMove={handleDragMove}
            onTransformStart={handleTransformStart}
            onTransformEnd={handleTransformEnd}
            onTransform={handleTransform}
            shadowForStrokeEnabled={false}
            onMouseOver={() => props.listening && onHover && onHover(true)}
            onMouseOut={() => props.listening && onHover && onHover(false)}
          />
        ) : type === MouseModes.STAR ? (
          <Star
            {...props}
            id={id?.toString()}
            ref={shapeRef as RefObject<Konva.Star>}
            x={x}
            y={y}
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            numPoints={numPoints}
            shadowColor={shapeRef.current ? shadowColor : undefined}
            shadowBlur={shapeRef.current ? shadowBlur : undefined}
            shadowOpacity={shapeRef.current ? shadowOpacity : undefined}
            shadowOffsetX={shapeRef.current ? shadowOffsetX : undefined}
            shadowOffsetY={shapeRef.current ? shadowOffsetY : undefined}
            draggable={!!onChange && editable && dragEnabled}
            onClick={onSelect}
            onTap={onSelect}
            onDblClick={onDblClick}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onDragMove={handleDragMove}
            onTransformStart={handleTransformStart}
            onTransformEnd={handleTransformEnd}
            onTransform={handleTransform}
            shadowForStrokeEnabled={false}
            onMouseOver={() => props.listening && onHover && onHover(true)}
            onMouseOut={() => props.listening && onHover && onHover(false)}
          />
        ) : type === MouseModes.RING ? (
          <Ring
            {...props}
            id={id?.toString()}
            ref={shapeRef as RefObject<Konva.Ring>}
            x={x}
            y={y}
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            shadowColor={shapeRef.current ? shadowColor : undefined}
            shadowBlur={shapeRef.current ? shadowBlur : undefined}
            shadowOpacity={shapeRef.current ? shadowOpacity : undefined}
            shadowOffsetX={shapeRef.current ? shadowOffsetX : undefined}
            shadowOffsetY={shapeRef.current ? shadowOffsetY : undefined}
            draggable={!!onChange && editable && dragEnabled}
            onClick={onSelect}
            onTap={onSelect}
            onDblClick={onDblClick}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onDragMove={handleDragMove}
            onTransformStart={handleTransformStart}
            onTransformEnd={handleTransformEnd}
            onTransform={handleTransform}
            shadowForStrokeEnabled={false}
            onMouseOver={() => props.listening && onHover && onHover(true)}
            onMouseOut={() => props.listening && onHover && onHover(false)}
          />
        ) : type === MouseModes.REGULARPOLYGON ? (
          <RegularPolygon
            {...props}
            id={id?.toString()}
            ref={shapeRef as RefObject<Konva.RegularPolygon>}
            x={x}
            y={y}
            radius={radius}
            sides={numPoints}
            shadowColor={shapeRef.current ? shadowColor : undefined}
            shadowBlur={shapeRef.current ? shadowBlur : undefined}
            shadowOpacity={shapeRef.current ? shadowOpacity : undefined}
            shadowOffsetX={shapeRef.current ? shadowOffsetX : undefined}
            shadowOffsetY={shapeRef.current ? shadowOffsetY : undefined}
            draggable={!!onChange && editable && dragEnabled}
            onClick={onSelect}
            onTap={onSelect}
            onDblClick={onDblClick}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onDragMove={handleDragMove}
            onTransformStart={handleTransformStart}
            onTransformEnd={handleTransformEnd}
            onTransform={handleTransform}
            shadowForStrokeEnabled={false}
            onMouseOver={() => props.listening && onHover && onHover(true)}
            onMouseOut={() => props.listening && onHover && onHover(false)}
          />
        ) : type === MouseModes.WEDGE ? (
          <Wedge
            {...props}
            id={id?.toString()}
            ref={shapeRef as RefObject<Konva.Wedge>}
            x={x}
            y={y}
            radius={radius}
            angle={angle}
            shadowColor={shapeRef.current ? shadowColor : undefined}
            shadowBlur={shapeRef.current ? shadowBlur : undefined}
            shadowOpacity={shapeRef.current ? shadowOpacity : undefined}
            shadowOffsetX={shapeRef.current ? shadowOffsetX : undefined}
            shadowOffsetY={shapeRef.current ? shadowOffsetY : undefined}
            draggable={!!onChange && editable && dragEnabled}
            onClick={onSelect}
            onTap={onSelect}
            onDblClick={onDblClick}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onDragMove={handleDragMove}
            onTransformStart={handleTransformStart}
            onTransformEnd={handleTransformEnd}
            onTransform={handleTransform}
            shadowForStrokeEnabled={false}
            onMouseOver={() => props.listening && onHover && onHover(true)}
            onMouseOut={() => props.listening && onHover && onHover(false)}
          />
        ) : type === MouseModes.ARC ? (
          <Arc
            {...props}
            id={id?.toString()}
            ref={shapeRef as RefObject<Konva.Arc>}
            x={x}
            y={y}
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            angle={angle}
            shadowColor={shapeRef.current ? shadowColor : undefined}
            shadowBlur={shapeRef.current ? shadowBlur : undefined}
            shadowOpacity={shapeRef.current ? shadowOpacity : undefined}
            shadowOffsetX={shapeRef.current ? shadowOffsetX : undefined}
            shadowOffsetY={shapeRef.current ? shadowOffsetY : undefined}
            draggable={!!onChange && editable && dragEnabled}
            onClick={onSelect}
            onTap={onSelect}
            onDblClick={onDblClick}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onDragMove={handleDragMove}
            onTransformStart={handleTransformStart}
            onTransformEnd={handleTransformEnd}
            onTransform={handleTransform}
            shadowForStrokeEnabled={false}
            onMouseOver={() => props.listening && onHover && onHover(true)}
            onMouseOut={() => props.listening && onHover && onHover(false)}
          />
        ) : type === MouseModes.LINE || type === MouseModes.PEN ? (
          <Line
            {...props}
            id={id?.toString()}
            ref={shapeRef as RefObject<Konva.Line>}
            x={x}
            y={y}
            hitStrokeWidth={20}
            points={points}
            lineCap={lineCap}
            lineJoin={lineJoin}
            shadowColor={shapeRef.current ? shadowColor : undefined}
            shadowBlur={shapeRef.current ? shadowBlur : undefined}
            shadowOpacity={shapeRef.current ? shadowOpacity : undefined}
            shadowOffsetX={shapeRef.current ? shadowOffsetX : undefined}
            shadowOffsetY={shapeRef.current ? shadowOffsetY : undefined}
            draggable={!!onChange && editable && dragEnabled}
            onClick={onSelect}
            onTap={onSelect}
            onDblClick={onDblClick}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onDragMove={handleDragMove}
            onTransformStart={handleTransformStart}
            onTransformEnd={handleTransformEnd}
            onTransform={handleTransform}
            onMouseOver={() => props.listening && onHover && onHover(true)}
            onMouseOut={() => props.listening && onHover && onHover(false)}
          />
        ) : type === MouseModes.POLYGON ? (
          <Line
            {...props}
            id={id?.toString()}
            ref={shapeRef as RefObject<Konva.Line>}
            x={x}
            y={y}
            points={points}
            lineCap={lineCap}
            lineJoin={lineJoin}
            hitStrokeWidth={20}
            shadowColor={shapeRef.current ? shadowColor : undefined}
            shadowBlur={shapeRef.current ? shadowBlur : undefined}
            shadowOpacity={shapeRef.current ? shadowOpacity : undefined}
            shadowOffsetX={shapeRef.current ? shadowOffsetX : undefined}
            shadowOffsetY={shapeRef.current ? shadowOffsetY : undefined}
            draggable={!!onChange && editable && dragEnabled}
            closed={true}
            onClick={onSelect}
            onTap={onSelect}
            onDblClick={onDblClick}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onDragMove={handleDragMove}
            onTransformStart={handleTransformStart}
            onTransformEnd={handleTransformEnd}
            onTransform={handleTransform}
            onMouseOver={() => props.listening && onHover && onHover(true)}
            onMouseOut={() => props.listening && onHover && onHover(false)}
          />
        ) : type === MouseModes.ARROW ? (
          <Arrow
            {...props}
            id={id?.toString()}
            ref={shapeRef as RefObject<Konva.Arrow>}
            x={x}
            y={y}
            hitStrokeWidth={20}
            points={points}
            lineCap={lineCap}
            lineJoin={lineJoin}
            pointerLength={pointerLength}
            pointerWidth={pointerWidth}
            shadowColor={shapeRef.current ? shadowColor : undefined}
            shadowBlur={shapeRef.current ? shadowBlur : undefined}
            shadowOpacity={shapeRef.current ? shadowOpacity : undefined}
            shadowOffsetX={shapeRef.current ? shadowOffsetX : undefined}
            shadowOffsetY={shapeRef.current ? shadowOffsetY : undefined}
            draggable={!!onChange && editable && dragEnabled}
            onClick={onSelect}
            onTap={onSelect}
            onDblClick={onDblClick}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onDragMove={handleDragMove}
            onTransformStart={handleTransformStart}
            onTransformEnd={handleTransformEnd}
            onTransform={handleTransform}
            onMouseOver={() => props.listening && onHover && onHover(true)}
            onMouseOut={() => props.listening && onHover && onHover(false)}
          />
        ) : (
          <></>
        )}
      </>
    );
  }
);

export default Shape;

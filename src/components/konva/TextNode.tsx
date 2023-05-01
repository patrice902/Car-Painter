import Konva from "konva";
import { KonvaEventObject } from "konva/types/Node";
import { Stage } from "konva/types/Stage";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Text } from "react-konva";
import { useDrag, useTransform } from "src/hooks";
import {
  DefaultLayerData,
  FrameSize,
  GuideData,
  MovableObjLayerData,
  PartialAllLayerData,
  TextObjLayerData,
} from "src/types/common";
import { PaintingGuides } from "src/types/enum";
import { BuilderLayerJSON } from "src/types/query";

type TextNodeProps = {
  id: string | number;
  stageRef: React.MutableRefObject<Stage | null>;
  frameSize: FrameSize;
  fontFamily?: string;
  fontFile?: string;
  layer: BuilderLayerJSON<TextObjLayerData>;
  cloningLayer: BuilderLayerJSON<TextObjLayerData>;
  onLoadLayer: (id: string | number, flag: boolean) => void;
  shadowBlur: number;
  shadowColor?: string;
  shadowOffsetX: number;
  shadowOffsetY: number;
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
} & Omit<Konva.NodeConfig, "id">;

export const TextNode = React.memo(
  ({
    id,
    stageRef,
    frameSize,
    fontFamily,
    fontFile,
    layer,
    cloningLayer,
    loadedFontList,
    shadowColor,
    shadowBlur,
    shadowOpacity,
    shadowOffsetX,
    shadowOffsetY,
    paintingGuides,
    guideData,
    onLoadLayer,
    onSelect,
    onDblClick,
    onChange,
    onFontLoad,
    onHover,
    onDragStart,
    onDragEnd,
    onCloneMove,
    onSetTransformingLayer,
    ...props
  }: TextNodeProps) => {
    const [loadedFontFamily, setLoadedFontFamily] = useState<string>();
    const shapeRef = useRef<Konva.Text>(null);
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
      onChange,
      onDragStart,
      onDragEnd,
      onSetTransformingLayer,
    });

    const loadFont = useCallback(() => {
      if (!fontFamily || !fontFile) return;

      const fontObject = new FontFace(fontFamily, fontFile);
      fontObject
        .load()
        .then(function (loaded_face) {
          document.fonts.add(loaded_face);
          onFontLoad(fontFamily);
          setLoadedFontFamily(fontFamily);
          if (onLoadLayer && id) onLoadLayer(id, true);
        })
        .catch(function (error) {
          // error occurred
          console.warn(error, fontFamily);
        });
    }, [
      id,
      fontFamily,
      fontFile,
      onFontLoad,
      onLoadLayer,
      setLoadedFontFamily,
    ]);

    useEffect(() => {
      if (fontFamily && fontFile) {
        if (!loadedFontList.includes(fontFamily)) {
          loadFont();
        } else {
          setLoadedFontFamily(fontFamily);
          if (onLoadLayer && id) onLoadLayer(id, true);
        }
      }
    }, [fontFamily, fontFile, id, loadFont, loadedFontList, onLoadLayer]);

    return (
      <Text
        {...props}
        fontFamily={loadedFontFamily}
        ref={shapeRef}
        shadowColor={shapeRef.current ? shadowColor : undefined}
        shadowBlur={shapeRef.current ? shadowBlur : undefined}
        shadowOpacity={shapeRef.current ? shadowOpacity : undefined}
        shadowOffsetX={shapeRef.current ? shadowOffsetX : 0}
        shadowOffsetY={shapeRef.current ? shadowOffsetY : 0}
        draggable={!!onChange && dragEnabled}
        perfectDrawEnabled={false}
        shadowForStrokeEnabled={false}
        onClick={onSelect}
        onDblClick={onDblClick}
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

export default TextNode;

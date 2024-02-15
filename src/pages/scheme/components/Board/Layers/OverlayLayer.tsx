import React, { useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { GroupedURLImage } from "src/components/konva";
import config from "src/config";
import { FinishOptions } from "src/constant";
import {
  getRelativeShadowOffset,
  numberGuard,
  positiveNumGuard,
} from "src/helper";
import { useLayer, useScheme } from "src/hooks";
import { RootState } from "src/redux";
import { OverlayObjLayerData } from "src/types/common";
import { MouseModes } from "src/types/enum";
import { BuilderLayerJSON } from "src/types/query";

import { MovableLayerProps } from "./types";

export const OverlayLayer = React.memo(
  ({
    stageRef,
    editable,
    virtual,
    specMode,
    layer,
    onSetTransformingLayer,
    onHover,
    onLayerDragStart,
    onLayerDragEnd,
  }: MovableLayerProps<OverlayObjLayerData>) => {
    const {
      loadedStatuses,
      cloningLayer,
      onLoadLayer,
      onLayerSelect: onSelect,
      onLayerDataChange: onChange,
      onCloneMoveLayer: onCloneMove,
      onDblClickLayer: onDblClick,
    } = useLayer();
    const id = `${virtual ? "virtual-" : ""}${layer.id.toString()}`;

    const { guideData } = useScheme();

    const frameSize = useSelector(
      (state: RootState) => state.boardReducer.frameSize
    );
    const mouseMode = useSelector(
      (state: RootState) => state.boardReducer.mouseMode
    );
    const boardRotate = useSelector(
      (state: RootState) => state.boardReducer.boardRotate
    );
    const paintingGuides = useSelector(
      (state: RootState) => state.boardReducer.paintingGuides
    );

    const getLayerImage = useCallback(
      (layer) =>
        layer.layer_data.legacy
          ? `${config.legacyAssetURL}/layers/layer_${layer.id}.png`
          : `${config.assetsURL}/${layer.layer_data.source_file}`,
      []
    );

    const shadowOffset = useMemo(
      () =>
        getRelativeShadowOffset(boardRotate, {
          x: layer.layer_data.shadowOffsetX,
          y: layer.layer_data.shadowOffsetY,
        }),
      [boardRotate, layer]
    );

    return (
      <GroupedURLImage
        key={id}
        id={id}
        name={id}
        loadedStatus={loadedStatuses[id]}
        layer={layer}
        cloningLayer={cloningLayer as BuilderLayerJSON<OverlayObjLayerData>}
        stageRef={stageRef}
        editable={Boolean(editable)}
        src={getLayerImage(layer)}
        x={numberGuard(layer.layer_data.left)}
        y={numberGuard(layer.layer_data.top)}
        allowFit={true}
        filterColor={
          specMode
            ? layer.layer_data.finish || FinishOptions[0].value
            : layer.layer_data.color
        }
        width={positiveNumGuard(layer.layer_data.width)}
        height={positiveNumGuard(layer.layer_data.height)}
        rotation={numberGuard(layer.layer_data.rotation)}
        boardRotate={numberGuard(boardRotate)}
        opacity={layer.layer_data.opacity}
        scaleX={layer.layer_data.flop === 1 ? -1 : 1}
        scaleY={layer.layer_data.flip === 1 ? -1 : 1}
        skewX={
          Math.abs(layer.layer_data.skewX) >= 1
            ? layer.layer_data.skewX / 10
            : layer.layer_data.skewX
        }
        skewY={
          Math.abs(layer.layer_data.skewY) >= 1
            ? layer.layer_data.skewY / 10
            : layer.layer_data.skewY
        }
        // bgColor={specMode ? null : layer.layer_data.bgColor}
        // paddingX={layer.layer_data.paddingX}
        // paddingY={layer.layer_data.paddingY}
        shadowColor={
          specMode
            ? layer.layer_data.finish || FinishOptions[0].value
            : layer.layer_data.shadowColor
        }
        shadowBlur={numberGuard(layer.layer_data.shadowBlur)}
        shadowOpacity={layer.layer_data.shadowOpacity}
        shadowOffsetX={numberGuard(shadowOffset.x)}
        shadowOffsetY={numberGuard(shadowOffset.y)}
        strokeWidth={positiveNumGuard(layer.layer_data.stroke)}
        stroke={
          specMode
            ? layer.layer_data.finish || FinishOptions[0].value
            : layer.layer_data.scolor
        }
        strokeScale={positiveNumGuard(layer.layer_data.stroke_scale)}
        onSelect={() => onSelect(layer)}
        onDblClick={onDblClick}
        listening={!layer.layer_locked && mouseMode === MouseModes.DEFAULT}
        frameSize={frameSize}
        onChange={(values, pushingToHistory) =>
          onChange(layer, values, pushingToHistory)
        }
        onHover={(flag) => onHover?.(layer, flag)}
        visible={layer.layer_visible ? true : false}
        paintingGuides={paintingGuides}
        guideData={guideData}
        onLoadLayer={!virtual ? onLoadLayer : undefined}
        onDragStart={onLayerDragStart}
        onDragEnd={onLayerDragEnd}
        onCloneMove={onCloneMove}
        onSetTransformingLayer={onSetTransformingLayer}
      />
    );
  }
);

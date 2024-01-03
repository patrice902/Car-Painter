import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { GroupedURLImage } from "src/components/konva";
import { FinishOptions } from "src/constant";
import {
  generateLogoImageURL,
  getRelativeShadowOffset,
  numberGuard,
  positiveNumGuard,
} from "src/helper";
import { useLayer, useScheme } from "src/hooks";
import { RootState } from "src/redux";
import { LogoObjLayerData, OverlayObjLayerData } from "src/types/common";
import { MouseModes, ViewModes } from "src/types/enum";
import { BuilderLayerJSON } from "src/types/query";

import { MovableLayerProps } from "./types";

export const LogoLayer = React.memo(
  ({
    stageRef,
    editable,
    layer,
    onSetTransformingLayer,
    onHover,
    onLayerDragStart,
    onLayerDragEnd,
  }: MovableLayerProps<LogoObjLayerData>) => {
    const {
      loadedStatuses,
      cloningLayer,
      onLoadLayer,
      onLayerSelect: onSelect,
      onLayerDataChange: onChange,
      onCloneMoveLayer: onCloneMove,
      onDblClickLayer: onDblClick,
    } = useLayer();

    const { guideData, legacyMode } = useScheme();

    const frameSize = useSelector(
      (state: RootState) => state.boardReducer.frameSize
    );
    const mouseMode = useSelector(
      (state: RootState) => state.boardReducer.mouseMode
    );
    const viewMode = useSelector(
      (state: RootState) => state.boardReducer.viewMode
    );
    const boardRotate = useSelector(
      (state: RootState) => state.boardReducer.boardRotate
    );
    const paintingGuides = useSelector(
      (state: RootState) => state.boardReducer.paintingGuides
    );
    const carMake = useSelector(
      (state: RootState) => state.carMakeReducer.current
    );

    const specMode = useMemo(() => viewMode === ViewModes.SPEC_VIEW, [
      viewMode,
    ]);

    const layerImage = useMemo(
      () => generateLogoImageURL(layer, carMake, legacyMode),
      [layer, carMake, legacyMode]
    );

    const shadowOffset = useMemo(
      () =>
        getRelativeShadowOffset(boardRotate, {
          x: layer.layer_data.shadowOffsetX,
          y: layer.layer_data.shadowOffsetY,
        }),
      [boardRotate, layer]
    );
    const logoLayerData = layer.layer_data as LogoObjLayerData;

    return (
      <GroupedURLImage
        key={layer.id}
        id={layer.id}
        layer={layer}
        cloningLayer={cloningLayer as BuilderLayerJSON<LogoObjLayerData>}
        stageRef={stageRef}
        name={layer.id.toString()}
        editable={editable}
        src={layerImage}
        loadedStatus={loadedStatuses[layer.id]}
        x={numberGuard(logoLayerData.left)}
        y={numberGuard(logoLayerData.top)}
        allowFit={true}
        width={positiveNumGuard(logoLayerData.width)}
        height={positiveNumGuard(logoLayerData.height)}
        frameSize={frameSize}
        rotation={numberGuard(logoLayerData.rotation)}
        boardRotate={numberGuard(boardRotate)}
        scaleX={logoLayerData.flop === 1 ? -1 : 1}
        scaleY={logoLayerData.flip === 1 ? -1 : 1}
        filterColor={
          specMode
            ? logoLayerData.finish || FinishOptions[0].value
            : ((logoLayerData as unknown) as OverlayObjLayerData).color
        }
        shadowColor={
          specMode
            ? logoLayerData.finish || FinishOptions[0].value
            : logoLayerData.shadowColor
        }
        bgColor={
          specMode
            ? logoLayerData.bgColor
              ? logoLayerData.finish || FinishOptions[0].value
              : null
            : logoLayerData.bgColor
        }
        paddingX={logoLayerData.paddingX}
        paddingY={logoLayerData.paddingY}
        shadowBlur={numberGuard(logoLayerData.shadowBlur)}
        shadowOpacity={logoLayerData.shadowOpacity}
        shadowOffsetX={numberGuard(shadowOffset.x)}
        shadowOffsetY={numberGuard(shadowOffset.y)}
        skewX={
          Math.abs(logoLayerData.skewX) >= 1
            ? logoLayerData.skewX / 10
            : logoLayerData.skewX
        }
        skewY={
          Math.abs(logoLayerData.skewY) >= 1
            ? logoLayerData.skewY / 10
            : logoLayerData.skewY
        }
        opacity={logoLayerData.opacity}
        paintingGuides={paintingGuides}
        guideData={guideData}
        onSelect={() => onSelect(layer)}
        onDblClick={onDblClick}
        listening={!layer.layer_locked && mouseMode === MouseModes.DEFAULT}
        onChange={(values, pushingToHistory) =>
          onChange(layer, values, pushingToHistory)
        }
        onHover={(flag) => onHover(layer, flag)}
        visible={layer.layer_visible ? true : false}
        onLoadLayer={onLoadLayer}
        onDragStart={onLayerDragStart}
        onDragEnd={onLayerDragEnd}
        onCloneMove={onCloneMove}
        onSetTransformingLayer={onSetTransformingLayer}
      />
    );
  }
);

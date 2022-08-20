import React, { useMemo, useCallback } from "react";
import _ from "lodash";

import config from "config";
import { FinishOptions, LayerTypes, MouseModes, ViewModes } from "constant";
import { getRelativeShadowOffset } from "helper";

import { GroupedURLImage } from "components/konva";
import { useSelector } from "react-redux";
import { useLayer, useScheme } from "hooks";

export const Overlays = React.memo((props) => {
  const {
    stageRef,
    editable,
    onSetTransformingLayer,
    onHover,
    onLayerDragStart,
    onLayerDragEnd,
  } = props;

  const {
    layerList,
    loadedStatuses,
    cloningLayer,
    cloningQueue,
    onLoadLayer,
    onLayerSelect: onSelect,
    onLayerDataChange: onChange,
    onCloneMoveLayer: onCloneMove,
    onDblClickLayer: onDblClick,
  } = useLayer();

  const { guideData } = useScheme();

  const frameSize = useSelector((state) => state.boardReducer.frameSize);
  const mouseMode = useSelector((state) => state.boardReducer.mouseMode);
  const viewMode = useSelector((state) => state.boardReducer.viewMode);
  const boardRotate = useSelector((state) => state.boardReducer.boardRotate);
  const paintingGuides = useSelector(
    (state) => state.boardReducer.paintingGuides
  );

  const specMode = useMemo(() => viewMode === ViewModes.SPEC_VIEW, [viewMode]);

  const filteredLayers = useMemo(
    () =>
      _.orderBy(
        layerList.filter((item) => item.layer_type === LayerTypes.OVERLAY),
        ["layer_order"],
        ["desc"]
      ),
    [layerList]
  );
  const resultLayers = useMemo(() => {
    let newLayers = [...filteredLayers];
    if (cloningLayer) {
      newLayers = [...newLayers, cloningLayer];
    }
    if (cloningQueue.length) {
      newLayers = [...newLayers, ...cloningQueue];
    }
    return newLayers;
  }, [cloningLayer, cloningQueue, filteredLayers]);

  const getShadowOffset = useCallback(
    (layer) => {
      return getRelativeShadowOffset(boardRotate, {
        x: layer.layer_data.shadowOffsetX,
        y: layer.layer_data.shadowOffsetY,
      });
    },
    [boardRotate]
  );

  const getLayerImage = useCallback((layer) => {
    return layer.layer_data.legacy
      ? `${config.legacyAssetURL}/layers/layer_${layer.id}.png`
      : `${config.assetsURL}/${layer.layer_data.source_file}`;
  }, []);

  return (
    <>
      {resultLayers.map((layer) => {
        let shadowOffset = getShadowOffset(layer);

        return (
          <GroupedURLImage
            key={layer.id}
            id={layer.id}
            layer={layer}
            cloningLayer={cloningLayer}
            stageRef={stageRef}
            editable={editable}
            name={layer.id.toString()}
            src={getLayerImage(layer)}
            x={parseFloat(layer.layer_data.left || 0)}
            y={parseFloat(layer.layer_data.top || 0)}
            allowFit={true}
            filterColor={
              specMode
                ? layer.layer_data.finish || FinishOptions[0].value
                : layer.layer_data.color
            }
            width={layer.layer_data.width}
            height={layer.layer_data.height}
            rotation={layer.layer_data.rotation}
            boardRotate={boardRotate}
            loadedStatus={loadedStatuses[layer.id]}
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
            bgColor={specMode ? null : layer.layer_data.bgColor}
            paddingX={layer.layer_data.paddingX}
            paddingY={layer.layer_data.paddingY}
            shadowColor={
              specMode
                ? layer.layer_data.finish || FinishOptions[0].value
                : layer.layer_data.shadowColor
            }
            shadowBlur={layer.layer_data.shadowBlur}
            shadowOpacity={layer.layer_data.shadowOpacity}
            shadowOffsetX={shadowOffset.x}
            shadowOffsetY={shadowOffset.y}
            strokeWidth={layer.layer_data.stroke}
            stroke={
              specMode
                ? layer.layer_data.finish || FinishOptions[0].value
                : layer.layer_data.scolor
            }
            strokeScale={layer.layer_data.stroke_scale}
            onSelect={() => onSelect(layer)}
            onDblClick={onDblClick}
            listening={!layer.layer_locked && mouseMode === MouseModes.DEFAULT}
            frameSize={frameSize}
            onChange={(values, pushingToHistory) =>
              onChange(layer, values, pushingToHistory)
            }
            onHover={(flag) => onHover(layer, flag)}
            visible={layer.layer_visible ? true : false}
            paintingGuides={paintingGuides}
            guideData={guideData}
            onLoadLayer={onLoadLayer}
            onDragStart={onLayerDragStart}
            onDragEnd={onLayerDragEnd}
            onCloneMove={onCloneMove}
            onSetTransformingLayer={onSetTransformingLayer}
          />
        );
      })}
    </>
  );
});

export default Overlays;

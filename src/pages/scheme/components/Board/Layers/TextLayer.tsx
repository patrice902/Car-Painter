import React, { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TextNode } from "src/components/konva";
import config from "src/config";
import { FinishOptions } from "src/constant";
import {
  decodeHtml,
  enhanceFontFamily,
  getRelativeShadowOffset,
  numberGuard,
  positiveNumGuard,
} from "src/helper";
import { useLayer, useScheme } from "src/hooks";
import { RootState } from "src/redux";
import { insertToLoadedList as insertToLoadedFontList } from "src/redux/reducers/fontReducer";
import { TextObjLayerData } from "src/types/common";
import { MouseModes } from "src/types/enum";
import { BuilderLayerJSON } from "src/types/query";

import { MovableLayerProps } from "./types";

export const TextLayer = React.memo(
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
  }: MovableLayerProps<TextObjLayerData>) => {
    const dispatch = useDispatch();
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
    const loadedFontList = useSelector(
      (state: RootState) => state.fontReducer.loadedList
    );
    const fonts = useSelector((state: RootState) => state.fontReducer.list);

    const shadowOffset = useMemo(
      () =>
        getRelativeShadowOffset(boardRotate, {
          x: layer.layer_data.shadowOffsetX,
          y: layer.layer_data.shadowOffsetY,
        }),
      [boardRotate, layer]
    );
    const font = useMemo(
      () =>
        fonts?.find(
          (item) => item.id.toString() === layer.layer_data.font.toString()
        ),
      [fonts, layer.layer_data.font]
    );
    const textLayerData = layer.layer_data as TextObjLayerData;

    const onFontLoad = useCallback(
      (fontFamily) => {
        dispatch(insertToLoadedFontList(fontFamily));
      },
      [dispatch]
    );

    return (
      <TextNode
        key={id}
        id={id}
        name={id}
        loadedStatus={loadedStatuses[id]}
        layer={layer as BuilderLayerJSON<TextObjLayerData>}
        cloningLayer={cloningLayer as BuilderLayerJSON<TextObjLayerData>}
        editable={editable}
        stageRef={stageRef}
        frameSize={frameSize}
        text={decodeHtml(textLayerData.text)}
        fontFamily={enhanceFontFamily(font?.font_name)}
        fontFile={
          font?.font_file
            ? `url(${config.assetsURL}/${font.font_file})`
            : undefined
        }
        loadedFontList={loadedFontList}
        onFontLoad={onFontLoad}
        fontSize={positiveNumGuard(textLayerData.size)}
        fill={
          specMode
            ? textLayerData.finish || FinishOptions[0].value
            : textLayerData.color
        }
        strokeWidth={positiveNumGuard(textLayerData.stroke)}
        stroke={
          specMode
            ? textLayerData.finish || FinishOptions[0].value
            : textLayerData.scolor
        }
        strokeEnabled={true}
        x={numberGuard(textLayerData.left)}
        y={numberGuard(textLayerData.top)}
        skewX={
          Math.abs(textLayerData.skewX) >= 1
            ? textLayerData.skewX / 10
            : textLayerData.skewX
        }
        skewY={
          Math.abs(textLayerData.skewY) >= 1
            ? textLayerData.skewY / 10
            : textLayerData.skewY
        }
        offsetX={0}
        offsetY={0}
        // width={textLayerData.width}
        // height={textLayerData.height}
        opacity={textLayerData.opacity}
        rotation={numberGuard(textLayerData.rotation)}
        scaleX={
          (textLayerData.scaleX || 1) * (textLayerData.flop === 1 ? -1 : 1)
        }
        scaleY={
          (textLayerData.scaleY || 1) * (textLayerData.flip === 1 ? -1 : 1)
        }
        shadowColor={
          specMode
            ? textLayerData.finish || FinishOptions[0].value
            : textLayerData.shadowColor
        }
        shadowBlur={numberGuard(textLayerData.shadowBlur)}
        shadowOpacity={textLayerData.shadowOpacity}
        shadowOffsetX={numberGuard(shadowOffset.x)}
        shadowOffsetY={numberGuard(shadowOffset.y)}
        visible={layer.layer_visible ? true : false}
        paintingGuides={paintingGuides}
        guideData={guideData}
        onSelect={() => onSelect(layer)}
        onDblClick={onDblClick}
        listening={!layer.layer_locked && mouseMode === MouseModes.DEFAULT}
        onChange={(value, pushingToHistory) =>
          onChange(layer, value, pushingToHistory)
        }
        onHover={(flag) => onHover?.(layer, flag)}
        onLoadLayer={!virtual ? onLoadLayer : undefined}
        onDragStart={onLayerDragStart}
        onDragEnd={onLayerDragEnd}
        onCloneMove={onCloneMove}
        onSetTransformingLayer={onSetTransformingLayer}
      />
    );
  }
);

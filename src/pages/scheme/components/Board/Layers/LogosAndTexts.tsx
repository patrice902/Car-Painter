import { Stage } from "konva/types/Stage";
import _ from "lodash";
import React, { RefObject, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GroupedURLImage, TextNode } from "src/components/konva";
import config from "src/config";
import { FinishOptions } from "src/constant";
import {
  decodeHtml,
  enhanceFontFamily,
  getRelativeShadowOffset,
} from "src/helper";
import { useLayer, useScheme } from "src/hooks";
import { RootState } from "src/redux";
import { insertToLoadedList as insertToLoadedFontList } from "src/redux/reducers/fontReducer";
import {
  LogoObjLayerData,
  MovableObjLayerData,
  OverlayObjLayerData,
  TextObjLayerData,
} from "src/types/common";
import { LayerTypes, MouseModes, ViewModes } from "src/types/enum";
import { BuilderLayerJSON } from "src/types/query";

type LogosAndTextsProps = {
  stageRef: RefObject<Stage>;
  editable: boolean;
  onSetTransformingLayer: (
    layer: BuilderLayerJSON<MovableObjLayerData> | null
  ) => void;
  onHover: (
    layer: BuilderLayerJSON<MovableObjLayerData>,
    flag: boolean
  ) => void;
  onLayerDragStart: (layer?: BuilderLayerJSON<MovableObjLayerData>) => void;
  onLayerDragEnd: () => void;
};

export const LogosAndTexts = React.memo(
  ({
    stageRef,
    editable,
    onSetTransformingLayer,
    onHover,
    onLayerDragStart,
    onLayerDragEnd,
  }: LogosAndTextsProps) => {
    const dispatch = useDispatch();
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
    const loadedFontList = useSelector(
      (state: RootState) => state.fontReducer.loadedList
    );
    const fonts = useSelector((state: RootState) => state.fontReducer.list);

    const specMode = useMemo(() => viewMode === ViewModes.SPEC_VIEW, [
      viewMode,
    ]);

    const filteredLayers = useMemo(
      () =>
        _.orderBy(
          layerList.filter(
            (item) =>
              item.layer_type === LayerTypes.LOGO ||
              item.layer_type === LayerTypes.UPLOAD ||
              item.layer_type === LayerTypes.TEXT
          ),
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

      return newLayers as BuilderLayerJSON<MovableObjLayerData>[];
    }, [cloningLayer, cloningQueue, filteredLayers]);

    const layerFont = useCallback(
      (layer) =>
        fonts?.find(
          (item) => item.id.toString() === layer.layer_data.font.toString()
        ),
      [fonts]
    );
    const getShadowOffset = useCallback(
      (layer) =>
        getRelativeShadowOffset(boardRotate, {
          x: layer.layer_data.shadowOffsetX,
          y: layer.layer_data.shadowOffsetY,
        }),
      [boardRotate]
    );

    const getLayerImage = useCallback(
      (layer) =>
        layer.layer_data.legacy
          ? `${config.legacyAssetURL}/layers/layer_${layer.id}.png`
          : layer.layer_data.fromOldSource
          ? `${config.legacyAssetURL}/${layer.layer_data.source_file}`
          : `${config.assetsURL}/${layer.layer_data.source_file}`,
      []
    );

    const onFontLoad = useCallback(
      (fontFamily) => {
        dispatch(insertToLoadedFontList(fontFamily));
      },
      [dispatch]
    );

    return (
      <>
        {resultLayers.map((layer) => {
          const shadowOffset = getShadowOffset(layer);

          if (layer.layer_type !== LayerTypes.TEXT) {
            const logoLayerData = layer.layer_data as LogoObjLayerData;

            return (
              <GroupedURLImage
                key={layer.id}
                id={layer.id}
                layer={layer as BuilderLayerJSON<LogoObjLayerData>}
                cloningLayer={
                  cloningLayer as BuilderLayerJSON<LogoObjLayerData>
                }
                stageRef={stageRef}
                name={layer.id.toString()}
                editable={editable}
                src={getLayerImage(layer)}
                loadedStatus={loadedStatuses[layer.id]}
                x={+(logoLayerData.left ?? 0)}
                y={+(logoLayerData.top ?? 0)}
                allowFit={true}
                width={logoLayerData.width}
                height={logoLayerData.height}
                frameSize={frameSize}
                rotation={logoLayerData.rotation}
                boardRotate={boardRotate}
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
                shadowBlur={logoLayerData.shadowBlur}
                shadowOpacity={logoLayerData.shadowOpacity}
                shadowOffsetX={shadowOffset.x}
                shadowOffsetY={shadowOffset.y}
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
                listening={
                  !layer.layer_locked && mouseMode === MouseModes.DEFAULT
                }
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
          const font = layerFont(layer);
          const textLayerData = layer.layer_data as TextObjLayerData;

          return (
            <TextNode
              key={layer.id}
              id={layer.id}
              layer={layer as BuilderLayerJSON<TextObjLayerData>}
              cloningLayer={cloningLayer as BuilderLayerJSON<TextObjLayerData>}
              editable={editable}
              stageRef={stageRef}
              frameSize={frameSize}
              name={layer.id.toString()}
              text={decodeHtml(textLayerData.text)}
              fontFamily={enhanceFontFamily(font?.font_name)}
              fontFile={
                font?.font_file
                  ? `url(${config.assetsURL}/${font.font_file})`
                  : undefined
              }
              loadedFontList={loadedFontList}
              loadedStatus={loadedStatuses[layer.id]}
              onFontLoad={onFontLoad}
              fontSize={textLayerData.size}
              fill={
                specMode
                  ? textLayerData.finish || FinishOptions[0].value
                  : textLayerData.color
              }
              strokeWidth={textLayerData.stroke}
              stroke={
                specMode
                  ? textLayerData.finish || FinishOptions[0].value
                  : textLayerData.scolor
              }
              strokeEnabled={true}
              x={+(textLayerData.left ?? 0)}
              y={+(textLayerData.top ?? 0)}
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
              rotation={textLayerData.rotation}
              scaleX={
                (textLayerData.scaleX || 1) *
                (textLayerData.flop === 1 ? -1 : 1)
              }
              scaleY={
                (textLayerData.scaleY || 1) *
                (textLayerData.flip === 1 ? -1 : 1)
              }
              shadowColor={
                specMode
                  ? textLayerData.finish || FinishOptions[0].value
                  : textLayerData.shadowColor
              }
              shadowBlur={textLayerData.shadowBlur}
              shadowOpacity={textLayerData.shadowOpacity}
              shadowOffsetX={shadowOffset.x}
              shadowOffsetY={shadowOffset.y}
              visible={layer.layer_visible ? true : false}
              paintingGuides={paintingGuides}
              guideData={guideData}
              onSelect={() => onSelect(layer)}
              onDblClick={onDblClick}
              listening={
                !layer.layer_locked && mouseMode === MouseModes.DEFAULT
              }
              onChange={(value, pushingToHistory) =>
                onChange(layer, value, pushingToHistory)
              }
              onHover={(flag) => onHover(layer, flag)}
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
  }
);

export default LogosAndTexts;

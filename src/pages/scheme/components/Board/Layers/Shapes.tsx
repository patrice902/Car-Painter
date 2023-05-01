import { Stage } from "konva/types/Stage";
import _ from "lodash";
import React, { RefObject, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { Shape } from "src/components/konva";
import { FinishOptions } from "src/constant";
import {
  getRelativeShadowOffset,
  removeDuplicatedPointFromEnd,
} from "src/helper";
import { useLayer, useScheme } from "src/hooks";
import { RootState } from "src/redux";
import {
  ArrowObjLayerData,
  CircleObjLayerData,
  LineObjLayerData,
  MovableObjLayerData,
  RectObjLayerData,
  ShapeBaseObjLayerData,
  StarObjLayerData,
  WedgeObjLayerData,
} from "src/types/common";
import { LayerTypes, MouseModes, ViewModes } from "src/types/enum";
import { BuilderLayerJSON } from "src/types/query";

type ShapesProps = {
  stageRef: RefObject<Stage>;
  editable: boolean;
  drawingLayer?: BuilderLayerJSON<ShapeBaseObjLayerData> | null;
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

export const Shapes = React.memo(
  ({
    stageRef,
    editable,
    drawingLayer,
    onSetTransformingLayer,
    onHover,
    onLayerDragStart,
    onLayerDragEnd,
  }: ShapesProps) => {
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

    const specMode = useMemo(() => viewMode === ViewModes.SPEC_VIEW, [
      viewMode,
    ]);

    const filteredLayers = useMemo(
      () =>
        _.orderBy(
          layerList.filter((item) => item.layer_type === LayerTypes.SHAPE),
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
      return newLayers as BuilderLayerJSON<ShapeBaseObjLayerData>[];
    }, [cloningLayer, cloningQueue, filteredLayers]);

    const getShadowOffset = useCallback(
      (layer) =>
        getRelativeShadowOffset(boardRotate, {
          x: layer.layer_data.shadowOffsetX,
          y: layer.layer_data.shadowOffsetY,
        }),
      [boardRotate]
    );
    const getOffsetsFromStroke = useCallback((layer) => {
      if (layer.layer_data.strokeType === "inside")
        return {
          x: [MouseModes.RECT, MouseModes.ELLIPSE].includes(layer.layer_type)
            ? layer.layer_data.stroke / 2.0
            : 0,
          y: [MouseModes.RECT, MouseModes.ELLIPSE].includes(layer.layer_type)
            ? layer.layer_data.stroke / 2.0
            : 0,
          height: -layer.layer_data.stroke / 2.0,
          width: -layer.layer_data.stroke / 2.0,
          radius: -layer.layer_data.stroke / 2.0,
          pointerLength: -layer.layer_data.stroke / 2.0,
          pointerWidth: -layer.layer_data.stroke / 2.0,
          innerRadius: layer.layer_data.stroke / 2.0,
          outerRadius: -layer.layer_data.stroke / 2.0,
        };
      if (layer.layer_data.strokeType === "outside")
        return {
          x: [MouseModes.RECT, MouseModes.ELLIPSE].includes(layer.layer_type)
            ? -layer.layer_data.stroke / 2.0
            : 0,
          y: [MouseModes.RECT, MouseModes.ELLIPSE].includes(layer.layer_type)
            ? -layer.layer_data.stroke / 2.0
            : 0,
          height: layer.layer_data.stroke / 2.0,
          width: layer.layer_data.stroke / 2.0,
          radius: layer.layer_data.stroke / 2.0,
          pointerLength: layer.layer_data.stroke / 2.0,
          pointerWidth: layer.layer_data.stroke / 2.0,
          innerRadius: -layer.layer_data.stroke / 2.0,
          outerRadius: layer.layer_data.stroke / 2.0,
        };
      return {
        x: 0,
        y: 0,
        height: 0,
        width: 0,
        radius: 0,
        pointerLength: 0,
        pointerWidth: 0,
        innerRadius: 0,
        outerRadius: 0,
      };
    }, []);

    return (
      <>
        {resultLayers.map((layer) => {
          const shadowOffset = getShadowOffset(layer);
          const offsetsFromStroke = getOffsetsFromStroke(layer);
          const newWidth =
            (layer.layer_data.width || 0) + offsetsFromStroke.width;
          const newHeight =
            (layer.layer_data.height || 0) + offsetsFromStroke.height;

          return (
            <Shape
              key={layer.id}
              id={layer.id}
              name={layer.id ? layer.id.toString() : null}
              layer={layer}
              cloningLayer={
                cloningLayer as BuilderLayerJSON<ShapeBaseObjLayerData>
              }
              stageRef={stageRef}
              editable={editable}
              frameSize={frameSize}
              type={layer.layer_data.type}
              x={layer.layer_data.left + offsetsFromStroke.x || 0}
              y={layer.layer_data.top + offsetsFromStroke.y || 0}
              width={Math.abs(newWidth)}
              height={Math.abs(newHeight)}
              radius={Math.abs(
                (layer.layer_data as CircleObjLayerData).radius +
                  offsetsFromStroke.radius
              )}
              offsetsFromStroke={offsetsFromStroke}
              points={
                (layer.layer_data as LineObjLayerData).points
                  ? removeDuplicatedPointFromEnd(
                      (layer.layer_data as LineObjLayerData).points
                    )
                  : []
              }
              loadedStatus={loadedStatuses[layer.id]}
              pointerLength={Math.abs(
                (layer.layer_data as ArrowObjLayerData).pointerLength +
                  offsetsFromStroke.pointerLength
              )}
              pointerWidth={Math.abs(
                (layer.layer_data as ArrowObjLayerData).pointerWidth +
                  offsetsFromStroke.pointerWidth
              )}
              lineCap={(layer.layer_data as LineObjLayerData).lineCap}
              lineJoin={(layer.layer_data as LineObjLayerData).lineJoin}
              innerRadius={Math.abs(
                (layer.layer_data as StarObjLayerData).innerRadius +
                  offsetsFromStroke.innerRadius
              )}
              outerRadius={Math.abs(
                (layer.layer_data as StarObjLayerData).outerRadius +
                  offsetsFromStroke.outerRadius
              )}
              numPoints={(layer.layer_data as StarObjLayerData).numPoints}
              cornerRadius={[
                (layer.layer_data as RectObjLayerData).cornerTopLeft,
                (layer.layer_data as RectObjLayerData).cornerTopRight,
                (layer.layer_data as RectObjLayerData).cornerBottomLeft,
                (layer.layer_data as RectObjLayerData).cornerBottomRight,
              ]}
              rotation={layer.layer_data.rotation}
              angle={(layer.layer_data as WedgeObjLayerData).angle}
              opacity={layer.layer_data.opacity}
              scaleX={layer.layer_data.flop === 1 ? -1 : 1}
              scaleY={layer.layer_data.flip === 1 ? -1 : 1}
              shadowColor={
                specMode
                  ? layer.layer_data.finish || FinishOptions[0].value
                  : layer.layer_data.shadowColor
              }
              shadowBlur={layer.layer_data.shadowBlur}
              shadowOpacity={layer.layer_data.shadowOpacity}
              shadowOffsetX={shadowOffset.x}
              shadowOffsetY={shadowOffset.y}
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
              fill={
                specMode
                  ? layer.layer_data.finish || FinishOptions[0].value
                  : (layer.layer_data as RectObjLayerData).color
              }
              strokeWidth={layer.layer_data.stroke}
              stroke={
                specMode
                  ? layer.layer_data.finish || FinishOptions[0].value
                  : layer.layer_data.scolor
              }
              // strokeScale={(layer.layer_data as RectObjLayerData).stroke_scale}
              strokeEnabled={true}
              globalCompositeOperation={
                layer.layer_data.blendType === "normal"
                  ? null
                  : layer.layer_data.blendType
              }
              visible={layer.layer_visible ? true : false}
              perfectDrawEnabled={false}
              paintingGuides={paintingGuides}
              guideData={guideData}
              onSelect={() => onSelect(layer)}
              onDblClick={onDblClick}
              listening={
                !layer.layer_locked && mouseMode === MouseModes.DEFAULT
              }
              onChange={(values) => onChange(layer, values)}
              onHover={(flag) => onHover(layer, flag)}
              onLoadLayer={onLoadLayer}
              onDragStart={onLayerDragStart}
              onDragEnd={onLayerDragEnd}
              onCloneMove={onCloneMove}
              onSetTransformingLayer={onSetTransformingLayer}
            />
          );
        })}
        {drawingLayer ? (
          <Shape
            layer={drawingLayer}
            cloningLayer={
              cloningLayer as BuilderLayerJSON<ShapeBaseObjLayerData>
            }
            type={drawingLayer.layer_data.type}
            x={+drawingLayer.layer_data.left ?? 0}
            y={+drawingLayer.layer_data.top ?? 0}
            width={drawingLayer.layer_data.width ?? 0}
            height={drawingLayer.layer_data.height ?? 0}
            radius={Math.abs(
              (drawingLayer.layer_data as CircleObjLayerData).radius
            )}
            angle={(drawingLayer.layer_data as WedgeObjLayerData).angle}
            points={
              (drawingLayer.layer_data as LineObjLayerData).points
                ? removeDuplicatedPointFromEnd(
                    (drawingLayer.layer_data as LineObjLayerData).points
                  )
                : []
            }
            pointerLength={
              (drawingLayer.layer_data as ArrowObjLayerData).pointerLength
            }
            pointerWidth={
              (drawingLayer.layer_data as ArrowObjLayerData).pointerWidth
            }
            lineCap={(drawingLayer.layer_data as ArrowObjLayerData).lineCap}
            lineJoin={(drawingLayer.layer_data as ArrowObjLayerData).lineJoin}
            innerRadius={Math.abs(
              (drawingLayer.layer_data as StarObjLayerData).innerRadius
            )}
            outerRadius={Math.abs(
              (drawingLayer.layer_data as StarObjLayerData).outerRadius
            )}
            numPoints={(drawingLayer.layer_data as StarObjLayerData).numPoints}
            fill={
              specMode
                ? drawingLayer.layer_data.finish || FinishOptions[0].value
                : (drawingLayer.layer_data as RectObjLayerData).color
            }
            strokeWidth={drawingLayer.layer_data.stroke}
            stroke={
              specMode
                ? drawingLayer.layer_data.finish || FinishOptions[0].value
                : drawingLayer.layer_data.scolor
            }
            strokeEnabled={true}
            perfectDrawEnabled={false}
            paintingGuides={paintingGuides}
            guideData={guideData}
          />
        ) : (
          <></>
        )}
      </>
    );
  }
);

export default Shapes;

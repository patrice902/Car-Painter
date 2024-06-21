import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { Shape } from "src/components/konva";
import { FinishOptions } from "src/constant";
import {
  getRelativeShadowOffset,
  numberGuard,
  positiveNumGuard,
  removeDuplicatedPointFromEnd,
} from "src/helper";
import { useLayer, useScheme } from "src/hooks";
import { RootState } from "src/redux";
import {
  ArrowObjLayerData,
  CircleObjLayerData,
  LineObjLayerData,
  RectObjLayerData,
  ShapeBaseObjLayerData,
  StarObjLayerData,
  WedgeObjLayerData,
} from "src/types/common";
import { MouseModes } from "src/types/enum";
import { BuilderLayerJSON } from "src/types/query";

import { MovableLayerProps } from "./types";

export const ShapeLayer = React.memo(
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
  }: MovableLayerProps<ShapeBaseObjLayerData>) => {
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

    const offsetsFromStroke = useMemo(() => {
      if ((layer.layer_data as RectObjLayerData).strokeType === "inside")
        return {
          x: [MouseModes.RECT, MouseModes.ELLIPSE].includes(
            layer.layer_data.type
          )
            ? layer.layer_data.stroke / 2.0
            : 0,
          y: [MouseModes.RECT, MouseModes.ELLIPSE].includes(
            layer.layer_data.type
          )
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
      if ((layer.layer_data as RectObjLayerData).strokeType === "outside")
        return {
          x: [MouseModes.RECT, MouseModes.ELLIPSE].includes(
            layer.layer_data.type
          )
            ? -layer.layer_data.stroke / 2.0
            : 0,
          y: [MouseModes.RECT, MouseModes.ELLIPSE].includes(
            layer.layer_data.type
          )
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
    }, [layer]);

    const shadowOffset = useMemo(
      () =>
        getRelativeShadowOffset(boardRotate, {
          x: layer.layer_data.shadowOffsetX,
          y: layer.layer_data.shadowOffsetY,
        }),
      [boardRotate, layer]
    );
    const newWidth = (layer.layer_data.width || 0) + offsetsFromStroke.width;
    const newHeight = (layer.layer_data.height || 0) + offsetsFromStroke.height;

    return (
      <Shape
        key={id}
        id={id}
        name={id}
        loadedStatus={loadedStatuses[id]}
        layer={layer}
        cloningLayer={cloningLayer as BuilderLayerJSON<ShapeBaseObjLayerData>}
        stageRef={stageRef}
        editable={editable}
        frameSize={frameSize}
        type={layer.layer_data.type}
        x={numberGuard(layer.layer_data.left + offsetsFromStroke.x || 0)}
        y={numberGuard(layer.layer_data.top + offsetsFromStroke.y || 0)}
        width={positiveNumGuard(newWidth)}
        height={positiveNumGuard(newHeight)}
        radius={positiveNumGuard(
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
        pointerLength={positiveNumGuard(
          (layer.layer_data as ArrowObjLayerData).pointerLength +
            offsetsFromStroke.pointerLength
        )}
        pointerWidth={positiveNumGuard(
          (layer.layer_data as ArrowObjLayerData).pointerWidth +
            offsetsFromStroke.pointerWidth
        )}
        lineCap={(layer.layer_data as LineObjLayerData).lineCap}
        lineJoin={(layer.layer_data as LineObjLayerData).lineJoin}
        innerRadius={positiveNumGuard(
          (layer.layer_data as StarObjLayerData).innerRadius +
            offsetsFromStroke.innerRadius
        )}
        outerRadius={positiveNumGuard(
          (layer.layer_data as StarObjLayerData).outerRadius +
            offsetsFromStroke.outerRadius
        )}
        numPoints={positiveNumGuard(
          (layer.layer_data as StarObjLayerData).numPoints
        )}
        cornerRadius={[
          positiveNumGuard(
            (layer.layer_data as RectObjLayerData).cornerTopLeft
          ),
          positiveNumGuard(
            (layer.layer_data as RectObjLayerData).cornerTopRight
          ),
          positiveNumGuard(
            (layer.layer_data as RectObjLayerData).cornerBottomRight
          ),
          positiveNumGuard(
            (layer.layer_data as RectObjLayerData).cornerBottomLeft
          ),
        ]}
        rotation={numberGuard(layer.layer_data.rotation)}
        angle={numberGuard((layer.layer_data as WedgeObjLayerData).angle)}
        opacity={layer.layer_data.opacity}
        scaleX={layer.layer_data.flop === 1 ? -1 : 1}
        scaleY={layer.layer_data.flip === 1 ? -1 : 1}
        shadowColor={
          specMode
            ? layer.layer_data.finish || FinishOptions[0].value
            : layer.layer_data.shadowColor
        }
        shadowBlur={numberGuard(layer.layer_data.shadowBlur)}
        shadowOpacity={layer.layer_data.shadowOpacity}
        shadowOffsetX={numberGuard(shadowOffset.x)}
        shadowOffsetY={numberGuard(shadowOffset.y)}
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
        strokeWidth={positiveNumGuard(layer.layer_data.stroke)}
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
          !layer.layer_locked &&
          mouseMode === MouseModes.DEFAULT &&
          !layer.layer_data.editLock
        }
        onChange={(values) => onChange(layer, values)}
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

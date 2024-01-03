import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { Shape } from "src/components/konva";
import { FinishOptions } from "src/constant";
import {
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
import { ViewModes } from "src/types/enum";
import { BuilderLayerJSON } from "src/types/query";

export const DrawingShapeLayer = React.memo(
  ({ layer }: { layer: BuilderLayerJSON<ShapeBaseObjLayerData> }) => {
    const { cloningLayer } = useLayer();

    const { guideData } = useScheme();

    const viewMode = useSelector(
      (state: RootState) => state.boardReducer.viewMode
    );
    const paintingGuides = useSelector(
      (state: RootState) => state.boardReducer.paintingGuides
    );

    const specMode = useMemo(() => viewMode === ViewModes.SPEC_VIEW, [
      viewMode,
    ]);

    return (
      <Shape
        layer={layer}
        cloningLayer={cloningLayer as BuilderLayerJSON<ShapeBaseObjLayerData>}
        type={layer.layer_data.type}
        x={numberGuard(layer.layer_data.left)}
        y={numberGuard(layer.layer_data.top)}
        width={positiveNumGuard(layer.layer_data.width)}
        height={positiveNumGuard(layer.layer_data.height)}
        radius={positiveNumGuard(
          (layer.layer_data as CircleObjLayerData).radius
        )}
        angle={numberGuard((layer.layer_data as WedgeObjLayerData).angle)}
        points={
          (layer.layer_data as LineObjLayerData).points
            ? removeDuplicatedPointFromEnd(
                (layer.layer_data as LineObjLayerData).points
              )
            : []
        }
        pointerLength={positiveNumGuard(
          (layer.layer_data as ArrowObjLayerData).pointerLength
        )}
        pointerWidth={positiveNumGuard(
          (layer.layer_data as ArrowObjLayerData).pointerWidth
        )}
        lineCap={(layer.layer_data as ArrowObjLayerData).lineCap}
        lineJoin={(layer.layer_data as ArrowObjLayerData).lineJoin}
        innerRadius={positiveNumGuard(
          (layer.layer_data as StarObjLayerData).innerRadius
        )}
        outerRadius={positiveNumGuard(
          (layer.layer_data as StarObjLayerData).outerRadius
        )}
        numPoints={positiveNumGuard(
          (layer.layer_data as StarObjLayerData).numPoints
        )}
        fill={
          specMode
            ? layer.layer_data.finish || FinishOptions[0].value
            : (layer.layer_data as RectObjLayerData).color
        }
        strokeWidth={numberGuard(layer.layer_data.stroke)}
        stroke={
          specMode
            ? layer.layer_data.finish || FinishOptions[0].value
            : layer.layer_data.scolor
        }
        strokeEnabled={true}
        perfectDrawEnabled={false}
        paintingGuides={paintingGuides}
        guideData={guideData}
      />
    );
  }
);

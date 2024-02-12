import { Stage } from "konva/types/Stage";
import _ from "lodash";
import React, { RefObject, useMemo } from "react";
import { useLayer } from "src/hooks";
import {
  LogoObjLayerData,
  MovableObjLayerData,
  OverlayObjLayerData,
  ShapeBaseObjLayerData,
  TextObjLayerData,
} from "src/types/common";
import { LayerTypes } from "src/types/enum";
import { BuilderLayerJSON } from "src/types/query";

import { DrawingShapeLayer } from "./DrawingShapeLayer";
import { LogoLayer } from "./LogoLayer";
import { OverlayLayer } from "./OverlayLayer";
import { ShapeLayer } from "./ShapeLayer";
import { TextLayer } from "./TextLayer";

type MovableLayersGroupProps = {
  stageRef: RefObject<Stage>;
  allowedLayerTypes: LayerTypes[];
  editable?: boolean;
  virtual?: boolean;
  specMode?: boolean;
  drawingLayer?: BuilderLayerJSON<ShapeBaseObjLayerData> | null;
  onSetTransformingLayer?: (
    layer: BuilderLayerJSON<MovableObjLayerData> | null
  ) => void;
  onHover?: (
    layer: BuilderLayerJSON<MovableObjLayerData>,
    flag: boolean
  ) => void;
  onLayerDragStart?: (layer?: BuilderLayerJSON<MovableObjLayerData>) => void;
  onLayerDragEnd?: () => void;
};

export const MovableLayersGroup = React.memo(
  ({ drawingLayer, allowedLayerTypes, ...props }: MovableLayersGroupProps) => {
    const { layerList, cloningLayer, cloningQueue } = useLayer();

    const filteredLayers = useMemo(
      () =>
        _.orderBy(
          layerList.filter((item) =>
            allowedLayerTypes.includes(item.layer_type)
          ),
          ["layer_order"],
          ["desc"]
        ),
      [layerList, allowedLayerTypes]
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

    return (
      <>
        {resultLayers.map((layer) => {
          switch (layer.layer_type) {
            case LayerTypes.SHAPE:
              return (
                <ShapeLayer
                  key={layer.id}
                  layer={layer as BuilderLayerJSON<ShapeBaseObjLayerData>}
                  {...props}
                />
              );
            case LayerTypes.LOGO:
            case LayerTypes.UPLOAD:
              return (
                <LogoLayer
                  key={layer.id}
                  layer={layer as BuilderLayerJSON<LogoObjLayerData>}
                  {...props}
                />
              );
            case LayerTypes.OVERLAY:
              return (
                <OverlayLayer
                  key={layer.id}
                  layer={layer as BuilderLayerJSON<OverlayObjLayerData>}
                  {...props}
                />
              );
            case LayerTypes.TEXT:
              return (
                <TextLayer
                  key={layer.id}
                  layer={layer as BuilderLayerJSON<TextObjLayerData>}
                  {...props}
                />
              );
            default:
              return <></>;
          }
        })}
        {drawingLayer ? <DrawingShapeLayer layer={drawingLayer} /> : <></>}
      </>
    );
  }
);

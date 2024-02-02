import _ from "lodash";
import React, { useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { URLImage } from "src/components/konva";
import config from "src/config";
import { FinishOptions } from "src/constant";
import { basePaintAssetURL, legacyBasePaintAssetURL } from "src/helper";
import { useLayer, useScheme } from "src/hooks";
import { RootState } from "src/redux";
import { BaseObjLayerData, MovableObjLayerData } from "src/types/common";
import { LayerTypes } from "src/types/enum";
import { BuilderLayerJSON } from "src/types/query";

type BasePaintsProps = {
  virtual?: boolean;
  specMode?: boolean;
};

export const BasePaints = React.memo(
  ({ virtual, specMode }: BasePaintsProps) => {
    const { legacyMode } = useScheme();
    const {
      layerList,
      loadedStatuses,
      onLoadLayer,
      onExpandFrameFromImage,
    } = useLayer();

    const carMake = useSelector(
      (state: RootState) => state.carMakeReducer.current
    );

    const filteredLayers = useMemo(
      () =>
        _.orderBy(
          layerList.filter((item) => item.layer_type === LayerTypes.BASE),
          ["layer_order"],
          ["desc"]
        ) as BuilderLayerJSON<BaseObjLayerData>[],
      [layerList]
    );
    const getLayerImage = useCallback(
      (layer) =>
        layer.layer_data.legacy
          ? `${config.legacyAssetURL}/layers/layer_${layer.id}.png`
          : legacyMode
          ? legacyBasePaintAssetURL(layer.layer_data) + layer.layer_data.img
          : basePaintAssetURL(carMake, layer.layer_data.basePaintIndex) +
            layer.layer_data.img,
      [legacyMode, carMake]
    );

    return (
      <>
        {filteredLayers.map((layer) => {
          const id = `${virtual ? "virtual-" : ""}${layer.id.toString()}`;

          return (
            <URLImage
              key={id}
              id={id}
              name={id}
              loadedStatus={loadedStatuses[id]}
              layer={
                (layer as unknown) as BuilderLayerJSON<MovableObjLayerData>
              }
              src={getLayerImage(layer)}
              x={0}
              y={0}
              width={legacyMode ? 1024 : 2048}
              height={legacyMode ? 1024 : 2048}
              opacity={layer.layer_data.opacity}
              filterColor={
                specMode
                  ? layer.layer_data.finish || FinishOptions[0].value
                  : layer.layer_data.color
              }
              listening={false}
              visible={layer.layer_visible ? true : false}
              tellSize={onExpandFrameFromImage}
              onLoadLayer={onLoadLayer}
            />
          );
        })}
      </>
    );
  }
);

export default BasePaints;

import _ from "lodash";
import React, { useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { URLImage } from "src/components/konva";
import { FinishOptions } from "src/constant";
import { generateCarMakeImageURL } from "src/helper";
import { useLayer, useScheme } from "src/hooks";
import { RootState } from "src/redux";
import { CarObjLayerData, MovableObjLayerData } from "src/types/common";
import { LayerTypes } from "src/types/enum";
import { BuilderLayerJSON } from "src/types/query";

type CarPartsProps = {
  virtual?: boolean;
  specMode?: boolean;
};

export const CarParts = React.memo(({ virtual, specMode }: CarPartsProps) => {
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
        layerList.filter((item) => item.layer_type === LayerTypes.CAR),
        ["layer_order"],
        ["desc"]
      ) as BuilderLayerJSON<CarObjLayerData>[],
    [layerList]
  );
  const getCarMakeImage = useCallback(
    (layer_data: CarObjLayerData) =>
      generateCarMakeImageURL(layer_data, carMake, legacyMode),
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
            layer={(layer as unknown) as BuilderLayerJSON<MovableObjLayerData>}
            x={0}
            y={0}
            width={legacyMode ? 1024 : 2048}
            height={legacyMode ? 1024 : 2048}
            src={getCarMakeImage(layer.layer_data)}
            filterColor={
              specMode
                ? layer.layer_data.finish || FinishOptions[0].value
                : layer.layer_data.color
            }
            listening={false}
            visible={layer.layer_visible ? true : false}
            onLoadLayer={!virtual ? onLoadLayer : undefined}
            tellSize={onExpandFrameFromImage}
          />
        );
      })}
    </>
  );
});

export default CarParts;

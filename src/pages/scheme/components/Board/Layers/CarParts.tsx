import _ from "lodash";
import React, { useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { URLImage } from "src/components/konva";
import config from "src/config";
import { FinishOptions } from "src/constant";
import { carMakeAssetURL, legacyCarMakeAssetURL } from "src/helper";
import { useLayer, useScheme } from "src/hooks";
import { RootState } from "src/redux";
import { CarObjLayerData, MovableObjLayerData } from "src/types/common";
import { LayerTypes, ViewModes } from "src/types/enum";
import { BuilderLayerJSON } from "src/types/query";

export const CarParts = React.memo(() => {
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
  const viewMode = useSelector(
    (state: RootState) => state.boardReducer.viewMode
  );

  const specMode = useMemo(() => viewMode === ViewModes.SPEC_VIEW, [viewMode]);

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
    (layer_data) =>
      layer_data.legacy
        ? `${
            config.legacyAssetURL
          }/templates/${carMake?.folder_directory.replaceAll(" ", "_")}/`
        : (legacyMode
            ? legacyCarMakeAssetURL(carMake)
            : carMakeAssetURL(carMake)) + layer_data.img,
    [legacyMode, carMake]
  );

  return (
    <>
      {filteredLayers.map((layer) => (
        <URLImage
          key={layer.id}
          id={layer.id}
          name={layer.id.toString()}
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
          loadedStatus={loadedStatuses[layer.id]}
          onLoadLayer={onLoadLayer}
          tellSize={onExpandFrameFromImage}
        />
      ))}
    </>
  );
});

export default CarParts;

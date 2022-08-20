import React, { useMemo, useCallback } from "react";
import _ from "lodash";

import { FinishOptions, LayerTypes, ViewModes } from "constant";
import { legacyCarMakeAssetURL, carMakeAssetURL } from "helper";
import config from "config";

import { URLImage } from "components/konva";
import { useSelector } from "react-redux";
import { useLayer, useScheme } from "hooks";

export const CarParts = React.memo(() => {
  const { legacyMode } = useScheme();
  const {
    layerList,
    loadedStatuses,
    onLoadLayer,
    onExpandFrameFromImage,
  } = useLayer();

  const carMake = useSelector((state) => state.carMakeReducer.current);
  const viewMode = useSelector((state) => state.boardReducer.viewMode);

  const specMode = useMemo(() => viewMode === ViewModes.SPEC_VIEW, [viewMode]);

  const filteredLayers = useMemo(
    () =>
      _.orderBy(
        layerList.filter((item) => item.layer_type === LayerTypes.CAR),
        ["layer_order"],
        ["desc"]
      ),
    [layerList]
  );
  const getCarMakeImage = useCallback(
    (layer_data) => {
      return layer_data.legacy
        ? `${
            config.legacyAssetURL
          }/templates/${carMake.folder_directory.replace(" ", "_")}/`
        : (legacyMode
            ? legacyCarMakeAssetURL(carMake)
            : carMakeAssetURL(carMake)) + layer_data.img;
    },
    [legacyMode, carMake]
  );

  return (
    <>
      {filteredLayers.map((layer) => (
        <URLImage
          key={layer.id}
          id={layer.id}
          name={layer.id.toString()}
          layer={layer}
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

import { URLImage } from "components/konva";
import config from "config";
import { FinishOptions, LayerTypes, ViewModes } from "constant";
import { basePaintAssetURL, legacyBasePaintAssetURL } from "helper";
import { useLayer, useScheme } from "hooks";
import _ from "lodash";
import React, { useCallback, useMemo } from "react";
import { useSelector } from "react-redux";

export const BasePaints = React.memo(() => {
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
        layerList.filter((item) => item.layer_type === LayerTypes.BASE),
        ["layer_order"],
        ["desc"]
      ),
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
      {filteredLayers.map((layer) => (
        <URLImage
          key={layer.id}
          id={layer.id}
          name={layer.id.toString()}
          layer={layer}
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
          loadedStatus={loadedStatuses[layer.id]}
          tellSize={onExpandFrameFromImage}
          onLoadLayer={onLoadLayer}
        />
      ))}
    </>
  );
});

export default BasePaints;

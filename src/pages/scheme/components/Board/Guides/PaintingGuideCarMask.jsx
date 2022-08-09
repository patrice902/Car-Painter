import React, { useCallback, useMemo } from "react";
import { PaintingGuides } from "constant";

import { legacyCarMakeAssetURL, carMakeAssetURL } from "helper";
import { URLImage } from "components/konva";
import { useSelector } from "react-redux";

export const PaintingGuideCarMask = React.memo((props) => {
  const {
    specMode,
    legacyMode,
    paintingGuides,
    carMake,
    handleImageSize,
    guideData,
    onLoadLayer,
  } = props;

  const loadedStatuses = useSelector(
    (state) => state.layerReducer.loadedStatuses
  );

  const getCarMakeImage = useCallback(
    (image) => {
      return (
        (legacyMode
          ? legacyCarMakeAssetURL(carMake)
          : carMakeAssetURL(carMake)) + image
      );
    },
    [legacyMode, carMake]
  );

  const src = useMemo(() => getCarMakeImage("mask.png"), [getCarMakeImage]);

  const visible = useMemo(
    () =>
      !specMode && paintingGuides.includes(PaintingGuides.CARMASK)
        ? true
        : false,
    [paintingGuides, specMode]
  );

  return (
    <URLImage
      key="guide-mask"
      id="guide-mask"
      loadedStatus={loadedStatuses["guide-mask"]}
      src={src}
      x={0}
      y={0}
      width={legacyMode ? 1024 : 2048}
      height={legacyMode ? 1024 : 2048}
      tellSize={handleImageSize}
      filterColor={guideData.carmask_color}
      opacity={guideData.carmask_opacity}
      listening={false}
      visible={visible}
      onLoadLayer={onLoadLayer}
    />
  );
});

export default PaintingGuideCarMask;

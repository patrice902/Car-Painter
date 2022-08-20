import React, { useCallback, useMemo } from "react";
import { PaintingGuides, ViewModes } from "constant";

import { legacyCarMakeAssetURL, carMakeAssetURL } from "helper";
import { URLImage } from "components/konva";
import { useSelector } from "react-redux";
import { useLayer, useScheme } from "hooks";

export const PaintingGuideCarMask = React.memo(() => {
  const { legacyMode, guideData } = useScheme();
  const { loadedStatuses, onLoadLayer, onExpandFrameFromImage } = useLayer();

  const carMake = useSelector((state) => state.carMakeReducer.current);
  const paintingGuides = useSelector(
    (state) => state.boardReducer.paintingGuides
  );
  const viewMode = useSelector((state) => state.boardReducer.viewMode);

  const specMode = useMemo(() => viewMode === ViewModes.SPEC_VIEW, [viewMode]);

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
      tellSize={onExpandFrameFromImage}
      filterColor={guideData.carmask_color}
      opacity={guideData.carmask_opacity}
      listening={false}
      visible={visible}
      onLoadLayer={onLoadLayer}
    />
  );
});

export default PaintingGuideCarMask;

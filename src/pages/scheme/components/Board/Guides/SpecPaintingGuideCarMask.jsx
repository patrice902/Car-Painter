import { URLImage } from "components/konva";
import { carMakeAssetURL, legacyCarMakeAssetURL } from "helper";
import { useLayer, useScheme } from "hooks";
import React, { useCallback, useMemo } from "react";
import { useSelector } from "react-redux";

export const SpecPaintingGuideCarMask = React.memo(() => {
  const { schemeFinishBase: finishBase, legacyMode } = useScheme();
  const { loadedStatuses, onLoadLayer, onExpandFrameFromImage } = useLayer();

  const carMake = useSelector((state) => state.carMakeReducer.current);

  const getCarMakeImage = useCallback(
    (image) =>
      (legacyMode ? legacyCarMakeAssetURL(carMake) : carMakeAssetURL(carMake)) +
      image,
    [legacyMode, carMake]
  );

  const src = useMemo(() => getCarMakeImage(`spec/${finishBase}.png`), [
    finishBase,
    getCarMakeImage,
  ]);

  return (
    <URLImage
      id={`guide-mask-${finishBase}`}
      key={`guide-mask-${finishBase}`}
      loadedStatus={loadedStatuses[`guide-mask-${finishBase}`]}
      src={src}
      x={0}
      y={0}
      width={legacyMode ? 1024 : 2048}
      height={legacyMode ? 1024 : 2048}
      tellSize={onExpandFrameFromImage}
      opacity={1}
      listening={false}
      visible={true}
      onLoadLayer={onLoadLayer}
    />
  );
});

export default SpecPaintingGuideCarMask;

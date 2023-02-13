import { URLImage } from "components/konva";
import { PaintingGuides } from "constant";
import { carMakeAssetURL, legacyCarMakeAssetURL } from "helper";
import { useLayer, useScheme } from "hooks";
import React, { useCallback } from "react";
import { useSelector } from "react-redux";

export const PaintingGuideNumber = React.memo(() => {
  const { legacyMode, guideData } = useScheme();
  const { loadedStatuses, onLoadLayer, onExpandFrameFromImage } = useLayer();

  const carMake = useSelector((state) => state.carMakeReducer.current);
  const paintingGuides = useSelector(
    (state) => state.boardReducer.paintingGuides
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

  return (
    <URLImage
      id="guide-numberblocks"
      loadedStatus={loadedStatuses["guide-numberblocks"]}
      src={getCarMakeImage("number_blocks.png")}
      x={0}
      y={0}
      width={legacyMode ? 1024 : 2048}
      height={legacyMode ? 1024 : 2048}
      tellSize={onExpandFrameFromImage}
      filterColor={guideData.numberblock_color}
      opacity={guideData.numberblock_opacity}
      listening={false}
      visible={
        paintingGuides.includes(PaintingGuides.NUMBERBLOCKS) ? true : false
      }
      onLoadLayer={onLoadLayer}
    />
  );
});

export default PaintingGuideNumber;

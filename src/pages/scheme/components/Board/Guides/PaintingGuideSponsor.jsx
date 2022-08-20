import React, { useCallback } from "react";
import { PaintingGuides } from "constant";

import { legacyCarMakeAssetURL, carMakeAssetURL } from "helper";
import { URLImage } from "components/konva";
import { useSelector } from "react-redux";
import { useLayer, useScheme } from "hooks";

export const PaintingGuideSponsor = React.memo((props) => {
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
      id="guide-sponsorblocks"
      loadedStatus={loadedStatuses["guide-sponsorblocks"]}
      src={getCarMakeImage("sponsor_blocks.png")}
      x={0}
      y={0}
      width={legacyMode ? 1024 : 2048}
      height={legacyMode ? 1024 : 2048}
      tellSize={onExpandFrameFromImage}
      filterColor={guideData.sponsor_color}
      opacity={guideData.sponsor_opacity}
      listening={false}
      visible={
        paintingGuides.includes(PaintingGuides.SPONSORBLOCKS) ? true : false
      }
      onLoadLayer={onLoadLayer}
    />
  );
});

export default PaintingGuideSponsor;

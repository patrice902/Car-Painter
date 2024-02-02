import React, { useCallback } from "react";
import { useSelector } from "react-redux";
import { URLImage } from "src/components/konva";
import { carMakeAssetURL, legacyCarMakeAssetURL } from "src/helper";
import { useLayer, useScheme } from "src/hooks";
import { RootState } from "src/redux";
import { PaintingGuides } from "src/types/enum";

type PaintingGuideSponsorProps = {
  virtual?: boolean;
  specMode?: boolean;
};

export const PaintingGuideSponsor = React.memo(
  ({ virtual, specMode }: PaintingGuideSponsorProps) => {
    const { legacyMode, guideData } = useScheme();
    const { loadedStatuses, onLoadLayer, onExpandFrameFromImage } = useLayer();
    const id = virtual ? "virtual-guide-sponsorblocks" : "guide-sponsorblocks";

    const carMake = useSelector(
      (state: RootState) => state.carMakeReducer.current
    );
    const paintingGuides = useSelector(
      (state: RootState) => state.boardReducer.paintingGuides
    );

    const getCarMakeImage = useCallback(
      (image: string) =>
        (legacyMode
          ? legacyCarMakeAssetURL(carMake)
          : carMakeAssetURL(carMake)) + image,
      [legacyMode, carMake]
    );

    return (
      <URLImage
        id={id}
        loadedStatus={loadedStatuses[id]}
        src={getCarMakeImage("sponsor_blocks.png")}
        x={0}
        y={0}
        width={legacyMode ? 1024 : 2048}
        height={legacyMode ? 1024 : 2048}
        tellSize={onExpandFrameFromImage}
        filterColor={guideData?.sponsor_color}
        opacity={guideData?.sponsor_opacity}
        listening={false}
        visible={
          !specMode && paintingGuides.includes(PaintingGuides.SPONSORBLOCKS)
        }
        onLoadLayer={onLoadLayer}
      />
    );
  }
);

export default PaintingGuideSponsor;

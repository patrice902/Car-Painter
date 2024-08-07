import React, { useCallback, useMemo } from "react";
import { Line } from "react-konva";
import { useSelector } from "react-redux";
import { URLImage } from "src/components/konva";
import { carMakeAssetURL, legacyCarMakeAssetURL } from "src/helper";
import { useLayer, useScheme } from "src/hooks";
import { RootState } from "src/redux";
import { PaintingGuides } from "src/types/enum";

type PaintingGuideTopProps = {
  virtual?: boolean;
  specMode?: boolean;
};

export const PaintingGuideTop = React.memo(
  ({ virtual, specMode }: PaintingGuideTopProps) => {
    const { legacyMode, guideData } = useScheme();
    const { loadedStatuses, onLoadLayer, onExpandFrameFromImage } = useLayer();
    const wireframeId = virtual ? "virtual-guide-wireframe" : "guide-wireframe";

    const carMake = useSelector(
      (state: RootState) => state.carMakeReducer.current
    );
    const paintingGuides = useSelector(
      (state: RootState) => state.boardReducer.paintingGuides
    );
    const frameSize = useSelector(
      (state: RootState) => state.boardReducer.frameSize
    );

    const gridPadding = useMemo(() => guideData?.grid_padding ?? 10, [
      guideData,
    ]);
    const gridStroke = useMemo(() => guideData?.grid_stroke ?? 1, [guideData]);

    const getCarMakeImage = useCallback(
      (image: string) =>
        (legacyMode
          ? legacyCarMakeAssetURL(carMake)
          : carMakeAssetURL(carMake)) + image,
      [legacyMode, carMake]
    );

    return (
      <>
        <URLImage
          id={wireframeId}
          loadedStatus={loadedStatuses[wireframeId]}
          src={getCarMakeImage("wireframe.png")}
          x={0}
          y={0}
          width={legacyMode ? 1024 : 2048}
          height={legacyMode ? 1024 : 2048}
          tellSize={onExpandFrameFromImage}
          filterColor={guideData?.wireframe_color}
          opacity={guideData?.wireframe_opacity}
          listening={false}
          visible={
            !specMode && paintingGuides.includes(PaintingGuides.WIREFRAME)
          }
          onLoadLayer={!virtual ? onLoadLayer : undefined}
          globalCompositeOperation={
            guideData?.blend_wireframe ? "difference" : null
          }
        />

        {Array.from(
          Array(Math.round(frameSize.width / gridPadding)),
          (e, i) => (
            <Line
              key={`x-${i}`}
              points={[
                Math.round(i * gridPadding),
                0,
                Math.round(i * gridPadding),
                frameSize.width,
              ]}
              stroke={guideData?.grid_color ?? "#ddd"}
              opacity={guideData?.grid_opacity ?? 1}
              strokeWidth={gridStroke}
              listening={false}
              visible={
                !specMode && paintingGuides.includes(PaintingGuides.GRID)
                  ? true
                  : false
              }
            />
          )
        )}
        {Array.from(
          Array(Math.round(frameSize.height / gridPadding)),
          (e, i) => (
            <Line
              key={`y-${i}`}
              points={[
                0,
                Math.round(i * gridPadding),
                frameSize.height,
                Math.round(i * gridPadding),
              ]}
              stroke={guideData?.grid_color ?? "#ddd"}
              opacity={guideData?.grid_opacity ?? 1}
              strokeWidth={gridStroke}
              listening={false}
              visible={
                !specMode && paintingGuides.includes(PaintingGuides.GRID)
                  ? true
                  : false
              }
            />
          )
        )}
      </>
    );
  }
);

export default PaintingGuideTop;

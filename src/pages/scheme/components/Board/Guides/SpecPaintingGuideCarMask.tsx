import React, { useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { URLImage } from "src/components/konva";
import { carMakeAssetURL, legacyCarMakeAssetURL } from "src/helper";
import { useLayer, useScheme } from "src/hooks";
import { RootState } from "src/redux";

type SpecPaintingGuideCarMaskProps = {
  virtual?: boolean;
};

export const SpecPaintingGuideCarMask = React.memo(
  ({ virtual }: SpecPaintingGuideCarMaskProps) => {
    const { schemeFinishBase: finishBase, legacyMode } = useScheme();
    const { loadedStatuses, onLoadLayer, onExpandFrameFromImage } = useLayer();
    const id = `${virtual ? "virtual-" : ""}guide-mask-${finishBase}`;

    const carMake = useSelector(
      (state: RootState) => state.carMakeReducer.current
    );

    const getCarMakeImage = useCallback(
      (image: string) =>
        (legacyMode
          ? legacyCarMakeAssetURL(carMake)
          : carMakeAssetURL(carMake)) + image,
      [legacyMode, carMake]
    );

    const src = useMemo(() => getCarMakeImage(`spec/${finishBase}.png`), [
      finishBase,
      getCarMakeImage,
    ]);

    return (
      <URLImage
        id={id}
        key={id}
        loadedStatus={loadedStatuses[id]}
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
  }
);

export default SpecPaintingGuideCarMask;

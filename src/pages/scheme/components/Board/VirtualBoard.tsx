import { Box } from "@material-ui/core";
import Konva from "konva";
import React, { RefObject, useMemo, useRef } from "react";
import { Group, Layer, Rect, Stage } from "react-konva";
import { Provider, ReactReduxContext, useSelector } from "react-redux";
import { useResizeDetector } from "react-resize-detector";
import { RootState } from "src/redux";
import { LayerTypes, ViewModes } from "src/types/enum";

import { BoardWrapper } from "./Board.style";
import { PaintingGuideCarMask, SpecPaintingGuideCarMask } from "./Guides";
import { BasePaints, CarParts, MovableLayersGroup } from "./Layers";

type BoardProps = {
  stageRef: RefObject<Konva.Stage>;
  baseLayerRef: RefObject<Konva.Group>;
  mainLayerRef: RefObject<Konva.Group>;
  carMakeLayerRef: RefObject<Konva.Group>;
  carMaskLayerRef: RefObject<Konva.Group>;
};

export const VirtualBoard = React.memo(
  ({
    stageRef,
    baseLayerRef,
    mainLayerRef,
    carMaskLayerRef,
    carMakeLayerRef,
  }: BoardProps) => {
    const mainGroupRef = useRef<Konva.Group>(null);

    const frameSize = useSelector(
      (state: RootState) => state.boardReducer.frameSize
    );
    const viewMode = useSelector(
      (state: RootState) => state.boardReducer.viewMode
    );
    const currentScheme = useSelector(
      (state: RootState) => state.schemeReducer.current
    );

    const specMode = useMemo(() => viewMode === ViewModes.SPEC_VIEW, [
      viewMode,
    ]);

    const {
      width: wrapperWidth,
      height: wrapperHeight,
      ref: wrapperRef,
    } = useResizeDetector();

    if (!currentScheme) return <></>;

    return (
      <Box width="100%" height="100%" position="absolute" visibility="hidden">
        <BoardWrapper id="virutal-board-wrapper" ref={wrapperRef}>
          <ReactReduxContext.Consumer>
            {({ store }) => (
              <Stage
                width={wrapperWidth}
                height={wrapperHeight}
                ref={stageRef}
                listening={false}
              >
                <Provider store={store}>
                  <Layer>
                    <Group ref={mainGroupRef}>
                      <Group ref={baseLayerRef}>
                        {/* Background */}
                        <Rect
                          x={0}
                          y={0}
                          width={frameSize.width}
                          height={frameSize.height}
                          fill={
                            currentScheme.base_color === "transparent"
                              ? currentScheme.base_color
                              : "#" + currentScheme.base_color
                          }
                        />
                        {specMode && <SpecPaintingGuideCarMask virtual />}
                        <BasePaints virtual specMode={specMode} />
                      </Group>

                      <Group ref={mainLayerRef}>
                        {!currentScheme.guide_data.show_carparts_on_top ? (
                          <Group ref={carMakeLayerRef}>
                            <CarParts virtual specMode={specMode} />
                          </Group>
                        ) : (
                          <></>
                        )}

                        {currentScheme.merge_layers ? (
                          <MovableLayersGroup
                            allowedLayerTypes={[
                              LayerTypes.OVERLAY,
                              LayerTypes.LOGO,
                              LayerTypes.UPLOAD,
                              LayerTypes.SHAPE,
                              LayerTypes.TEXT,
                            ]}
                            stageRef={stageRef}
                            specMode={specMode}
                            virtual
                          />
                        ) : (
                          <>
                            <MovableLayersGroup
                              allowedLayerTypes={[LayerTypes.OVERLAY]}
                              stageRef={stageRef}
                              specMode={specMode}
                              virtual
                            />

                            <MovableLayersGroup
                              allowedLayerTypes={[LayerTypes.SHAPE]}
                              stageRef={stageRef}
                              specMode={specMode}
                              virtual
                            />

                            <MovableLayersGroup
                              allowedLayerTypes={[
                                LayerTypes.LOGO,
                                LayerTypes.UPLOAD,
                                LayerTypes.TEXT,
                              ]}
                              stageRef={stageRef}
                              specMode={specMode}
                              virtual
                            />
                          </>
                        )}

                        {currentScheme.guide_data.show_carparts_on_top ? (
                          <Group ref={carMakeLayerRef}>
                            <CarParts virtual specMode={specMode} />
                          </Group>
                        ) : (
                          <></>
                        )}
                      </Group>

                      <Group ref={carMaskLayerRef}>
                        <PaintingGuideCarMask virtual specMode={specMode} />
                      </Group>
                    </Group>
                  </Layer>
                </Provider>
              </Stage>
            )}
          </ReactReduxContext.Consumer>
        </BoardWrapper>
      </Box>
    );
  }
);

export default VirtualBoard;

import { Box } from "@material-ui/core";
import Konva from "konva";
import React, { RefObject, useCallback, useRef, useState } from "react";
import { Group, Layer, Rect, Shape, Stage } from "react-konva";
import { Provider, ReactReduxContext, useSelector } from "react-redux";
import { useResizeDetector } from "react-resize-detector";
import { ScreenLoader } from "src/components/common";
import { BoardContextMenu } from "src/components/dialogs";
import { TransformerComponent } from "src/components/konva";
import { useDrawHelper, useZoom } from "src/hooks";
import { RootState } from "src/redux";
import { MovableObjLayerData } from "src/types/common";
import { MouseModes, ViewModes } from "src/types/enum";
import { BuilderLayerJSON } from "src/types/query";

import { BoardWrapper } from "./Board.style";
import {
  PaintingGuideCarMask,
  PaintingGuideNumber,
  PaintingGuideSponsor,
  PaintingGuideTop,
  SpecPaintingGuideCarMask,
} from "./Guides";
import {
  BasePaints,
  CarParts,
  LogosAndTexts,
  Overlays,
  Shapes,
} from "./Layers";

type BoardProps = {
  hoveredLayerJSON: Record<string | number, boolean>;
  stageRef: RefObject<Konva.Stage>;
  editable: boolean;
  onChangeHoverJSONItem: (layerId: number, flag: boolean) => void;
  baseLayerRef: RefObject<Konva.Group>;
  mainLayerRef: RefObject<Konva.Group>;
  carMaskLayerRef: RefObject<Konva.Group>;
  activeTransformerRef: RefObject<Konva.Transformer>;
  hoveredTransformerRef: RefObject<Konva.Transformer>;
  setTransformingLayer: (
    layer: BuilderLayerJSON<MovableObjLayerData> | null
  ) => void;
  onDeleteLayer: (layer: BuilderLayerJSON) => void;
  onCloneLayer: (
    layer: BuilderLayerJSON,
    samePosition?: boolean,
    pushingToHistory?: boolean
  ) => void;
};

export const Board = React.memo(
  ({
    hoveredLayerJSON,
    editable,
    onChangeHoverJSONItem,
    stageRef,
    baseLayerRef,
    mainLayerRef,
    carMaskLayerRef,
    activeTransformerRef,
    hoveredTransformerRef,
    setTransformingLayer,
    onDeleteLayer,
    onCloneLayer,
  }: BoardProps) => {
    const {
      drawingLayerRef,
      onMouseDown,
      onContentMouseup,
      onContentMousemove,
      onContentMouseDown,
      onDoubleClick,
      onDragEnd,
      onContextMenu,
      onLayerDragStart,
      onLayerDragEnd,
      onTouchStart,
      onTouchMove,
      onTouchEnd,
      onTap,
      onDbltap,
    } = useDrawHelper(stageRef);
    const { zoom, onWheel } = useZoom(stageRef);
    const mainGroupRef = useRef<Konva.Group>(null);

    const frameSize = useSelector(
      (state: RootState) => state.boardReducer.frameSize
    );
    const boardRotate = useSelector(
      (state: RootState) => state.boardReducer.boardRotate
    );
    const mouseMode = useSelector(
      (state: RootState) => state.boardReducer.mouseMode
    );
    const viewMode = useSelector(
      (state: RootState) => state.boardReducer.viewMode
    );
    const isDraggable = useSelector(
      (state: RootState) => state.boardReducer.isDraggable
    );
    const currentScheme = useSelector(
      (state: RootState) => state.schemeReducer.current
    );
    const schemeSaving = useSelector(
      (state: RootState) => state.schemeReducer.saving
    );
    const schemeLoaded = useSelector(
      (state: RootState) => state.schemeReducer.loaded
    );
    const layerList = useSelector(
      (state: RootState) => state.layerReducer.list
    );
    const currentLayer = useSelector(
      (state: RootState) => state.layerReducer.current
    );

    const [wrapperPosition, setWrapperPosition] = useState({ x: 0, y: 56 });
    const {
      width: wrapperWidth,
      height: wrapperHeight,
      ref: wrapperRef,
    } = useResizeDetector({
      onResize: () => {
        const boundingRect = wrapperRef.current.getBoundingClientRect();
        setWrapperPosition({ x: boundingRect.x, y: boundingRect.y });
      },
    });

    const handleHoverLayer = useCallback(
      (layer: BuilderLayerJSON, flag: boolean) => {
        onChangeHoverJSONItem(layer.id, flag);
      },
      [onChangeHoverJSONItem]
    );

    if (!currentScheme) return <></>;

    return (
      <Box width="100%" height="calc(100% - 50px)" position="relative">
        <BoardWrapper id="board-wrapper" ref={wrapperRef}>
          <ReactReduxContext.Consumer>
            {({ store }) => (
              <Stage
                width={wrapperWidth}
                height={wrapperHeight}
                onMousedown={onMouseDown}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
                onContentMousedown={onContentMouseDown}
                onContentMousemove={onContentMousemove}
                onContentMouseup={onContentMouseup}
                onContextMenu={onContextMenu}
                onDblClick={onDoubleClick}
                onTap={onTap}
                onDbltap={onDbltap}
                onWheel={onWheel}
                scaleX={zoom || 1}
                scaleY={zoom || 1}
                rotation={boardRotate}
                x={(wrapperWidth ?? 0) / 2}
                y={(wrapperHeight ?? 0) / 2}
                offsetX={frameSize.width / 2}
                offsetY={frameSize.height / 2}
                ref={stageRef}
                draggable={mouseMode === MouseModes.DEFAULT && isDraggable}
                onDragEnd={onDragEnd}
                style={{
                  cursor:
                    mouseMode === MouseModes.DEFAULT ? "default" : "crosshair",
                }}
                hitOnDragEnabled
              >
                <Provider store={store}>
                  <Layer>
                    <Group ref={mainGroupRef}>
                      <Group ref={baseLayerRef} listening={false}>
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
                          listening={false}
                        />
                        {viewMode === ViewModes.SPEC_VIEW && (
                          <SpecPaintingGuideCarMask />
                        )}
                        <BasePaints />
                      </Group>
                      {!currentScheme.guide_data.show_sponsor_block_on_top ||
                      !currentScheme.guide_data.show_number_block_on_top ? (
                        <Group listening={false}>
                          {!currentScheme.guide_data
                            .show_sponsor_block_on_top ? (
                            <PaintingGuideSponsor />
                          ) : (
                            <></>
                          )}
                          {!currentScheme.guide_data
                            .show_number_block_on_top ? (
                            <PaintingGuideNumber />
                          ) : (
                            <></>
                          )}
                        </Group>
                      ) : (
                        <></>
                      )}

                      <Group ref={mainLayerRef}>
                        {!currentScheme.guide_data.show_carparts_on_top ? (
                          <CarParts />
                        ) : (
                          <></>
                        )}

                        <Overlays
                          stageRef={stageRef}
                          editable={editable}
                          onHover={handleHoverLayer}
                          onLayerDragStart={onLayerDragStart}
                          onLayerDragEnd={onLayerDragEnd}
                          onSetTransformingLayer={setTransformingLayer}
                        />
                        <Shapes
                          stageRef={stageRef}
                          editable={editable}
                          drawingLayer={drawingLayerRef.current}
                          onHover={handleHoverLayer}
                          onLayerDragStart={onLayerDragStart}
                          onLayerDragEnd={onLayerDragEnd}
                          onSetTransformingLayer={setTransformingLayer}
                        />
                        <LogosAndTexts
                          stageRef={stageRef}
                          editable={editable}
                          onHover={handleHoverLayer}
                          onLayerDragStart={onLayerDragStart}
                          onLayerDragEnd={onLayerDragEnd}
                          onSetTransformingLayer={setTransformingLayer}
                        />
                        {currentScheme.guide_data.show_carparts_on_top ? (
                          <CarParts />
                        ) : (
                          <></>
                        )}
                      </Group>

                      <Group ref={carMaskLayerRef} listening={false}>
                        <PaintingGuideCarMask />
                      </Group>
                      {currentScheme.guide_data.show_sponsor_block_on_top ||
                      currentScheme.guide_data.show_number_block_on_top ? (
                        <Group listening={false}>
                          {currentScheme.guide_data
                            .show_sponsor_block_on_top ? (
                            <PaintingGuideSponsor />
                          ) : (
                            <></>
                          )}
                          {currentScheme.guide_data.show_number_block_on_top ? (
                            <PaintingGuideNumber />
                          ) : (
                            <></>
                          )}
                        </Group>
                      ) : (
                        <></>
                      )}
                      <Group name="layer-guide-top" listening={false}>
                        <PaintingGuideTop />
                      </Group>
                    </Group>
                  </Layer>
                  <Layer>
                    {/* Clipping/Transforming Layer */}
                    <Shape
                      x={-frameSize.width}
                      y={-frameSize.height}
                      width={frameSize.width * 3}
                      height={frameSize.height * 3}
                      sceneFunc={(ctx) => {
                        // draw background
                        ctx._context.fillStyle = "rgba(40, 40, 40, 0.7)";
                        ctx.fillRect(
                          0,
                          0,
                          frameSize.width * 3,
                          frameSize.height * 3
                        );

                        // @ts-ignore
                        ctx.globalCompositeOperation = "destination-out";
                        ctx._context.fillStyle = "black";
                        ctx.fillRect(
                          frameSize.width,
                          frameSize.height,
                          frameSize.width,
                          frameSize.height
                        );
                      }}
                      listening={false}
                    />

                    {editable ? (
                      <TransformerComponent
                        trRef={activeTransformerRef}
                        selectedLayer={
                          currentLayer as BuilderLayerJSON<MovableObjLayerData>
                        }
                      />
                    ) : (
                      <></>
                    )}

                    {hoveredLayerJSON &&
                    (!currentLayer ||
                      !hoveredLayerJSON[currentLayer.id] ||
                      !editable) ? (
                      <TransformerComponent
                        trRef={hoveredTransformerRef}
                        selectedLayer={
                          layerList.find(
                            (item) => hoveredLayerJSON[item.id]
                          ) as BuilderLayerJSON<MovableObjLayerData>
                        }
                        hoveredTransform={true}
                      />
                    ) : (
                      <></>
                    )}
                  </Layer>
                </Provider>
              </Stage>
            )}
          </ReactReduxContext.Consumer>
          <BoardContextMenu
            stageRef={stageRef}
            wrapperPosition={wrapperPosition}
            onDeleteLayer={onDeleteLayer}
            onCloneLayer={onCloneLayer}
          />
        </BoardWrapper>
        {schemeSaving || !schemeLoaded ? (
          <Box
            width="100%"
            height="100%"
            bgcolor="#282828"
            position="absolute"
            left="0"
            top="0"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <ScreenLoader />
          </Box>
        ) : (
          <></>
        )}
      </Box>
    );
  }
);

export default Board;

import React, { useCallback, useState } from "react";
import { Stage, Layer, Rect, Shape, Group } from "react-konva";
import { useSelector, ReactReduxContext, Provider } from "react-redux";
import { useResizeDetector } from "react-resize-detector";

import { MouseModes, ViewModes } from "constant";

import { Box } from "@material-ui/core";
import { ScreenLoader } from "components/common";
import {
  PaintingGuideTop,
  PaintingGuideCarMask,
  PaintingGuideNumber,
  PaintingGuideSponsor,
  SpecPaintingGuideCarMask,
} from "./Guides";
import {
  BasePaints,
  CarParts,
  Overlays,
  LogosAndTexts,
  Shapes,
} from "./Layers";
import { TransformerComponent } from "components/konva";

import { useDrawHelper, useZoom, useTouch } from "hooks";
import { BoardContextMenu } from "components/dialogs";

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
  }) => {
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
    } = useDrawHelper(stageRef);
    const { onTouchStart, onTouchMove, onTouchEnd } = useTouch(stageRef);
    const { zoom, onWheelZoom } = useZoom(stageRef);

    const frameSize = useSelector((state) => state.boardReducer.frameSize);
    const boardRotate = useSelector((state) => state.boardReducer.boardRotate);
    const mouseMode = useSelector((state) => state.boardReducer.mouseMode);
    const viewMode = useSelector((state) => state.boardReducer.viewMode);
    const isDraggable = useSelector((state) => state.boardReducer.isDraggable);
    const currentScheme = useSelector((state) => state.schemeReducer.current);
    const schemeSaving = useSelector((state) => state.schemeReducer.saving);
    const schemeLoaded = useSelector((state) => state.schemeReducer.loaded);
    const layerList = useSelector((state) => state.layerReducer.list);
    const currentLayer = useSelector((state) => state.layerReducer.current);

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
      (layer, flag) => {
        onChangeHoverJSONItem(layer.id, flag);
      },
      [onChangeHoverJSONItem]
    );

    return (
      <Box width="100%" height="calc(100% - 50px)" position="relative">
        <Box
          width="100%"
          height="100%"
          display="flex"
          justifyContent="center"
          flexDirection="column"
          alignItems="center"
          margin="auto"
          id="board-wrapper"
          position="relative"
          ref={wrapperRef}
        >
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
                onWheel={onWheelZoom}
                scaleX={zoom || 1}
                scaleY={zoom || 1}
                rotation={boardRotate}
                x={wrapperWidth / 2 || 0}
                y={wrapperHeight / 2 || 0}
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
                        {!currentScheme.guide_data.show_sponsor_block_on_top ? (
                          <PaintingGuideSponsor />
                        ) : (
                          <></>
                        )}
                        {!currentScheme.guide_data.show_number_block_on_top ? (
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
                        {currentScheme.guide_data.show_sponsor_block_on_top ? (
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
                        ctx.fillStyle = "rgba(40, 40, 40, 0.7)";
                        ctx.fillRect(
                          0,
                          0,
                          frameSize.width * 3,
                          frameSize.height * 3
                        );

                        ctx.globalCompositeOperation = "destination-out";
                        ctx.fillStyle = "black";
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
                        selectedLayer={currentLayer}
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
                        selectedLayer={layerList.find(
                          (item) => hoveredLayerJSON[item.id]
                        )}
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
        </Box>
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

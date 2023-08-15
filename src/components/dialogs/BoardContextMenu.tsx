import { Box, Button, Divider, Popover, Typography } from "@material-ui/core";
import { Stage } from "konva/types/Stage";
import React, { RefObject, useCallback } from "react";
import { ImCopy } from "react-icons/im";
import {
  MdDelete,
  MdLock,
  MdRotateRight,
  MdSwapHoriz,
  MdSwapVert,
  MdVisibilityOff,
} from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import {
  decodeHtml,
  focusBoardQuickly,
  isCenterBasedShape,
  rotateAroundCenter,
} from "src/helper";
import { RootState } from "src/redux";
import { setContextMenu } from "src/redux/reducers/boardReducer";
import { updateLayer } from "src/redux/reducers/layerReducer";
import {
  MovableObjLayerData,
  Position,
  ShapeBaseObjLayerData,
} from "src/types/common";
import { BuilderLayerJSON } from "src/types/query";
import styled from "styled-components";

type BoardContextMenuProps = {
  stageRef: RefObject<Stage | undefined>;
  wrapperPosition: Position;
  onDeleteLayer: (layer: BuilderLayerJSON) => void;
  onCloneLayer: (
    layer: BuilderLayerJSON,
    samePosition?: boolean,
    pushingToHistory?: boolean
  ) => void;
};

export const BoardContextMenu = React.memo((props: BoardContextMenuProps) => {
  const { stageRef, wrapperPosition, onDeleteLayer, onCloneLayer } = props;

  const dispatch = useDispatch();
  const contextMenu = useSelector(
    (state: RootState) => state.boardReducer.contextMenu
  );
  const currentLayer = useSelector(
    (state: RootState) => state.layerReducer.current
  );

  const handleClose = useCallback(() => {
    dispatch(setContextMenu(null));
  }, [dispatch]);

  const toggleField = useCallback(
    (field: string) => {
      handleClose();
      if (!currentLayer) return;

      dispatch(
        updateLayer({
          id: currentLayer.id,
          [field]: currentLayer[field as keyof BuilderLayerJSON] ? 0 : 1,
        })
      );
      focusBoardQuickly();
    },
    [dispatch, currentLayer, handleClose]
  );

  const handleDelete = useCallback(() => {
    handleClose();
    if (currentLayer) onDeleteLayer(currentLayer);
  }, [currentLayer, onDeleteLayer, handleClose]);

  const handleClone = useCallback(() => {
    handleClose();
    if (currentLayer) onCloneLayer(currentLayer);
  }, [currentLayer, onCloneLayer, handleClose]);

  const handleRotate90 = useCallback(() => {
    handleClose();

    if (!currentLayer || !stageRef.current) return;

    const stage = stageRef.current;
    const selectedNode = stage.findOne("." + currentLayer.id);
    let value = selectedNode.rotation() + 90;

    if (value <= -180) value += 360;
    else if (value >= 180) value -= 360;

    if (
      !isCenterBasedShape(
        (currentLayer.layer_data as ShapeBaseObjLayerData).type
      )
    ) {
      const newRot = (value / 180) * Math.PI;
      const boundBox = {
        x: selectedNode.x(),
        y: selectedNode.y(),
        width: selectedNode.width(),
        height: selectedNode.height(),
        rotation: (selectedNode.rotation() / 180) * Math.PI,
      };

      const newBoundBox = rotateAroundCenter(
        boundBox,
        newRot - boundBox.rotation
      );
      dispatch(
        updateLayer({
          id: currentLayer.id,
          layer_data: {
            ...currentLayer.layer_data,
            left: newBoundBox.x,
            top: newBoundBox.y,
            rotation: value,
          },
        } as Partial<BuilderLayerJSON<MovableObjLayerData>>)
      );
    } else {
      dispatch(
        updateLayer({
          id: currentLayer.id,
          layer_data: {
            ...currentLayer.layer_data,
            rotation: value,
          },
        } as Partial<BuilderLayerJSON<MovableObjLayerData>>)
      );
    }
  }, [currentLayer, dispatch, stageRef, handleClose]);

  const handleToggleFlop = useCallback(() => {
    handleClose();

    if (!currentLayer || !stageRef.current) return;

    const currentMovableLayerData = currentLayer.layer_data as MovableObjLayerData;

    const newFlop = currentMovableLayerData.flop ? 0 : 1;
    const rot = (currentMovableLayerData.rotation / 180) * Math.PI;
    const node = stageRef.current.find(`.${currentLayer.id}`)[0];
    const width =
      currentMovableLayerData.width ||
      (node &&
        node.getClientRect({
          relativeTo: node.getParent().getParent(),
          skipShadow: true,
        }).width);
    dispatch(
      updateLayer({
        id: currentLayer.id,
        layer_data: {
          ...currentMovableLayerData,
          left:
            currentMovableLayerData.left +
            (newFlop ? 1 : -1) * Math.cos(rot) * width,
          top:
            currentMovableLayerData.top +
            (newFlop ? 1 : -1) * Math.sin(rot) * width,
          flop: newFlop,
        },
      } as Partial<BuilderLayerJSON<MovableObjLayerData>>)
    );
  }, [currentLayer, dispatch, stageRef, handleClose]);

  const handleToggleFlip = useCallback(() => {
    handleClose();

    if (!currentLayer || !stageRef.current) return;

    const currentMovableLayerData = currentLayer.layer_data as MovableObjLayerData;

    const newFlip = currentMovableLayerData.flip ? 0 : 1;
    const rot = (currentMovableLayerData.rotation / 180) * Math.PI;
    const node = stageRef.current.find(`.${currentLayer.id}`)[0];
    const height =
      currentMovableLayerData.height ||
      (node &&
        node.getClientRect({
          relativeTo: node.getParent().getParent(),
          skipShadow: true,
        }).height);
    dispatch(
      updateLayer({
        id: currentLayer.id,
        layer_data: {
          ...currentMovableLayerData,
          left:
            currentMovableLayerData.left +
            (newFlip ? -1 : 1) * Math.sin(rot) * height,
          top:
            currentMovableLayerData.top +
            (newFlip ? 1 : -1) * Math.cos(rot) * height,
          flip: newFlip,
        },
      } as Partial<BuilderLayerJSON<MovableObjLayerData>>)
    );
  }, [currentLayer, dispatch, stageRef, handleClose]);

  if (!contextMenu || !currentLayer) {
    return <></>;
  }

  return (
    <Popover
      open={!!contextMenu}
      onClose={handleClose}
      anchorReference="anchorPosition"
      anchorPosition={{
        top: contextMenu.y + wrapperPosition.y,
        left: contextMenu.x + wrapperPosition.x,
      }}
    >
      <Box display="flex" flexDirection="column" px={4} py={2} width="180px">
        <NameItem>{decodeHtml(currentLayer.layer_data.name)}</NameItem>
        <StyledButton
          startIcon={<MdVisibilityOff />}
          onClick={() => toggleField("layer_visible")}
        >
          Hide
        </StyledButton>
        <StyledButton startIcon={<ImCopy />} onClick={handleClone}>
          Duplicate
        </StyledButton>
        <StyledButton startIcon={<MdRotateRight />} onClick={handleRotate90}>
          Rotate 90°
        </StyledButton>
        <StyledButton startIcon={<MdSwapHoriz />} onClick={handleToggleFlop}>
          Flop
        </StyledButton>
        <StyledButton startIcon={<MdSwapVert />} onClick={handleToggleFlip}>
          Flip
        </StyledButton>
        <StyledButton
          startIcon={<MdLock />}
          onClick={() => toggleField("layer_locked")}
        >
          Lock
        </StyledButton>
        <StyledDivider />
        <StyledButton startIcon={<MdDelete />} onClick={handleDelete}>
          Delete
        </StyledButton>
      </Box>
    </Popover>
  );
});

const StyledDivider = styled(Divider)`
  margin: 8px 0;
`;

const NameItem = styled(Typography)`
  font-size: 12px;
  font-family: AkkuratMonoLLWeb-Regular;
  font-weight: 500;
  color: lightgray;
  padding: 4px 0;
`;

const StyledButton = styled(Button)`
  font-size: 1rem;
  justify-content: start;
`;

export default BoardContextMenu;

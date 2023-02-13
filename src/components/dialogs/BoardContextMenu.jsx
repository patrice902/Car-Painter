import {
  Box,
  Button,
  Divider,
  Popover,
  Typography,
} from "components/MaterialUI";
import {
  focusBoardQuickly,
  isCenterBasedShape,
  rotateAroundCenter,
} from "helper";
import React, { useCallback } from "react";
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
import { setContextMenu } from "redux/reducers/boardReducer";
import { updateLayer } from "redux/reducers/layerReducer";
import styled from "styled-components";

export const BoardContextMenu = React.memo((props) => {
  const { stageRef, wrapperPosition, onDeleteLayer, onCloneLayer } = props;

  const dispatch = useDispatch();
  const contextMenu = useSelector((state) => state.boardReducer.contextMenu);
  const currentLayer = useSelector((state) => state.layerReducer.current);

  const handleClose = useCallback(() => {
    dispatch(setContextMenu(null));
  }, [dispatch]);

  const toggleField = useCallback(
    (field) => {
      handleClose();
      dispatch(
        updateLayer({
          id: currentLayer.id,
          [field]: currentLayer[field] ? 0 : 1,
        })
      );
      focusBoardQuickly();
    },
    [dispatch, currentLayer, handleClose]
  );

  const handleDelete = useCallback(() => {
    handleClose();
    onDeleteLayer(currentLayer);
  }, [currentLayer, onDeleteLayer, handleClose]);

  const handleClone = useCallback(() => {
    handleClose();
    onCloneLayer(currentLayer);
  }, [currentLayer, onCloneLayer, handleClose]);

  const handleRotate90 = useCallback(() => {
    const stage = stageRef.current;
    const selectedNode = stage.findOne("." + currentLayer.id);
    let value = selectedNode.rotation() + 90;

    handleClose();

    if (value <= -180) value += 360;
    else if (value >= 180) value -= 360;
    if (!isCenterBasedShape(currentLayer.layer_data.type)) {
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
        })
      );
    } else {
      dispatch(
        updateLayer({
          id: currentLayer.id,
          layer_data: {
            ...currentLayer.layer_data,
            rotation: value,
          },
        })
      );
    }
  }, [currentLayer, dispatch, stageRef, handleClose]);

  const handleToggleFlop = useCallback(() => {
    handleClose();
    const newFlop = currentLayer.layer_data.flop ? 0 : 1;
    const rot = (currentLayer.layer_data.rotation / 180) * Math.PI;
    const node = stageRef.current.find(`.${currentLayer.id}`)[0];
    const width =
      currentLayer.layer_data.width ||
      (node &&
        node.getClientRect({
          relativeTo: node.getParent().getParent(),
          skipShadow: true,
        }).width);
    dispatch(
      updateLayer({
        id: currentLayer.id,
        layer_data: {
          ...currentLayer.layer_data,
          left:
            currentLayer.layer_data.left +
            (newFlop ? 1 : -1) * Math.cos(rot) * width,
          top:
            currentLayer.layer_data.top +
            (newFlop ? 1 : -1) * Math.sin(rot) * width,
          flop: newFlop,
        },
      })
    );
  }, [currentLayer, dispatch, stageRef, handleClose]);

  const handleToggleFlip = useCallback(() => {
    handleClose();
    const newFlip = currentLayer.layer_data.flip ? 0 : 1;
    const rot = (currentLayer.layer_data.rotation / 180) * Math.PI;
    const node = stageRef.current.find(`.${currentLayer.id}`)[0];
    const height =
      currentLayer.layer_data.height ||
      (node &&
        node.getClientRect({
          relativeTo: node.getParent().getParent(),
          skipShadow: true,
        }).height);
    dispatch(
      updateLayer({
        id: currentLayer.id,
        layer_data: {
          ...currentLayer.layer_data,
          left:
            currentLayer.layer_data.left +
            (newFlip ? -1 : 1) * Math.sin(rot) * height,
          top:
            currentLayer.layer_data.top +
            (newFlip ? 1 : -1) * Math.cos(rot) * height,
          flip: newFlip,
        },
      })
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
        <NameItem>{currentLayer.layer_data.name}</NameItem>
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

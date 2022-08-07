import React, { useState, useMemo, useCallback } from "react";

import { AllowedLayerProps, LayerTypes } from "constant";
import { useDebouncedCallback } from "use-debounce";
import {
  rotateAroundCenter,
  isCenterBasedShape,
  focusBoardQuickly,
} from "helper";

import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
} from "@material-ui/core";
import {
  ExpandMore as ExpandMoreIcon,
  SwapHoriz as SwapHorizIcon,
  SwapVert as SwapVertIcon,
  RotateLeft as RotateLeftIcon,
  RotateRight as RotateRightIcon,
} from "@material-ui/icons";
import { faSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SliderInput } from "components/common";
import { LabelTypography } from "../../../PropertyBar.style";

export const RotationProperty = React.memo((props) => {
  const {
    editable,
    stageRef,
    currentLayer,
    values,
    setMultiFieldValue,
    onLayerDataMultiUpdate,
  } = props;
  const layerDataProperties = ["rotation", "flip", "flop"];
  const [expanded, setExpanded] = useState(true);
  const AllowedLayerTypes = useMemo(
    () =>
      !values.layer_type
        ? []
        : values.layer_type !== LayerTypes.SHAPE
        ? AllowedLayerProps[values.layer_type]
        : AllowedLayerProps[values.layer_type][values.layer_data.type],
    [values]
  );

  const handleChangeRotationDebounced = useDebouncedCallback(
    (value) => onLayerDataMultiUpdate(value),
    1000
  );

  const handleChangeRotation = useCallback(
    (value) => {
      let updatingMap = {
        rotation: value,
      };

      if (!isCenterBasedShape(currentLayer.layer_data.type)) {
        const stage = stageRef.current;
        const selectedNode = stage.findOne("." + currentLayer.id);
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
        updatingMap.left = newBoundBox.x;
        updatingMap.top = newBoundBox.y;
      }
      setMultiFieldValue(updatingMap);
      handleChangeRotationDebounced(updatingMap);
    },
    [currentLayer, handleChangeRotationDebounced, setMultiFieldValue, stageRef]
  );

  const handleRotate90Debounced = useDebouncedCallback(
    (value) => onLayerDataMultiUpdate(value),
    1000
  );

  const handleRotate90 = useCallback(
    (isLeft = true) => {
      const stage = stageRef.current;
      const selectedNode = stage.findOne("." + currentLayer.id);
      let value = selectedNode.rotation() + (isLeft ? -90 : 90);
      if (value <= -180) value += 360;
      else if (value >= 180) value -= 360;

      let updatingMap = {
        rotation: value,
      };

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
        updatingMap.left = newBoundBox.x;
        updatingMap.top = newBoundBox.y;
      }

      setMultiFieldValue(updatingMap);
      handleRotate90Debounced(updatingMap);
    },
    [currentLayer, handleRotate90Debounced, setMultiFieldValue, stageRef]
  );

  const handleToggleFlopDebounced = useDebouncedCallback(
    (value) => onLayerDataMultiUpdate(value),
    1000
  );

  const handleToggleFlop = useCallback(() => {
    const newFlop = values.layer_data.flop ? 0 : 1;
    const rot = (values.layer_data.rotation / 180) * Math.PI;
    const node = stageRef.current.find(`.${currentLayer.id}`)[0];
    const width =
      values.layer_data.width ||
      (node &&
        node.getClientRect({
          relativeTo: node.getParent().getParent(),
          skipShadow: true,
        }).width);
    const updatingMap = {
      left: values.layer_data.left + (newFlop ? 1 : -1) * Math.cos(rot) * width,
      top: values.layer_data.top + (newFlop ? 1 : -1) * Math.sin(rot) * width,
      flop: newFlop,
    };
    onLayerDataMultiUpdate(updatingMap);
    handleToggleFlopDebounced(updatingMap);
  }, [
    currentLayer,
    onLayerDataMultiUpdate,
    handleToggleFlopDebounced,
    stageRef,
    values,
  ]);

  const handleToggleFlipDebounced = useDebouncedCallback(
    (value) => onLayerDataMultiUpdate(value),
    1000
  );

  const handleToggleFlip = useCallback(() => {
    const newFlip = values.layer_data.flip ? 0 : 1;
    const rot = (values.layer_data.rotation / 180) * Math.PI;
    const node = stageRef.current.find(`.${currentLayer.id}`)[0];
    const height =
      values.layer_data.height ||
      (node &&
        node.getClientRect({
          relativeTo: node.getParent().getParent(),
          skipShadow: true,
        }).height);
    const updatingMap = {
      left:
        values.layer_data.left + (newFlip ? -1 : 1) * Math.sin(rot) * height,
      top: values.layer_data.top + (newFlip ? 1 : -1) * Math.cos(rot) * height,
      flip: newFlip,
    };
    onLayerDataMultiUpdate(updatingMap);
    handleToggleFlipDebounced(updatingMap);
  }, [
    currentLayer,
    handleToggleFlipDebounced,
    onLayerDataMultiUpdate,
    stageRef,
    values,
  ]);

  if (
    !AllowedLayerTypes ||
    layerDataProperties.every(
      (value) => !AllowedLayerTypes.includes("layer_data." + value)
    )
  )
    return <></>;
  return (
    <Accordion
      expanded={expanded}
      onChange={() => {
        setExpanded(!expanded);
        focusBoardQuickly();
      }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="subtitle1">Rotation</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box display="flex" flexDirection="column" width="100%">
          {AllowedLayerTypes.includes("layer_data.rotation") ? (
            <>
              <Box display="flex" height="40px" alignItems="center">
                <SliderInput
                  label="Rotation"
                  min={-179}
                  max={179}
                  value={Math.round(values.layer_data.rotation)}
                  disabled={!editable}
                  setValue={handleChangeRotation}
                  small
                />
              </Box>
              <Box
                display="flex"
                alignItems="center"
                flexDirection="row"
                justifyContent="space-between"
                height="40px"
              >
                <LabelTypography variant="body1" color="textSecondary" mr={2}>
                  Rotate Left
                </LabelTypography>
                <IconButton
                  disabled={!editable}
                  onClick={() => handleRotate90()}
                  size="small"
                >
                  <RotateLeftIcon />
                </IconButton>
              </Box>
              <Box
                display="flex"
                alignItems="center"
                flexDirection="row"
                justifyContent="space-between"
                height="40px"
              >
                <LabelTypography variant="body1" color="textSecondary" mr={2}>
                  Rotate Right
                </LabelTypography>
                <IconButton
                  disabled={!editable}
                  onClick={() => handleRotate90(false)}
                  size="small"
                >
                  <RotateRightIcon />
                </IconButton>
              </Box>
            </>
          ) : (
            <></>
          )}
          {AllowedLayerTypes.includes("layer_data.flop") ? (
            <Box
              display="flex"
              alignItems="center"
              flexDirection="row"
              justifyContent="space-between"
              height="40px"
            >
              <LabelTypography variant="body1" color="textSecondary" mr={2}>
                Flop
              </LabelTypography>
              <IconButton
                disabled={!editable}
                onClick={handleToggleFlop}
                size="small"
              >
                {values.layer_data.flop ? (
                  <SwapHorizIcon />
                ) : (
                  <>
                    <SwapHorizIcon />
                    <Box position="absolute" left="4px" top="5px">
                      <FontAwesomeIcon icon={faSlash} size="sm" />
                    </Box>
                  </>
                )}
              </IconButton>
            </Box>
          ) : (
            <></>
          )}
          {AllowedLayerTypes.includes("layer_data.flip") ? (
            <Box
              display="flex"
              alignItems="center"
              flexDirection="row"
              justifyContent="space-between"
              height="40px"
            >
              <LabelTypography variant="body1" color="textSecondary" mr={2}>
                Flip
              </LabelTypography>
              <IconButton
                disabled={!editable}
                onClick={handleToggleFlip}
                size="small"
              >
                {values.layer_data.flip ? (
                  <SwapVertIcon />
                ) : (
                  <>
                    <SwapVertIcon />
                    <Box position="absolute" left="4px" top="5px">
                      <FontAwesomeIcon icon={faSlash} size="sm" />
                    </Box>
                  </>
                )}
              </IconButton>
            </Box>
          ) : (
            <></>
          )}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
});

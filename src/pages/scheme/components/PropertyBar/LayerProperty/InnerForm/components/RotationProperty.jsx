import React, { useState, useMemo, useCallback } from "react";

import { AllowedLayerProps, LayerTypes } from "constant";
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
import { LabelTypography } from "../../../PropertyBar.style";
import { FormIconButton, FormSliderInput } from "../../../components";

export const RotationProperty = React.memo((props) => {
  const {
    editable,
    stageRef,
    currentLayer,
    values,
    onLayerDataUpdate,
    onLayerDataUpdateOnly,
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

  const rotationMapFunc = useCallback(
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
          newRot - boundBox.rotation,
          currentLayer.layer_data.flop,
          currentLayer.layer_data.flip
        );

        updatingMap.left = newBoundBox.x;
        updatingMap.top = newBoundBox.y;
      }
      return updatingMap;
    },
    [currentLayer, stageRef]
  );

  const rotate90MapFunc = useCallback(
    (isLeft = true) => {
      const stage = stageRef.current;
      const selectedNode = stage.findOne("." + currentLayer.id);
      let value = selectedNode.rotation() + (isLeft ? -90 : 90);
      if (value <= -180) value += 360;
      else if (value >= 180) value -= 360;

      return rotationMapFunc(value);
    },
    [currentLayer, rotationMapFunc, stageRef]
  );

  const flopMapFunc = useCallback(() => {
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

    return updatingMap;
  }, [currentLayer, stageRef, values]);

  const flipMapFunc = useCallback(() => {
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

    return updatingMap;
  }, [currentLayer, stageRef, values]);

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
                <FormSliderInput
                  label="Rotation"
                  fieldKey="rotation"
                  min={-179}
                  max={179}
                  value={Math.round(values.layer_data.rotation)}
                  disabled={!editable}
                  onUpdateField={onLayerDataUpdateOnly}
                  onUpdateDB={onLayerDataUpdate}
                  fieldFunc={rotationMapFunc}
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
                <FormIconButton
                  disabled={!editable}
                  onUpdateField={onLayerDataUpdateOnly}
                  onUpdateDB={onLayerDataUpdate}
                  fieldFunc={rotate90MapFunc}
                >
                  <RotateLeftIcon />
                </FormIconButton>
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
                <FormIconButton
                  disabled={!editable}
                  onUpdateField={onLayerDataUpdateOnly}
                  onUpdateDB={onLayerDataUpdate}
                  fieldFunc={() => rotate90MapFunc(false)}
                >
                  <RotateRightIcon />
                </FormIconButton>
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
              <FormIconButton
                disabled={!editable}
                onUpdateField={onLayerDataUpdateOnly}
                onUpdateDB={onLayerDataUpdate}
                fieldFunc={flopMapFunc}
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
              </FormIconButton>
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
              <FormIconButton
                disabled={!editable}
                onUpdateField={onLayerDataUpdateOnly}
                onUpdateDB={onLayerDataUpdate}
                fieldFunc={flipMapFunc}
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
              </FormIconButton>
            </Box>
          ) : (
            <></>
          )}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
});

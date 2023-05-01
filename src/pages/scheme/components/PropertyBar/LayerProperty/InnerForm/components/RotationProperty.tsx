import { faSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
} from "@material-ui/core";
import {
  ExpandMore as ExpandMoreIcon,
  RotateLeft as RotateLeftIcon,
  RotateRight as RotateRightIcon,
  SwapHoriz as SwapHorizIcon,
  SwapVert as SwapVertIcon,
} from "@material-ui/icons";
import { FormikProps } from "formik";
import Konva from "konva";
import React, { RefObject, useCallback, useMemo, useState } from "react";
import {
  focusBoardQuickly,
  getAllowedLayerTypes,
  isCenterBasedShape,
  rotateAroundCenter,
} from "src/helper";
import {
  BuilderLayerJSONParitalAll,
  MovableObjLayerData,
  ShapeObjLayerData,
  ValueMap,
} from "src/types/common";
import { BuilderLayerJSON } from "src/types/query";

import { FormIconButton, FormSliderInput } from "../../../components";
import { LabelTypography } from "../../../PropertyBar.style";

type RotationPropertyProps = {
  editable: boolean;
  stageRef: RefObject<Konva.Stage>;
  currentLayer?: BuilderLayerJSON | null;
  onLayerDataUpdateOnly: (valueMap: ValueMap) => void;
  onLayerDataUpdate: (valueMap: ValueMap) => void;
} & FormikProps<BuilderLayerJSONParitalAll>;

export const RotationProperty = React.memo(
  ({
    editable,
    stageRef,
    currentLayer,
    values,
    onLayerDataUpdate,
    onLayerDataUpdateOnly,
  }: RotationPropertyProps) => {
    const layerDataProperties = ["rotation", "flip", "flop"];
    const [expanded, setExpanded] = useState(true);
    const AllowedLayerTypes = useMemo(() => getAllowedLayerTypes(values), [
      values,
    ]);

    const rotationMapFunc = useCallback(
      (value) => {
        const updatingMap: ValueMap = {
          rotation: value,
        };

        if (
          !isCenterBasedShape(
            (currentLayer?.layer_data as ShapeObjLayerData).type
          )
        ) {
          const stage = stageRef.current;
          if (!stage) return updatingMap;

          const selectedNode = stage.findOne("." + currentLayer?.id);
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
            (currentLayer?.layer_data as MovableObjLayerData).flop,
            (currentLayer?.layer_data as MovableObjLayerData).flip
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
        const selectedNode = stage?.findOne("." + currentLayer?.id);
        let value = (selectedNode?.rotation() ?? 0) + (isLeft ? -90 : 90);
        if (value <= -180) value += 360;
        else if (value >= 180) value -= 360;

        return rotationMapFunc(value);
      },
      [currentLayer, rotationMapFunc, stageRef]
    );

    const flopMapFunc = useCallback(() => {
      const newFlop = values.layer_data.flop ? 0 : 1;
      const rot = ((values.layer_data.rotation ?? 0) / 180) * Math.PI;
      const node = stageRef.current?.find(`.${currentLayer?.id}`)[0];
      const width =
        values.layer_data.width ??
        node?.getClientRect({
          relativeTo: node.getParent().getParent(),
          skipShadow: true,
        }).width ??
        0;
      const updatingMap = {
        left:
          (values.layer_data.left ?? 0) +
          (newFlop ? 1 : -1) * Math.cos(rot) * width,
        top:
          (values.layer_data.top ?? 0) +
          (newFlop ? 1 : -1) * Math.sin(rot) * width,
        flop: newFlop,
      };

      return updatingMap;
    }, [currentLayer, stageRef, values]);

    const flipMapFunc = useCallback(() => {
      const newFlip = values.layer_data.flip ? 0 : 1;
      const rot = ((values.layer_data.rotation ?? 0) / 180) * Math.PI;
      const node = stageRef.current?.find(`.${currentLayer?.id}`)[0];
      const height =
        values.layer_data.height ??
        node?.getClientRect({
          relativeTo: node.getParent().getParent(),
          skipShadow: true,
        }).height ??
        0;
      const updatingMap = {
        left:
          (values.layer_data.left ?? 0) +
          (newFlip ? -1 : 1) * Math.sin(rot) * height,
        top:
          (values.layer_data.top ?? 0) +
          (newFlip ? 1 : -1) * Math.cos(rot) * height,
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
                    value={Math.round(values.layer_data.rotation ?? 0)}
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
                  <LabelTypography
                    variant="body1"
                    color="textSecondary"
                    style={{ marginRight: "8px" }}
                  >
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
                  <LabelTypography
                    variant="body1"
                    color="textSecondary"
                    style={{ marginRight: "8px" }}
                  >
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
                <LabelTypography
                  variant="body1"
                  color="textSecondary"
                  style={{ marginRight: "8px" }}
                >
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
                <LabelTypography
                  variant="body1"
                  color="textSecondary"
                  style={{ marginRight: "8px" }}
                >
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
  }
);

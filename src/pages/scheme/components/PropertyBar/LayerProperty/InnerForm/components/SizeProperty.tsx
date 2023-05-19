import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
} from "@material-ui/core";
import { ExpandMore as ExpandMoreIcon } from "@material-ui/icons";
import { FormikProps } from "formik";
import React, { useCallback, useMemo, useState } from "react";
import {
  focusBoardQuickly,
  getAllowedLayerTypes,
  mathRound2,
} from "src/helper";
import {
  BuilderLayerJSONParitalAll,
  PartialAllLayerData,
  ValueMap,
} from "src/types/common";
import { MouseModes } from "src/types/enum";
import { BuilderLayerJSON } from "src/types/query";

import { FormLockButton, FormTextField } from "../../../components";

type SizePropertyProps = {
  editable: boolean;
  currentLayer?: BuilderLayerJSON | null;
  pressedKey?: string | null;
  onLayerDataUpdateOnly: (valueMap: PartialAllLayerData) => void;
  onLayerDataUpdate: (valueMap: PartialAllLayerData) => void;
} & FormikProps<BuilderLayerJSONParitalAll>;

export const SizeProperty = React.memo(
  ({
    editable,
    errors,
    handleBlur,
    touched,
    values,
    currentLayer,
    pressedKey,
    onLayerDataUpdateOnly,
    onLayerDataUpdate,
  }: SizePropertyProps) => {
    const layerDataProperties = [
      "width",
      "height",
      "scaleX",
      "scaleY",
      "radius",
      "innerRadius",
      "outerRadius",
      "pointerLength",
      "pointerWidth",
    ];
    const [expanded, setExpanded] = useState(true);
    const AllowedLayerTypes = useMemo(() => getAllowedLayerTypes(values), [
      values,
    ]);
    const pressingShiftKey = useMemo(() => pressedKey === "shift", [
      pressedKey,
    ]);

    const widthMapFunc = useCallback(
      (value) => {
        const updatingMap: ValueMap = {
          width: value,
        };
        if (values.layer_data.sizeLocked) {
          updatingMap.height =
            (value *
              ((currentLayer?.layer_data as PartialAllLayerData).height ?? 0)) /
            ((currentLayer?.layer_data as PartialAllLayerData).width ?? 1);
        }
        return updatingMap;
      },
      [currentLayer, values]
    );

    const heightMapFunc = useCallback(
      (value) => {
        const updatingMap: ValueMap = {
          height: value,
        };
        if (values.layer_data.sizeLocked) {
          updatingMap.width =
            (value *
              ((currentLayer?.layer_data as PartialAllLayerData).width ?? 0)) /
            ((currentLayer?.layer_data as PartialAllLayerData).height ?? 1);
        }
        return updatingMap;
      },
      [currentLayer, values]
    );

    const scaleXMapFunc = useCallback(
      (value) => {
        const updatingMap: ValueMap = {
          scaleX: value,
        };
        if (values.layer_data.sizeLocked) {
          updatingMap.scaleY =
            (value *
              ((currentLayer?.layer_data as PartialAllLayerData).scaleY ?? 0)) /
            ((currentLayer?.layer_data as PartialAllLayerData).scaleX ?? 1);
        }
        return updatingMap;
      },
      [currentLayer, values]
    );

    const scaleYMapFunc = useCallback(
      (value) => {
        const updatingMap: ValueMap = {
          scaleY: value,
        };
        if (values.layer_data.sizeLocked) {
          updatingMap.scaleX =
            (value *
              ((currentLayer?.layer_data as PartialAllLayerData).scaleX ?? 0)) /
            ((currentLayer?.layer_data as PartialAllLayerData).scaleY ?? 1);
        }
        return updatingMap;
      },
      [currentLayer, values]
    );

    const innerRadiusMapFunc = useCallback(
      (value) => {
        const updatingMap: ValueMap = {
          innerRadius: value,
        };
        if (values.layer_data.sizeLocked) {
          updatingMap.outerRadius =
            (value *
              ((currentLayer?.layer_data as PartialAllLayerData).outerRadius ??
                0)) /
            ((currentLayer?.layer_data as PartialAllLayerData).innerRadius ??
              1);
        }
        return updatingMap;
      },
      [currentLayer, values]
    );

    const outerRadiusMapFunc = useCallback(
      (value) => {
        const updatingMap: ValueMap = {
          outerRadius: value,
        };
        if (values.layer_data.sizeLocked) {
          updatingMap.innerRadius =
            (value *
              ((currentLayer?.layer_data as PartialAllLayerData).innerRadius ??
                0)) /
            ((currentLayer?.layer_data as PartialAllLayerData).outerRadius ??
              1);
        }
        return updatingMap;
      },
      [currentLayer, values]
    );

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
          <Typography variant="subtitle1">Size</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box display="flex" flexDirection="column" width="100%">
            <Box
              display="flex"
              justifyContent="space-between"
              width="100%"
              alignItems="center"
            >
              {AllowedLayerTypes.includes("layer_data.width") ? (
                <FormTextField
                  name="layer_data.width"
                  fieldKey="width"
                  fieldFunc={widthMapFunc}
                  label={
                    values.layer_data.type !== MouseModes.ELLIPSE
                      ? "Width"
                      : "RadiusX"
                  }
                  variant="outlined"
                  type="number"
                  value={mathRound2(values.layer_data.width ?? 0)}
                  disabled={!editable}
                  error={Boolean(
                    touched.layer_data?.width && errors.layer_data?.width
                  )}
                  helperText={
                    touched.layer_data?.width && errors.layer_data?.width
                  }
                  onBlur={handleBlur}
                  onUpdateField={onLayerDataUpdateOnly}
                  onUpdateDB={onLayerDataUpdate}
                  fullWidth
                  margin="normal"
                  style={{
                    marginBottom: "16px",
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              ) : (
                <></>
              )}
              {AllowedLayerTypes.includes("layer_data.width") &&
              AllowedLayerTypes.includes("layer_data.height") ? (
                <FormLockButton
                  fieldKey="sizeLocked"
                  disabled={!editable}
                  locked={
                    values.layer_data.sizeLocked || pressingShiftKey
                      ? "true"
                      : "false"
                  }
                  onUpdateField={onLayerDataUpdateOnly}
                  onUpdateDB={onLayerDataUpdate}
                />
              ) : (
                <></>
              )}
              {AllowedLayerTypes.includes("layer_data.height") ? (
                <FormTextField
                  name="layer_data.height"
                  fieldKey="height"
                  fieldFunc={heightMapFunc}
                  label={
                    values.layer_data.type !== MouseModes.ELLIPSE
                      ? "Height"
                      : "RadiusY"
                  }
                  variant="outlined"
                  type="number"
                  value={mathRound2(values.layer_data.height ?? 0)}
                  disabled={!editable}
                  error={Boolean(
                    touched.layer_data?.height && errors.layer_data?.height
                  )}
                  helperText={
                    touched.layer_data?.height && errors.layer_data?.height
                  }
                  onBlur={handleBlur}
                  onUpdateField={onLayerDataUpdateOnly}
                  onUpdateDB={onLayerDataUpdate}
                  fullWidth
                  margin="normal"
                  style={{
                    marginBottom: "16px",
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              ) : (
                <></>
              )}
            </Box>
            <Box
              display="flex"
              justifyContent="space-between"
              width="100%"
              alignItems="center"
            >
              {AllowedLayerTypes.includes("layer_data.scaleX") ? (
                <FormTextField
                  name="layer_data.scaleX"
                  fieldKey="scaleX"
                  fieldFunc={scaleXMapFunc}
                  label="Scale (X)"
                  variant="outlined"
                  type="number"
                  value={mathRound2(values.layer_data.scaleX ?? 0)}
                  disabled={!editable}
                  error={Boolean(
                    touched.layer_data?.scaleX && errors.layer_data?.scaleX
                  )}
                  helperText={
                    touched.layer_data?.scaleX && errors.layer_data?.scaleX
                  }
                  onBlur={handleBlur}
                  onUpdateField={onLayerDataUpdateOnly}
                  onUpdateDB={onLayerDataUpdate}
                  fullWidth
                  margin="normal"
                  style={{
                    marginBottom: "16px",
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    step: 0.1,
                  }}
                />
              ) : (
                <></>
              )}
              {AllowedLayerTypes.includes("layer_data.scaleX") &&
              AllowedLayerTypes.includes("layer_data.scaleY") ? (
                <FormLockButton
                  fieldKey="sizeLocked"
                  disabled={!editable}
                  locked={
                    values.layer_data.sizeLocked || pressingShiftKey
                      ? "true"
                      : "false"
                  }
                  onUpdateField={onLayerDataUpdateOnly}
                  onUpdateDB={onLayerDataUpdate}
                />
              ) : (
                <></>
              )}
              {AllowedLayerTypes.includes("layer_data.scaleY") ? (
                <FormTextField
                  name="layer_data.scaleY"
                  fieldKey="scaleY"
                  fieldFunc={scaleYMapFunc}
                  label="Scale (Y)"
                  variant="outlined"
                  type="number"
                  value={mathRound2(values.layer_data.scaleY ?? 0)}
                  disabled={!editable}
                  error={Boolean(
                    touched.layer_data?.scaleY && errors.layer_data?.scaleY
                  )}
                  helperText={
                    touched.layer_data?.scaleY && errors.layer_data?.scaleY
                  }
                  onBlur={handleBlur}
                  onUpdateField={onLayerDataUpdateOnly}
                  onUpdateDB={onLayerDataUpdate}
                  fullWidth
                  margin="normal"
                  style={{
                    marginBottom: "16px",
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    step: 0.1,
                  }}
                />
              ) : (
                <></>
              )}
            </Box>
            <Box
              display="flex"
              justifyContent="space-between"
              width="100%"
              alignItems="center"
            >
              {AllowedLayerTypes.includes("layer_data.innerRadius") ? (
                <FormTextField
                  name="layer_data.innerRadius"
                  fieldKey="innerRadius"
                  fieldFunc={innerRadiusMapFunc}
                  label="Inner Radius"
                  variant="outlined"
                  type="number"
                  value={mathRound2(values.layer_data.innerRadius ?? 0)}
                  disabled={!editable}
                  error={Boolean(
                    touched.layer_data?.innerRadius &&
                      errors.layer_data?.innerRadius
                  )}
                  helperText={
                    touched.layer_data?.innerRadius &&
                    errors.layer_data?.innerRadius
                  }
                  onBlur={handleBlur}
                  onUpdateField={onLayerDataUpdateOnly}
                  onUpdateDB={onLayerDataUpdate}
                  fullWidth
                  margin="normal"
                  style={{
                    marginBottom: "16px",
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              ) : (
                <></>
              )}
              {AllowedLayerTypes.includes("layer_data.innerRadius") &&
              AllowedLayerTypes.includes("layer_data.outerRadius") ? (
                <FormLockButton
                  fieldKey="sizeLocked"
                  disabled={!editable}
                  locked={
                    values.layer_data.sizeLocked || pressingShiftKey
                      ? "true"
                      : "false"
                  }
                  onUpdateField={onLayerDataUpdateOnly}
                  onUpdateDB={onLayerDataUpdate}
                />
              ) : (
                <></>
              )}
              {AllowedLayerTypes.includes("layer_data.outerRadius") ? (
                <FormTextField
                  name="layer_data.outerRadius"
                  fieldKey="outerRadius"
                  fieldFunc={outerRadiusMapFunc}
                  label="Outer Radius"
                  variant="outlined"
                  type="number"
                  value={mathRound2(values.layer_data.outerRadius ?? 0)}
                  disabled={!editable}
                  error={Boolean(
                    touched.layer_data?.outerRadius &&
                      errors.layer_data?.outerRadius
                  )}
                  helperText={
                    touched.layer_data?.outerRadius &&
                    errors.layer_data?.outerRadius
                  }
                  onBlur={handleBlur}
                  onUpdateField={onLayerDataUpdateOnly}
                  onUpdateDB={onLayerDataUpdate}
                  fullWidth
                  margin="normal"
                  style={{
                    marginBottom: "16px",
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              ) : (
                <></>
              )}
            </Box>
            {AllowedLayerTypes.includes("layer_data.radius") ? (
              <FormTextField
                name="layer_data.radius"
                fieldKey="radius"
                label="Radius"
                variant="outlined"
                type="number"
                value={mathRound2(values.layer_data.radius ?? 0)}
                disabled={!editable}
                error={Boolean(
                  touched.layer_data?.radius && errors.layer_data?.radius
                )}
                helperText={
                  touched.layer_data?.radius && errors.layer_data?.radius
                }
                onBlur={handleBlur}
                onUpdateField={onLayerDataUpdateOnly}
                onUpdateDB={onLayerDataUpdate}
                fullWidth
                margin="normal"
                style={{
                  marginBottom: "16px",
                }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            ) : (
              <></>
            )}
            {AllowedLayerTypes.includes("layer_data.pointerWidth") ? (
              <FormTextField
                name="layer_data.pointerWidth"
                fieldKey="pointerWidth"
                label="Pointer Width"
                variant="outlined"
                type="number"
                value={mathRound2(values.layer_data.pointerWidth ?? 0)}
                disabled={!editable}
                error={Boolean(
                  touched.layer_data?.pointerWidth &&
                    errors.layer_data?.pointerWidth
                )}
                helperText={
                  touched.layer_data?.pointerWidth &&
                  errors.layer_data?.pointerWidth
                }
                onBlur={handleBlur}
                onUpdateField={onLayerDataUpdateOnly}
                onUpdateDB={onLayerDataUpdate}
                fullWidth
                margin="normal"
                style={{
                  marginBottom: "16px",
                }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            ) : (
              <></>
            )}
            {AllowedLayerTypes.includes("layer_data.pointerLength") ? (
              <FormTextField
                name="layer_data.pointerLength"
                fieldKey="pointerLength"
                label="Pointer Length"
                variant="outlined"
                type="number"
                value={mathRound2(values.layer_data.pointerLength ?? 0)}
                disabled={!editable}
                error={Boolean(
                  touched.layer_data?.pointerLength &&
                    errors.layer_data?.pointerLength
                )}
                helperText={
                  touched.layer_data?.pointerLength &&
                  errors.layer_data?.pointerLength
                }
                onBlur={handleBlur}
                onUpdateField={onLayerDataUpdateOnly}
                onUpdateDB={onLayerDataUpdate}
                fullWidth
                margin="normal"
                style={{
                  marginBottom: "16px",
                }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            ) : (
              <></>
            )}
          </Box>
        </AccordionDetails>
      </Accordion>
    );
  }
);

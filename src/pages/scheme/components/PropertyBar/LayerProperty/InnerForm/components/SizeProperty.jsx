import React, { useState, useMemo, useCallback } from "react";
import { AllowedLayerProps, LayerTypes, MouseModes } from "constant";
import { focusBoardQuickly, mathRound2 } from "helper";
import { useDebouncedCallback } from "use-debounce";

import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@material-ui/core";
import { LockButton } from "components/common";
import { ExpandMore as ExpandMoreIcon } from "@material-ui/icons";
import { SmallTextField } from "../../../PropertyBar.style";

export const SizeProperty = React.memo((props) => {
  const {
    editable,
    errors,
    handleBlur,
    touched,
    values,
    toggleLayerDataField,
    currentLayer,
    pressedKey,
    setFieldValue,
    setMultiFieldValue,
    onDataFieldChange,
    onLayerDataMultiUpdate,
  } = props;
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
  const AllowedLayerTypes = useMemo(
    () =>
      !values.layer_type
        ? []
        : values.layer_type !== LayerTypes.SHAPE
        ? AllowedLayerProps[values.layer_type]
        : AllowedLayerProps[values.layer_type][values.layer_data.type],
    [values]
  );
  const pressingShiftKey = useMemo(() => pressedKey === "shift", [pressedKey]);

  const handleChangeWidthDebounced = useDebouncedCallback(
    (value) => onLayerDataMultiUpdate(value),
    1000
  );

  const handleChangeWidth = useCallback(
    (e) => {
      let value = parseFloat(e.target.value) || 0;
      let updatingMap = {
        width: value,
      };
      if (values.layer_data.sizeLocked) {
        updatingMap.height =
          (value * currentLayer.layer_data.height) /
          currentLayer.layer_data.width;
      }
      setMultiFieldValue(updatingMap);
      handleChangeWidthDebounced(updatingMap);
    },
    [currentLayer, handleChangeWidthDebounced, setMultiFieldValue, values]
  );

  const handleChangeHeightDebounced = useDebouncedCallback(
    (value) => onLayerDataMultiUpdate(value),
    1000
  );

  const handleChangeHeight = useCallback(
    (e) => {
      let value = parseFloat(e.target.value) || 0;
      let updatingMap = {
        height: value,
      };
      if (values.layer_data.sizeLocked) {
        updatingMap.width =
          (value * currentLayer.layer_data.width) /
          currentLayer.layer_data.height;
      }
      setMultiFieldValue(updatingMap);
      handleChangeHeightDebounced(updatingMap);
    },
    [currentLayer, handleChangeHeightDebounced, setMultiFieldValue, values]
  );

  const handleChangeScaleXDebounced = useDebouncedCallback(
    (value) => onLayerDataMultiUpdate(value),
    1000
  );

  const handleChangeScaleX = useCallback(
    (e) => {
      let value = parseFloat(e.target.value) || 0;
      let updatingMap = {
        scaleX: value,
      };
      if (values.layer_data.sizeLocked) {
        updatingMap.scaleY =
          (value * currentLayer.layer_data.scaleY) /
          currentLayer.layer_data.scaleX;
      }
      setMultiFieldValue(updatingMap);
      handleChangeScaleXDebounced(updatingMap);
    },
    [currentLayer, handleChangeScaleXDebounced, setMultiFieldValue, values]
  );

  const handleChangeScaleYDebounced = useDebouncedCallback(
    (value) => onLayerDataMultiUpdate(value),
    1000
  );

  const handleChangeScaleY = useCallback(
    (e) => {
      let value = parseFloat(e.target.value) || 0;
      let updatingMap = {
        scaleY: value,
      };
      if (values.layer_data.sizeLocked) {
        updatingMap.scaleX =
          (value * currentLayer.layer_data.scaleX) /
          currentLayer.layer_data.scaleY;
      }
      setMultiFieldValue(updatingMap);
      handleChangeScaleYDebounced(updatingMap);
    },
    [currentLayer, handleChangeScaleYDebounced, setMultiFieldValue, values]
  );

  const handleChangeInnerRadiusDebounced = useDebouncedCallback(
    (value) => onLayerDataMultiUpdate(value),
    1000
  );

  const handleChangeInnerRadius = useCallback(
    (e) => {
      let value = parseFloat(e.target.value) || 0;
      let updatingMap = {
        innerRadius: value,
      };
      if (values.layer_data.sizeLocked) {
        updatingMap.outerRadius =
          (value * currentLayer.layer_data.outerRadius) /
          currentLayer.layer_data.innerRadius;
      }
      setMultiFieldValue(updatingMap);
      handleChangeInnerRadiusDebounced(updatingMap);
    },
    [currentLayer, handleChangeInnerRadiusDebounced, setMultiFieldValue, values]
  );

  const handleChangeOuterRadiusDebounced = useDebouncedCallback(
    (value) => onLayerDataMultiUpdate(value),
    1000
  );

  const handleChangeOuterRadius = useCallback(
    (e) => {
      let value = parseFloat(e.target.value) || 0;
      let updatingMap = {
        outerRadius: value,
      };
      if (values.layer_data.sizeLocked) {
        updatingMap.innerRadius =
          (value * currentLayer.layer_data.innerRadius) /
          currentLayer.layer_data.outerRadius;
      }
      setMultiFieldValue(updatingMap);
      handleChangeOuterRadiusDebounced(updatingMap);
    },
    [currentLayer, handleChangeOuterRadiusDebounced, setMultiFieldValue, values]
  );

  const handleToggleSizeLockedDebounced = useDebouncedCallback(
    () => toggleLayerDataField("sizeLocked"),
    1000
  );

  const handleToggleSizeLocked = useCallback(() => {
    setFieldValue(`layer_data.sizeLocked`, !values.layer_data.sizeLocked);
    handleToggleSizeLockedDebounced();
  }, [handleToggleSizeLockedDebounced, setFieldValue, values]);

  const handleRadiusChangeDebounced = useDebouncedCallback(
    (value) => onDataFieldChange("radius", value),
    1000
  );

  const handleRadiusChange = useCallback(
    (e) => {
      let value = Number(e.target.value) || 0;
      setFieldValue(`layer_data.radius`, value);
      handleRadiusChangeDebounced(value);
    },
    [handleRadiusChangeDebounced, setFieldValue]
  );

  const handlePointerWidthChangeDebounced = useDebouncedCallback(
    (value) => onDataFieldChange("pointerWidth", value),
    1000
  );

  const handlePointerWidthChange = useCallback(
    (e) => {
      let value = Number(e.target.value) || 0;
      setFieldValue(`layer_data.pointerWidth`, value);
      handlePointerWidthChangeDebounced(value);
    },
    [handlePointerWidthChangeDebounced, setFieldValue]
  );

  const handlePointerLengthChangeDebounced = useDebouncedCallback(
    (value) => onDataFieldChange("pointerLength", value),
    1000
  );

  const handlePointerLengthChange = useCallback(
    (e) => {
      let value = Number(e.target.value) || 0;
      setFieldValue(`layer_data.pointerLength`, value);
      handlePointerLengthChangeDebounced(value);
    },
    [handlePointerLengthChangeDebounced, setFieldValue]
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
              <SmallTextField
                name="layer_data.width"
                label={
                  values.layer_data.type !== MouseModes.ELLIPSE
                    ? "Width"
                    : "RadiusX"
                }
                variant="outlined"
                type="number"
                value={mathRound2(values.layer_data.width)}
                disabled={!editable}
                error={Boolean(
                  touched.layer_data &&
                    touched.layer_data.width &&
                    errors.layer_data &&
                    errors.layer_data.width
                )}
                helperText={
                  touched.layer_data &&
                  touched.layer_data.width &&
                  errors.layer_data &&
                  errors.layer_data.width
                }
                onBlur={handleBlur}
                onChange={handleChangeWidth}
                fullWidth
                margin="normal"
                mb={4}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            ) : (
              <></>
            )}
            {AllowedLayerTypes.includes("layer_data.width") &&
            AllowedLayerTypes.includes("layer_data.height") ? (
              <LockButton
                disabled={!editable}
                locked={
                  values.layer_data.sizeLocked || pressingShiftKey
                    ? "true"
                    : "false"
                }
                onClick={handleToggleSizeLocked}
              />
            ) : (
              <></>
            )}
            {AllowedLayerTypes.includes("layer_data.height") ? (
              <SmallTextField
                name="layer_data.height"
                label={
                  values.layer_data.type !== MouseModes.ELLIPSE
                    ? "Height"
                    : "RadiusY"
                }
                variant="outlined"
                type="number"
                value={mathRound2(values.layer_data.height)}
                disabled={!editable}
                error={Boolean(
                  touched.layer_data &&
                    touched.layer_data.height &&
                    errors.layer_data &&
                    errors.layer_data.height
                )}
                helperText={
                  touched.layer_data &&
                  touched.layer_data.height &&
                  errors.layer_data &&
                  errors.layer_data.height
                }
                onBlur={handleBlur}
                onChange={handleChangeHeight}
                fullWidth
                margin="normal"
                mb={4}
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
              <SmallTextField
                name="layer_data.scaleX"
                label="Scale (X)"
                variant="outlined"
                type="number"
                value={mathRound2(values.layer_data.scaleX)}
                disabled={!editable}
                error={Boolean(
                  touched.layer_data &&
                    touched.layer_data.scaleX &&
                    errors.layer_data &&
                    errors.layer_data.scaleX
                )}
                helperText={
                  touched.layer_data &&
                  touched.layer_data.scaleX &&
                  errors.layer_data &&
                  errors.layer_data.scaleX
                }
                onBlur={handleBlur}
                onChange={handleChangeScaleX}
                fullWidth
                margin="normal"
                mb={4}
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
              <LockButton
                disabled={!editable}
                locked={
                  values.layer_data.sizeLocked || pressingShiftKey
                    ? "true"
                    : "false"
                }
                onClick={handleToggleSizeLocked}
              />
            ) : (
              <></>
            )}
            {AllowedLayerTypes.includes("layer_data.scaleY") ? (
              <SmallTextField
                name="layer_data.scaleY"
                label="Scale (Y)"
                variant="outlined"
                type="number"
                value={mathRound2(values.layer_data.scaleY)}
                disabled={!editable}
                error={Boolean(
                  touched.layer_data &&
                    touched.layer_data.scaleY &&
                    errors.layer_data &&
                    errors.layer_data.scaleY
                )}
                helperText={
                  touched.layer_data &&
                  touched.layer_data.scaleY &&
                  errors.layer_data &&
                  errors.layer_data.scaleY
                }
                onBlur={handleBlur}
                onChange={handleChangeScaleY}
                fullWidth
                margin="normal"
                mb={4}
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
              <SmallTextField
                name="layer_data.innerRadius"
                label="Inner Radius"
                variant="outlined"
                type="number"
                value={mathRound2(values.layer_data.innerRadius)}
                disabled={!editable}
                error={Boolean(
                  touched.layer_data &&
                    touched.layer_data.innerRadius &&
                    errors.layer_data &&
                    errors.layer_data.innerRadius
                )}
                helperText={
                  touched.layer_data &&
                  touched.layer_data.innerRadius &&
                  errors.layer_data &&
                  errors.layer_data.innerRadius
                }
                onBlur={handleBlur}
                onChange={handleChangeInnerRadius}
                fullWidth
                margin="normal"
                mb={4}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            ) : (
              <></>
            )}
            {AllowedLayerTypes.includes("layer_data.innerRadius") &&
            AllowedLayerTypes.includes("layer_data.outerRadius") ? (
              <LockButton
                disabled={!editable}
                onClick={handleToggleSizeLocked}
                locked={
                  values.layer_data.sizeLocked || pressingShiftKey
                    ? "true"
                    : "false"
                }
              />
            ) : (
              <></>
            )}
            {AllowedLayerTypes.includes("layer_data.outerRadius") ? (
              <SmallTextField
                name="layer_data.outerRadius"
                label="Outer Radius"
                variant="outlined"
                type="number"
                value={mathRound2(values.layer_data.outerRadius)}
                disabled={!editable}
                error={Boolean(
                  touched.layer_data &&
                    touched.layer_data.outerRadius &&
                    errors.layer_data &&
                    errors.layer_data.outerRadius
                )}
                helperText={
                  touched.layer_data &&
                  touched.layer_data.outerRadius &&
                  errors.layer_data &&
                  errors.layer_data.outerRadius
                }
                onBlur={handleBlur}
                onChange={handleChangeOuterRadius}
                fullWidth
                margin="normal"
                mb={4}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            ) : (
              <></>
            )}
          </Box>
          {AllowedLayerTypes.includes("layer_data.radius") ? (
            <SmallTextField
              name="layer_data.radius"
              label="Radius"
              variant="outlined"
              type="number"
              value={mathRound2(values.layer_data.radius)}
              disabled={!editable}
              error={Boolean(
                touched.layer_data &&
                  touched.layer_data.radius &&
                  errors.layer_data &&
                  errors.layer_data.radius
              )}
              helperText={
                touched.layer_data &&
                touched.layer_data.radius &&
                errors.layer_data &&
                errors.layer_data.radius
              }
              onBlur={handleBlur}
              onChange={handleRadiusChange}
              fullWidth
              margin="normal"
              mb={4}
              InputLabelProps={{
                shrink: true,
              }}
            />
          ) : (
            <></>
          )}
          {AllowedLayerTypes.includes("layer_data.pointerWidth") ? (
            <SmallTextField
              name="layer_data.pointerWidth"
              label="Pointer Width"
              variant="outlined"
              type="number"
              value={mathRound2(values.layer_data.pointerWidth)}
              disabled={!editable}
              error={Boolean(
                touched.layer_data &&
                  touched.layer_data.pointerWidth &&
                  errors.layer_data &&
                  errors.layer_data.pointerWidth
              )}
              helperText={
                touched.layer_data &&
                touched.layer_data.pointerWidth &&
                errors.layer_data &&
                errors.layer_data.pointerWidth
              }
              onBlur={handleBlur}
              onChange={handlePointerWidthChange}
              fullWidth
              margin="normal"
              mb={4}
              InputLabelProps={{
                shrink: true,
              }}
            />
          ) : (
            <></>
          )}
          {AllowedLayerTypes.includes("layer_data.pointerLength") ? (
            <SmallTextField
              name="layer_data.pointerLength"
              label="Pointer Length"
              variant="outlined"
              type="number"
              value={mathRound2(values.layer_data.pointerLength)}
              disabled={!editable}
              error={Boolean(
                touched.layer_data &&
                  touched.layer_data.pointerLength &&
                  errors.layer_data &&
                  errors.layer_data.pointerLength
              )}
              helperText={
                touched.layer_data &&
                touched.layer_data.pointerLength &&
                errors.layer_data &&
                errors.layer_data.pointerLength
              }
              onBlur={handleBlur}
              onChange={handlePointerLengthChange}
              fullWidth
              margin="normal"
              mb={4}
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
});

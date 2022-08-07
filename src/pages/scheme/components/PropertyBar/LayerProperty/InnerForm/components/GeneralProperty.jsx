import React, { useState, useMemo, useCallback } from "react";
import { AllowedLayerProps, LayerTypes } from "constant";

import {
  Box,
  Typography,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
} from "@material-ui/core";
import { SliderInput } from "components/common";
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
  ExpandMore as ExpandMoreIcon,
} from "@material-ui/icons";
import { LabelTypography, SmallTextField } from "../../../PropertyBar.style";
import { focusBoardQuickly } from "helper";
import { useDebouncedCallback } from "use-debounce";

export const GeneralProperty = React.memo((props) => {
  const {
    editable,
    errors,
    handleBlur,
    touched,
    values,
    toggleField,
    setFieldValue,
    onDataFieldChange,
  } = props;
  const layerDataProperties = ["text", "numPoints", "angle", "opacity"];
  const layerProperties = ["layer_visible", "layer_locked"];
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

  const handleFontChangeDebounced = useDebouncedCallback(
    (value) => onDataFieldChange("text", value),
    1000
  );

  const handleFontChange = useCallback(
    (e) => {
      setFieldValue(`layer_data.text`, e.target.value);
      handleFontChangeDebounced(e.target.value);
    },
    [handleFontChangeDebounced, setFieldValue]
  );

  const handleNumPointsChangeDebounced = useDebouncedCallback(
    (value) => onDataFieldChange("numPoints", Number(value) || 0),
    1000
  );

  const handleNumPointsChange = useCallback(
    (e) => {
      const value = Number(e.target.value) || 0;
      setFieldValue(`layer_data.numPoints`, value);
      handleNumPointsChangeDebounced(value);
    },
    [handleNumPointsChangeDebounced, setFieldValue]
  );

  const handleAngleChangeDebounced = useDebouncedCallback(
    (value) => onDataFieldChange("angle", value),
    1000
  );

  const handleAngleChange = useCallback(
    (value) => {
      setFieldValue(`layer_data.angle`, value);
      handleAngleChangeDebounced(value);
    },
    [handleAngleChangeDebounced, setFieldValue]
  );

  const handleOpacityChangeDebounced = useDebouncedCallback(
    (value) => onDataFieldChange("opacity", value),
    1000
  );

  const handleOpacityChange = useCallback(
    (value) => {
      setFieldValue(`layer_data.opacity`, value);
      handleOpacityChangeDebounced(value);
    },
    [handleOpacityChangeDebounced, setFieldValue]
  );

  const handleToggleVisibleDebounced = useDebouncedCallback(
    () => toggleField("layer_visible"),
    1000
  );

  const handleToggleVisible = useCallback(() => {
    setFieldValue(`layer_visible`, !values.layer_visible);
    handleToggleVisibleDebounced();
  }, [handleToggleVisibleDebounced, setFieldValue, values.layer_visible]);

  const handleToggleLockedDebounced = useDebouncedCallback(
    () => toggleField("layer_locked"),
    1000
  );

  const handleToggleLocked = useCallback(() => {
    setFieldValue(`layer_locked`, !values.layer_locked);
    handleToggleLockedDebounced();
  }, [handleToggleLockedDebounced, setFieldValue, values.layer_locked]);

  if (
    !AllowedLayerTypes ||
    (layerDataProperties.every(
      (value) => !AllowedLayerTypes.includes("layer_data." + value)
    ) &&
      layerProperties.every((value) => !AllowedLayerTypes.includes(value)))
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
        <Typography variant="subtitle1">General</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={2}>
          {AllowedLayerTypes.includes("layer_data.text") ? (
            <Grid item xs={12} sm={12}>
              <SmallTextField
                name="layer_data.text"
                label="Text"
                variant="outlined"
                value={values.layer_data.text}
                disabled={!editable}
                error={Boolean(
                  touched.layer_data &&
                    touched.layer_data.text &&
                    errors.layer_data &&
                    errors.layer_data.text
                )}
                helperText={
                  touched.layer_data &&
                  touched.layer_data.text &&
                  errors.layer_data &&
                  errors.layer_data.text
                }
                onBlur={handleBlur}
                onChange={handleFontChange}
                fullWidth
                margin="normal"
                mb={4}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
          ) : (
            <></>
          )}
          {AllowedLayerTypes.includes("layer_data.numPoints") ? (
            <Grid item xs={12} sm={12}>
              <SmallTextField
                name="layer_data.numPoints"
                label="Number of Points"
                variant="outlined"
                type="number"
                value={Math.round(values.layer_data.numPoints)}
                disabled={!editable}
                error={Boolean(
                  touched.layer_data &&
                    touched.layer_data.numPoints &&
                    errors.layer_data &&
                    errors.layer_data.numPoints
                )}
                helperText={
                  touched.layer_data &&
                  touched.layer_data.numPoints &&
                  errors.layer_data &&
                  errors.layer_data.numPoints
                }
                onBlur={handleBlur}
                onChange={handleNumPointsChange}
                fullWidth
                margin="normal"
                mb={4}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
          ) : (
            <></>
          )}
          {AllowedLayerTypes.includes("layer_data.angle") ? (
            <Grid item xs={12} sm={12} component={Box} height="40px">
              <SliderInput
                label="Angle"
                disabled={!editable}
                min={0}
                max={360}
                small
                value={Math.round(values.layer_data.angle)}
                setValue={handleAngleChange}
              />
            </Grid>
          ) : (
            <></>
          )}
          {AllowedLayerTypes.includes("layer_data.opacity") ? (
            <Grid item xs={12} sm={12} component={Box} height="40px">
              <SliderInput
                label="Opacity"
                disabled={!editable}
                min={0}
                max={1}
                step={0.01}
                small
                value={values.layer_data.opacity}
                setValue={handleOpacityChange}
              />
            </Grid>
          ) : (
            <></>
          )}
          {AllowedLayerTypes.includes("layer_visible") ? (
            <Grid item xs={12} sm={12} component={Box} height="40px">
              <Box
                display="flex"
                alignItems="center"
                flexDirection="row"
                justifyContent="space-between"
                height="40px"
              >
                <LabelTypography variant="body1" color="textSecondary" mr={2}>
                  Visibility
                </LabelTypography>
                <IconButton
                  disabled={!editable}
                  onClick={handleToggleVisible}
                  size="small"
                >
                  {values.layer_visible ? (
                    <VisibilityIcon />
                  ) : (
                    <VisibilityOffIcon />
                  )}
                </IconButton>
              </Box>
            </Grid>
          ) : (
            <></>
          )}
          {AllowedLayerTypes.includes("layer_locked") ? (
            <Grid
              item
              xs={12}
              sm={12}
              component={Box}
              height="40px"
              alignItems="center"
            >
              <Box
                display="flex"
                alignItems="center"
                flexDirection="row"
                justifyContent="space-between"
                height="40px"
              >
                <LabelTypography variant="body1" color="textSecondary" mr={2}>
                  Locking
                </LabelTypography>
                <IconButton
                  disabled={!editable}
                  onClick={handleToggleLocked}
                  size="small"
                >
                  {values.layer_locked ? <LockIcon /> : <LockOpenIcon />}
                </IconButton>
              </Box>
            </Grid>
          ) : (
            <></>
          )}
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
});

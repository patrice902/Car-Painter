import React, { useState, useMemo } from "react";
import { AllowedLayerProps, LayerTypes } from "constant";

import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
} from "@material-ui/core";
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
  ExpandMore as ExpandMoreIcon,
} from "@material-ui/icons";
import { LabelTypography } from "../../../PropertyBar.style";
import { focusBoardQuickly } from "helper";
import {
  FormIconButton,
  FormSliderInput,
  FormTextField,
} from "../../../components";

export const GeneralProperty = React.memo((props) => {
  const {
    editable,
    errors,
    handleBlur,
    touched,
    values,
    onLayerUpdate,
    onLayerUpdateOnly,
    onLayerDataUpdate,
    onLayerDataUpdateOnly,
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
              <FormTextField
                name="layer_data.text"
                fieldKey="text"
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
                fullWidth
                margin="normal"
                mb={4}
                InputLabelProps={{
                  shrink: true,
                }}
                onBlur={handleBlur}
                onUpdateField={onLayerDataUpdateOnly}
                onUpdateDB={onLayerDataUpdate}
              />
            </Grid>
          ) : (
            <></>
          )}
          {AllowedLayerTypes.includes("layer_data.numPoints") ? (
            <Grid item xs={12} sm={12}>
              <FormTextField
                name="layer_data.numPoints"
                fieldKey="numPoints"
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
                fullWidth
                margin="normal"
                mb={4}
                InputLabelProps={{
                  shrink: true,
                }}
                onBlur={handleBlur}
                onUpdateField={onLayerDataUpdateOnly}
                onUpdateDB={onLayerDataUpdate}
              />
            </Grid>
          ) : (
            <></>
          )}
          {AllowedLayerTypes.includes("layer_data.angle") ? (
            <Grid item xs={12} sm={12} component={Box} height="40px">
              <FormSliderInput
                label="Angle"
                fieldKey="angle"
                disabled={!editable}
                min={0}
                max={360}
                value={Math.round(values.layer_data.angle)}
                onUpdateField={onLayerDataUpdateOnly}
                onUpdateDB={onLayerDataUpdate}
              />
            </Grid>
          ) : (
            <></>
          )}
          {AllowedLayerTypes.includes("layer_data.opacity") ? (
            <Grid item xs={12} sm={12} component={Box} height="40px">
              <FormSliderInput
                label="Opacity"
                fieldKey="opacity"
                disabled={!editable}
                min={0}
                max={1}
                step={0.01}
                value={values.layer_data.opacity}
                onUpdateField={onLayerDataUpdateOnly}
                onUpdateDB={onLayerDataUpdate}
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
                <FormIconButton
                  disabled={!editable}
                  fieldKey="layer_visible"
                  value={values.layer_visible}
                  onUpdateField={onLayerUpdateOnly}
                  onUpdateDB={onLayerUpdate}
                >
                  {values.layer_visible ? (
                    <VisibilityIcon />
                  ) : (
                    <VisibilityOffIcon />
                  )}
                </FormIconButton>
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
                <FormIconButton
                  disabled={!editable}
                  fieldKey="layer_locked"
                  value={values.layer_locked}
                  onUpdateField={onLayerUpdateOnly}
                  onUpdateDB={onLayerUpdate}
                >
                  {values.layer_locked ? <LockIcon /> : <LockOpenIcon />}
                </FormIconButton>
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

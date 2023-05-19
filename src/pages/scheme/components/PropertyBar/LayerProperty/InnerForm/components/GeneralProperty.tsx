import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Grid,
  Typography,
} from "@material-ui/core";
import {
  ExpandMore as ExpandMoreIcon,
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from "@material-ui/icons";
import { FormikProps } from "formik";
import React, { useMemo, useState } from "react";
import { focusBoardQuickly, getAllowedLayerTypes } from "src/helper";
import {
  BuilderLayerJSONParitalAll,
  PartialAllLayerData,
} from "src/types/common";

import {
  FormIconButton,
  FormSliderInput,
  FormTextField,
} from "../../../components";
import { LabelTypography } from "../../../PropertyBar.style";

type GeneralPropertyProps = {
  editable: boolean;
  onLayerUpdate: (valueMap: Record<string, unknown>) => void;
  onLayerUpdateOnly: (valueMap: Record<string, unknown>) => void;
  onLayerDataUpdateOnly: (valueMap: PartialAllLayerData) => void;
  onLayerDataUpdate: (valueMap: PartialAllLayerData) => void;
} & FormikProps<BuilderLayerJSONParitalAll>;

export const GeneralProperty = React.memo(
  ({
    editable,
    errors,
    handleBlur,
    touched,
    values,
    onLayerUpdate,
    onLayerUpdateOnly,
    onLayerDataUpdate,
    onLayerDataUpdateOnly,
  }: GeneralPropertyProps) => {
    const layerDataProperties = ["text", "numPoints", "angle", "opacity"];
    const layerProperties = ["layer_visible", "layer_locked"];
    const [expanded, setExpanded] = useState(true);
    const AllowedLayerTypes = useMemo(() => getAllowedLayerTypes(values), [
      values,
    ]);

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
                    touched.layer_data?.text && errors.layer_data?.text
                  )}
                  helperText={
                    touched.layer_data?.text && errors.layer_data?.text
                  }
                  fullWidth
                  margin="normal"
                  style={{
                    marginBottom: "16px",
                  }}
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
                  value={Math.round(values.layer_data.numPoints ?? 0)}
                  disabled={!editable}
                  error={Boolean(
                    touched.layer_data?.numPoints &&
                      errors.layer_data?.numPoints
                  )}
                  helperText={
                    touched.layer_data?.numPoints &&
                    errors.layer_data?.numPoints
                  }
                  fullWidth
                  margin="normal"
                  style={{
                    marginBottom: "16px",
                  }}
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
                  value={Math.round(values.layer_data.angle ?? 0)}
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
                  <LabelTypography
                    variant="body1"
                    color="textSecondary"
                    style={{
                      marginRight: "16px",
                    }}
                  >
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
                alignItems="center"
                style={{
                  height: "40px",
                }}
              >
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
                    style={{
                      marginRight: "16px",
                    }}
                  >
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
  }
);

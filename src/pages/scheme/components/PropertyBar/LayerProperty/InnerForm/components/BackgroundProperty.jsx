import React, { useState, useMemo } from "react";

import { AllowedLayerProps, LayerTypes } from "constant";
import { focusBoardQuickly, mathRound2 } from "helper";

import {
  Box,
  Typography,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "components/MaterialUI";
import { ExpandMore as ExpandMoreIcon } from "@material-ui/icons";

import { LabelTypography } from "../../../PropertyBar.style";
import { FormTextField, FormColorPickerInput } from "../../../components";

export const BackgroundProperty = React.memo((props) => {
  const {
    editable,
    errors,
    handleBlur,
    touched,
    values,
    onLayerDataUpdateOnly,
    onLayerDataUpdate,
  } = props;
  const layerDataProperties = ["bgColor", "paddingX", "paddingY"];
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
        <Typography variant="subtitle1">Background</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box display="flex" flexDirection="column" width="100%">
          <Grid container spacing={2}>
            {AllowedLayerTypes.includes("layer_data.bgColor") ? (
              <>
                <Grid item xs={6}>
                  <Box display="flex" alignItems="center" height="100%">
                    <LabelTypography color="textSecondary">
                      Background
                    </LabelTypography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <FormColorPickerInput
                    value={values.layer_data.bgColor}
                    fieldKey="bgColor"
                    disabled={!editable}
                    error={Boolean(
                      errors.layer_data && errors.layer_data.bgColor
                    )}
                    helperText={errors.layer_data && errors.layer_data.bgColor}
                    onUpdateDB={onLayerDataUpdate}
                  />
                </Grid>
              </>
            ) : (
              <></>
            )}
            <Grid item sm={6}>
              {AllowedLayerTypes.includes("layer_data.paddingX") ? (
                <FormTextField
                  name="layer_data.paddingX"
                  fieldKey="paddingX"
                  label="Padding (X)"
                  variant="outlined"
                  value={mathRound2(values.layer_data.paddingX)}
                  type="number"
                  disabled={!editable}
                  error={Boolean(
                    touched.layer_data &&
                      touched.layer_data.paddingX &&
                      errors.layer_data &&
                      errors.layer_data.paddingX
                  )}
                  helperText={
                    touched.layer_data &&
                    touched.layer_data.paddingX &&
                    errors.layer_data &&
                    errors.layer_data.paddingX
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
              ) : (
                <></>
              )}
            </Grid>
            <Grid item sm={6}>
              {AllowedLayerTypes.includes("layer_data.paddingY") ? (
                <FormTextField
                  name="layer_data.paddingY"
                  label="Padding (Y)"
                  fieldKey="paddingY"
                  variant="outlined"
                  type="number"
                  value={mathRound2(values.layer_data.paddingY)}
                  disabled={!editable}
                  error={Boolean(
                    touched.layer_data &&
                      touched.layer_data.paddingY &&
                      errors.layer_data &&
                      errors.layer_data.paddingY
                  )}
                  helperText={
                    touched.layer_data &&
                    touched.layer_data.paddingY &&
                    errors.layer_data &&
                    errors.layer_data.paddingY
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
              ) : (
                <></>
              )}
            </Grid>
          </Grid>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
});

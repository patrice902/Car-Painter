import React, { useState, useMemo } from "react";
import { AllowedLayerProps, LayerTypes } from "constant";
import { focusBoardQuickly, mathRound2 } from "helper";

import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
} from "@material-ui/core";
import { ExpandMore as ExpandMoreIcon } from "@material-ui/icons";
import { FormTextField } from "../../../components";

export const SkewProperty = React.memo((props) => {
  const {
    editable,
    errors,
    handleBlur,
    touched,
    values,
    onLayerDataUpdateOnly,
    onLayerDataUpdate,
  } = props;
  const layerDataProperties = ["skewX", "skewY"];
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
        <Typography variant="subtitle1">Skew</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box display="flex" flexDirection="column" width="100%">
          <Grid container spacing={2}>
            <Grid item sm={6}>
              {AllowedLayerTypes.includes("layer_data.skewX") ? (
                <FormTextField
                  name="layer_data.skewX"
                  fieldKey="skewX"
                  label="Skew (X)"
                  variant="outlined"
                  type="number"
                  inputProps={{
                    step: 0.1,
                  }}
                  value={mathRound2(values.layer_data.skewX)}
                  disabled={!editable}
                  error={Boolean(
                    touched.layer_data &&
                      touched.layer_data.skewX &&
                      errors.layer_data &&
                      errors.layer_data.skewX
                  )}
                  helperText={
                    touched.layer_data &&
                    touched.layer_data.skewX &&
                    errors.layer_data &&
                    errors.layer_data.skewX
                  }
                  onBlur={handleBlur}
                  onUpdateField={onLayerDataUpdateOnly}
                  onUpdateDB={onLayerDataUpdate}
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
            </Grid>
            <Grid item sm={6}>
              {AllowedLayerTypes.includes("layer_data.skewY") ? (
                <FormTextField
                  name="layer_data.skewY"
                  fieldKey="skewY"
                  label="Skew (Y)"
                  variant="outlined"
                  type="number"
                  inputProps={{
                    step: 0.1,
                  }}
                  value={mathRound2(values.layer_data.skewY)}
                  disabled={!editable}
                  error={Boolean(
                    touched.layer_data &&
                      touched.layer_data.skewY &&
                      errors.layer_data &&
                      errors.layer_data.skewY
                  )}
                  helperText={
                    touched.layer_data &&
                    touched.layer_data.skewY &&
                    errors.layer_data &&
                    errors.layer_data.skewY
                  }
                  onBlur={handleBlur}
                  onUpdateField={onLayerDataUpdateOnly}
                  onUpdateDB={onLayerDataUpdate}
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
            </Grid>
          </Grid>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
});

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Grid,
  Typography,
} from "@material-ui/core";
import { ExpandMore as ExpandMoreIcon } from "@material-ui/icons";
import { AllowedLayerProps, LayerTypes } from "constant";
import { focusBoardQuickly, mathRound2 } from "helper";
import React, { useMemo, useState } from "react";

import { FormTextField } from "../../../components";

export const CornerProperty = React.memo((props) => {
  const {
    editable,
    errors,
    handleBlur,
    onLayerDataUpdate,
    onLayerDataUpdateOnly,
    touched,
    values,
  } = props;
  const layerDataProperties = [
    "cornerTopLeft",
    "cornerTopRight",
    "cornerBottomLeft",
    "cornerBottomRight",
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
        <Typography variant="subtitle1">Corner Radius</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box display="flex" flexDirection="column" width="100%">
          <Grid container spacing={2}>
            <Grid item xs={6}>
              {AllowedLayerTypes.includes("layer_data.cornerTopLeft") ? (
                <FormTextField
                  name="layer_data.cornerTopLeft"
                  fieldKey="cornerTopLeft"
                  label="Top Left"
                  variant="outlined"
                  type="number"
                  value={mathRound2(values.layer_data.cornerTopLeft)}
                  disabled={!editable}
                  error={Boolean(
                    touched.layer_data &&
                      touched.layer_data.cornerTopLeft &&
                      errors.layer_data &&
                      errors.layer_data.cornerTopLeft
                  )}
                  helperText={
                    touched.layer_data &&
                    touched.layer_data.cornerTopLeft &&
                    errors.layer_data &&
                    errors.layer_data.cornerTopLeft
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
            <Grid item xs={6}>
              {AllowedLayerTypes.includes("layer_data.cornerTopRight") ? (
                <FormTextField
                  name="layer_data.cornerTopRight"
                  fieldKey="cornerTopRight"
                  label="Top Right"
                  variant="outlined"
                  type="number"
                  value={mathRound2(values.layer_data.cornerTopRight)}
                  disabled={!editable}
                  error={Boolean(
                    touched.layer_data &&
                      touched.layer_data.cornerTopRight &&
                      errors.layer_data &&
                      errors.layer_data.cornerTopRight
                  )}
                  helperText={
                    touched.layer_data &&
                    touched.layer_data.cornerTopRight &&
                    errors.layer_data &&
                    errors.layer_data.cornerTopRight
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
            <Grid item xs={6}>
              {AllowedLayerTypes.includes("layer_data.cornerBottomLeft") ? (
                <FormTextField
                  name="layer_data.cornerBottomLeft"
                  fieldKey="cornerBottomLeft"
                  label="Bottom Left"
                  isNumber
                  value={mathRound2(values.layer_data.cornerBottomLeft)}
                  disabled={!editable}
                  error={Boolean(
                    touched.layer_data &&
                      touched.layer_data.cornerBottomLeft &&
                      errors.layer_data &&
                      errors.layer_data.cornerBottomLeft
                  )}
                  helperText={
                    touched.layer_data &&
                    touched.layer_data.cornerBottomLeft &&
                    errors.layer_data &&
                    errors.layer_data.cornerBottomLeft
                  }
                  onBlur={handleBlur}
                  onUpdateField={onLayerDataUpdateOnly}
                  onUpdateDB={onLayerDataUpdate}
                />
              ) : (
                <></>
              )}
            </Grid>
            <Grid item xs={6}>
              {AllowedLayerTypes.includes("layer_data.cornerBottomRight") ? (
                <FormTextField
                  name="layer_data.cornerBottomRight"
                  fieldKey="cornerBottomRight"
                  label="Bottom Right"
                  isNumber
                  value={mathRound2(values.layer_data.cornerBottomRight)}
                  disabled={!editable}
                  error={Boolean(
                    touched.layer_data &&
                      touched.layer_data.cornerBottomRight &&
                      errors.layer_data &&
                      errors.layer_data.cornerBottomRight
                  )}
                  helperText={
                    touched.layer_data &&
                    touched.layer_data.cornerBottomRight &&
                    errors.layer_data &&
                    errors.layer_data.cornerBottomRight
                  }
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

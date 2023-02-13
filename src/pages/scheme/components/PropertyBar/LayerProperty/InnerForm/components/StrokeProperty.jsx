import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Grid,
  MenuItem,
  Typography,
} from "@material-ui/core";
import { ExpandMore as ExpandMoreIcon } from "@material-ui/icons";
import { AllowedLayerProps, LayerTypes } from "constant";
import { focusBoardQuickly } from "helper";
import React, { useMemo, useState } from "react";

import {
  FormColorPickerInput,
  FormSelect,
  FormSliderInput,
} from "../../../components";
import { LabelTypography } from "../../../PropertyBar.style";

export const StrokeProperty = React.memo((props) => {
  const {
    editable,
    errors,
    values,
    onLayerDataUpdateOnly,
    onLayerDataUpdate,
  } = props;
  const layerDataProperties = ["stroke", "scolor", "strokeType"];
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
        <Typography variant="subtitle1">Stroke</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box display="flex" flexDirection="column" width="100%">
          {AllowedLayerTypes.includes("layer_data.scolor") ? (
            <Box display="flex" alignItems="center" height="40px">
              <Grid
                container
                component={Box}
                alignItems="center"
                justifyContent="space-between"
                spacing={2}
              >
                <Grid item xs={6}>
                  <LabelTypography variant="body1" color="textSecondary" mr={2}>
                    Stroke Color
                  </LabelTypography>
                </Grid>
                <Grid item xs={6}>
                  <FormColorPickerInput
                    value={values.layer_data.scolor}
                    fieldKey="scolor"
                    disabled={!editable}
                    error={Boolean(
                      errors.layer_data && errors.layer_data.scolor
                    )}
                    helperText={errors.layer_data && errors.layer_data.scolor}
                    onUpdateDB={onLayerDataUpdate}
                  />
                </Grid>
              </Grid>
            </Box>
          ) : (
            <></>
          )}
          {AllowedLayerTypes.includes("layer_data.stroke") ? (
            <Box display="flex" alignItems="center" height="40px">
              <FormSliderInput
                label="Stroke Width"
                fieldKey="stroke"
                min={0}
                max={10}
                value={values.layer_data.stroke}
                disabled={!editable}
                onUpdateField={onLayerDataUpdateOnly}
                onUpdateDB={onLayerDataUpdate}
              />
            </Box>
          ) : (
            <></>
          )}
          {AllowedLayerTypes.includes("layer_data.strokeType") ? (
            <Box display="flex" alignItems="center" height="40px">
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <LabelTypography variant="body1" color="textSecondary" mr={2}>
                    Stroke Type
                  </LabelTypography>
                </Grid>
                <Grid item xs={6}>
                  <FormSelect
                    name="layer_data.strokeType"
                    fieldKey="strokeType"
                    value={values.layer_data.strokeType}
                    disabled={!editable}
                    onUpdateField={onLayerDataUpdateOnly}
                    onUpdateDB={onLayerDataUpdate}
                  >
                    <MenuItem value="inside">Inside</MenuItem>
                    <MenuItem value="middle">Middle</MenuItem>
                    <MenuItem value="outside">Outside</MenuItem>
                  </FormSelect>
                </Grid>
              </Grid>
            </Box>
          ) : (
            <></>
          )}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
});

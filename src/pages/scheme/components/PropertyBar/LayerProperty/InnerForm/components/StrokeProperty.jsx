import React, { useState, useMemo, useCallback } from "react";

import { AllowedLayerProps, LayerTypes } from "constant";

import {
  Box,
  Typography,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Select,
  MenuItem,
} from "@material-ui/core";
import { ExpandMore as ExpandMoreIcon } from "@material-ui/icons";

import { ColorPickerInput, SliderInput } from "components/common";
import { LabelTypography } from "../../../PropertyBar.style";
import { focusBoardQuickly } from "helper";
import { useDebouncedCallback } from "use-debounce";

export const StrokeProperty = React.memo((props) => {
  const { editable, errors, values, setFieldValue, onDataFieldChange } = props;
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

  const handleScolorChangeDebounced = useDebouncedCallback(
    (color) => onDataFieldChange("scolor", color),
    1000
  );

  const handleScolorChange = useCallback(
    (value) => {
      setFieldValue(`layer_data.scolor`, value);
      handleScolorChangeDebounced(value);
    },
    [handleScolorChangeDebounced, setFieldValue]
  );

  const handleStrokeChangeDebounced = useDebouncedCallback(
    (color) => onDataFieldChange("stroke", color),
    1000
  );

  const handleStrokeChange = useCallback(
    (value) => {
      setFieldValue(`layer_data.stroke`, value);
      handleStrokeChangeDebounced(value);
    },
    [handleStrokeChangeDebounced, setFieldValue]
  );

  const handleStrokeTypeChangeDebounced = useDebouncedCallback(
    (value) => onDataFieldChange("strokeType", value),
    1000
  );

  const handleStrokeTypeChange = useCallback(
    (e) => {
      const value = e.target.value;
      setFieldValue(`layer_data.strokeType`, value);
      handleStrokeTypeChangeDebounced(value);
    },
    [handleStrokeTypeChangeDebounced, setFieldValue]
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
                  <ColorPickerInput
                    value={values.layer_data.scolor}
                    disabled={!editable}
                    onChange={handleScolorChange}
                    onInputChange={handleScolorChange}
                    error={Boolean(
                      errors.layer_data && errors.layer_data.scolor
                    )}
                    helperText={errors.layer_data && errors.layer_data.scolor}
                  />
                </Grid>
              </Grid>
            </Box>
          ) : (
            <></>
          )}
          {AllowedLayerTypes.includes("layer_data.stroke") ? (
            <Box display="flex" alignItems="center" height="40px">
              <SliderInput
                label="Stroke Width"
                min={0}
                max={10}
                small
                value={values.layer_data.stroke}
                disabled={!editable}
                setValue={handleStrokeChange}
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
                  <Select
                    name="layer_data.strokeType"
                    variant="outlined"
                    value={values.layer_data.strokeType}
                    disabled={!editable}
                    onChange={handleStrokeTypeChange}
                    fullWidth
                  >
                    <MenuItem value="inside">Inside</MenuItem>
                    <MenuItem value="middle">Middle</MenuItem>
                    <MenuItem value="outside">Outside</MenuItem>
                  </Select>
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

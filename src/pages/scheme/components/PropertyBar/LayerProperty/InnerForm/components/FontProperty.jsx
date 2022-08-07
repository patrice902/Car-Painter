import React, { useState, useMemo, useCallback } from "react";
import styled from "styled-components/macro";
import { AllowedLayerProps, LayerTypes } from "constant";

import {
  Box,
  FormControl as MuiFormControl,
  Typography,
  InputLabel,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@material-ui/core";
import { spacing } from "@material-ui/system";
import { ExpandMore as ExpandMoreIcon } from "@material-ui/icons";
import { FontSelect, ColorPickerInput, SliderInput } from "components/common";
import { LabelTypography } from "../../../PropertyBar.style";
import { focusBoardQuickly } from "helper";
import { useDebouncedCallback } from "use-debounce";

const FormControl = styled(MuiFormControl)(spacing);

export const FontProperty = React.memo((props) => {
  const {
    editable,
    errors,
    values,
    fontList,
    setFieldValue,
    onDataFieldChange,
  } = props;
  const layerDataProperties = ["font", "size"];
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
    (fontID) => onDataFieldChange("font", fontID),
    1000
  );

  const handleFontChange = useCallback(
    (value) => {
      setFieldValue(`layer_data.font`, value);
      handleFontChangeDebounced(value);
    },
    [handleFontChangeDebounced, setFieldValue]
  );

  const handleColorChangeDebounced = useDebouncedCallback(
    (color) => onDataFieldChange("color", color),
    1000
  );

  const handleColorChange = useCallback(
    (value) => {
      setFieldValue(`layer_data.color`, value);
      handleColorChangeDebounced(value);
    },
    [handleColorChangeDebounced, setFieldValue]
  );

  const handleSizeChangeDebounced = useDebouncedCallback(
    (size) => onDataFieldChange("size", size),
    1000
  );

  const handleSizeChange = useCallback(
    (value) => {
      setFieldValue(`layer_data.size`, value);
      handleSizeChangeDebounced(value);
    },
    [handleSizeChangeDebounced, setFieldValue]
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
        <Typography variant="subtitle1">Font</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box display="flex" flexDirection="column" width="100%">
          {AllowedLayerTypes.includes("layer_data.font") ? (
            <FormControl variant="outlined" mt={2}>
              <InputLabel id="font-select-label">Font</InputLabel>
              <FontSelect
                value={values.layer_data.font}
                disabled={!editable}
                onChange={handleFontChange}
                fontList={fontList}
              />
            </FormControl>
          ) : (
            <></>
          )}
          {AllowedLayerTypes.includes("layer_data.color") ? (
            <Box display="flex" alignItems="center" height="40px">
              <Grid container component={Box} alignItems="center" spacing={2}>
                <Grid item xs={6}>
                  <LabelTypography variant="body1" color="textSecondary" mr={2}>
                    Font Color
                  </LabelTypography>
                </Grid>
                <Grid item xs={6}>
                  <ColorPickerInput
                    value={values.layer_data.color}
                    disabled={!editable}
                    onChange={handleColorChange}
                    onInputChange={handleColorChange}
                    error={Boolean(
                      errors.layer_data && errors.layer_data.color
                    )}
                    helperText={errors.layer_data && errors.layer_data.color}
                  />
                </Grid>
              </Grid>
            </Box>
          ) : (
            <></>
          )}
          {AllowedLayerTypes.includes("layer_data.size") ? (
            <Box display="flex" alignItems="center" height="40px">
              <SliderInput
                label="Font Size"
                disabled={!editable}
                min={6}
                max={512}
                value={values.layer_data.size}
                setValue={handleSizeChange}
              />
            </Box>
          ) : (
            <></>
          )}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
});

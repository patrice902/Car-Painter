import React, { useState, useMemo, useCallback } from "react";
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
import { SmallTextField } from "../../../PropertyBar.style";
import { useDebouncedCallback } from "use-debounce";

export const SkewProperty = React.memo((props) => {
  const {
    editable,
    errors,
    handleBlur,
    touched,
    values,
    setFieldValue,
    onDataFieldChange,
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

  const handleSkewXChangeDebounced = useDebouncedCallback(
    (value) => onDataFieldChange("skewX", value),
    1000
  );

  const handleSkewXChange = useCallback(
    (e) => {
      const value = Number(e.target.value) || 0;
      setFieldValue(`layer_data.skewX`, value);
      handleSkewXChangeDebounced(value);
    },
    [handleSkewXChangeDebounced, setFieldValue]
  );

  const handleSkewYChangeDebounced = useDebouncedCallback(
    (value) => onDataFieldChange("skewY", value),
    1000
  );

  const handleSkewYChange = useCallback(
    (e) => {
      const value = Number(e.target.value) || 0;
      setFieldValue(`layer_data.skewY`, value);
      handleSkewYChangeDebounced(value);
    },
    [handleSkewYChangeDebounced, setFieldValue]
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
                <SmallTextField
                  name="layer_data.skewX"
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
                  onChange={handleSkewXChange}
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
                <SmallTextField
                  name="layer_data.skewY"
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
                  onChange={handleSkewYChange}
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

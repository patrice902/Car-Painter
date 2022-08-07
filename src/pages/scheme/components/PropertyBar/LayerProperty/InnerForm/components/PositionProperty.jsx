import React, { useState, useMemo, useCallback } from "react";
import { AllowedLayerProps, LayerTypes } from "constant";
import { focusBoardQuickly, mathRound2 } from "helper";

import {
  Box,
  Typography,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@material-ui/core";
import { ExpandMore as ExpandMoreIcon } from "@material-ui/icons";
import { SmallTextField } from "../../../PropertyBar.style";
import { useDebouncedCallback } from "use-debounce";

export const PositionProperty = React.memo((props) => {
  const {
    editable,
    errors,
    handleBlur,
    touched,
    values,
    setFieldValue,
    onDataFieldChange,
  } = props;
  const layerDataProperties = ["left", "top"];
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

  const handleLeftChangeDebounced = useDebouncedCallback(
    (value) => onDataFieldChange("left", value),
    1000
  );

  const handleLeftChange = useCallback(
    (e) => {
      const value = Number(e.target.value) || 0;
      setFieldValue(`layer_data.left`, value);
      handleLeftChangeDebounced(value);
    },
    [handleLeftChangeDebounced, setFieldValue]
  );

  const handleTopChangeDebounced = useDebouncedCallback(
    (value) => onDataFieldChange("top", value),
    1000
  );

  const handleTopChange = useCallback(
    (e) => {
      const value = Number(e.target.value) || 0;
      setFieldValue(`layer_data.top`, value);
      handleTopChangeDebounced(value);
    },
    [handleTopChangeDebounced, setFieldValue]
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
        <Typography variant="subtitle1">Position</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box display="flex" flexDirection="column" width="100%">
          <Grid container spacing={2}>
            <Grid item sm={6}>
              {AllowedLayerTypes.includes("layer_data.left") ? (
                <SmallTextField
                  name="layer_data.left"
                  label="X"
                  variant="outlined"
                  type="number"
                  value={mathRound2(values.layer_data.left)}
                  disabled={!editable}
                  error={Boolean(
                    touched.layer_data &&
                      touched.layer_data.left &&
                      errors.layer_data &&
                      errors.layer_data.left
                  )}
                  helperText={
                    touched.layer_data &&
                    touched.layer_data.left &&
                    errors.layer_data &&
                    errors.layer_data.left
                  }
                  onBlur={handleBlur}
                  onChange={handleLeftChange}
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
              {AllowedLayerTypes.includes("layer_data.top") ? (
                <SmallTextField
                  name="layer_data.top"
                  label="Y"
                  variant="outlined"
                  type="number"
                  value={mathRound2(values.layer_data.top)}
                  disabled={!editable}
                  error={Boolean(
                    touched.layer_data &&
                      touched.layer_data.top &&
                      errors.layer_data &&
                      errors.layer_data.top
                  )}
                  helperText={
                    touched.layer_data &&
                    touched.layer_data.top &&
                    errors.layer_data &&
                    errors.layer_data.top
                  }
                  onBlur={handleBlur}
                  onChange={handleTopChange}
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

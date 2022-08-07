import React, { useState, useMemo, useCallback } from "react";
import { AllowedLayerProps, LayerTypes } from "constant";
import { focusBoardQuickly, mathRound2 } from "helper";
import { useDebouncedCallback } from "use-debounce";

import {
  Grid,
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@material-ui/core";
import { ExpandMore as ExpandMoreIcon } from "@material-ui/icons";
import { SmallTextField } from "../../../PropertyBar.style";

export const CornerProperty = React.memo((props) => {
  const {
    editable,
    errors,
    handleBlur,
    setFieldValue,
    onDataFieldChange,
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

  const handleCornerTopLeftChangeDebounced = useDebouncedCallback(
    (value) => onDataFieldChange("cornerTopLeft", value),
    1000
  );

  const handleCornerTopLeftChange = useCallback(
    (e) => {
      const value = Number(e.target.value) || 0;
      setFieldValue(`layer_data.cornerTopLeft`, value);
      handleCornerTopLeftChangeDebounced(value);
    },
    [handleCornerTopLeftChangeDebounced, setFieldValue]
  );

  const handleCornerTopRightChangeDebounced = useDebouncedCallback(
    (value) => onDataFieldChange("cornerTopRight", Number(value) || 0),
    1000
  );

  const handleCornerTopRightChange = useCallback(
    (e) => {
      const value = Number(e.target.value) || 0;
      setFieldValue(`layer_data.cornerTopRight`, value);
      handleCornerTopRightChangeDebounced(value);
    },
    [handleCornerTopRightChangeDebounced, setFieldValue]
  );

  const handleCornerBottomLeftChangeDebounced = useDebouncedCallback(
    (value) => onDataFieldChange("cornerBottomLeft", Number(value) || 0),
    1000
  );

  const handleCornerBottomLeftChange = useCallback(
    (e) => {
      const value = Number(e.target.value) || 0;
      setFieldValue(`layer_data.cornerBottomLeft`, value);
      handleCornerBottomLeftChangeDebounced(value);
    },
    [handleCornerBottomLeftChangeDebounced, setFieldValue]
  );

  const handleCornerBottomRightChangeDebounced = useDebouncedCallback(
    (value) => onDataFieldChange("cornerBottomRight", Number(value) || 0),
    1000
  );

  const handleCornerBottomRightChange = useCallback(
    (e) => {
      const value = Number(e.target.value) || 0;
      setFieldValue(`layer_data.cornerBottomRight`, value);
      handleCornerBottomRightChangeDebounced(value);
    },
    [handleCornerBottomRightChangeDebounced, setFieldValue]
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
                <SmallTextField
                  name="layer_data.cornerTopLeft"
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
                  onBlur={handleBlur}
                  onChange={handleCornerTopLeftChange}
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
            <Grid item xs={6}>
              {AllowedLayerTypes.includes("layer_data.cornerTopRight") ? (
                <SmallTextField
                  name="layer_data.cornerTopRight"
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
                  onBlur={handleBlur}
                  onChange={handleCornerTopRightChange}
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
            <Grid item xs={6}>
              {AllowedLayerTypes.includes("layer_data.cornerBottomLeft") ? (
                <SmallTextField
                  name="layer_data.cornerBottomLeft"
                  label="Bottom Left"
                  variant="outlined"
                  type="number"
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
                  onChange={handleCornerBottomLeftChange}
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
            <Grid item xs={6}>
              {AllowedLayerTypes.includes("layer_data.cornerBottomRight") ? (
                <SmallTextField
                  name="layer_data.cornerBottomRight"
                  label="Bottom Right"
                  variant="outlined"
                  type="number"
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
                  onChange={handleCornerBottomRightChange}
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

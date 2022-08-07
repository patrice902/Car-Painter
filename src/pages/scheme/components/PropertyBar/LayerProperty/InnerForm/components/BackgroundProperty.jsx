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
} from "components/MaterialUI";
import { ExpandMore as ExpandMoreIcon } from "@material-ui/icons";
import { useDebouncedCallback } from "use-debounce";

import { ColorPickerInput } from "components/common";
import { LabelTypography, SmallTextField } from "../../../PropertyBar.style";

export const BackgroundProperty = React.memo((props) => {
  const {
    editable,
    errors,
    handleBlur,
    touched,
    values,
    setFieldValue,
    onDataFieldChange,
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

  const handleBgColorChangeDebounced = useDebouncedCallback((value) => {
    onDataFieldChange("bgColor", value);
  }, 1000);

  const handleBgColorChange = useCallback(
    (value) => {
      setFieldValue(`layer_data.bgColor`, value);
      handleBgColorChangeDebounced(value);
    },
    [handleBgColorChangeDebounced, setFieldValue]
  );

  const handlePaddingXChangeDebounced = useDebouncedCallback(
    (value) => onDataFieldChange("paddingX", Number(value) || 0),
    1000
  );

  const handlePaddingXChange = useCallback(
    (e) => {
      const value = Number(e.target.value) || 0;
      setFieldValue(`layer_data.paddingX`, value);
      handlePaddingXChangeDebounced(value);
    },
    [handlePaddingXChangeDebounced, setFieldValue]
  );

  const handlePaddingYChangeDebounced = useDebouncedCallback(
    (value) => onDataFieldChange("paddingY", value),
    1000
  );

  const handlePaddingYChange = useCallback(
    (e) => {
      const value = Number(e.target.value) || 0;
      setFieldValue(`layer_data.paddingY`, value);
      handlePaddingYChangeDebounced(value);
    },
    [handlePaddingYChangeDebounced, setFieldValue]
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
                  <ColorPickerInput
                    value={values.layer_data.bgColor}
                    disabled={!editable}
                    onChange={handleBgColorChange}
                    onInputChange={handleBgColorChange}
                    error={Boolean(
                      errors.layer_data && errors.layer_data.bgColor
                    )}
                    helperText={errors.layer_data && errors.layer_data.bgColor}
                  />
                </Grid>
              </>
            ) : (
              <></>
            )}
            <Grid item sm={6}>
              {AllowedLayerTypes.includes("layer_data.paddingX") ? (
                <SmallTextField
                  name="layer_data.paddingX"
                  label="Padding (X)"
                  variant="outlined"
                  type="number"
                  disabled={!editable}
                  value={mathRound2(values.layer_data.paddingX)}
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
                  onBlur={handleBlur}
                  onChange={handlePaddingXChange}
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
              {AllowedLayerTypes.includes("layer_data.paddingY") ? (
                <SmallTextField
                  name="layer_data.paddingY"
                  label="Padding (Y)"
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
                  onBlur={handleBlur}
                  onChange={handlePaddingYChange}
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

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Grid,
  Typography,
} from "@material-ui/core";
import { ExpandMore as ExpandMoreIcon } from "@material-ui/icons";
import { FormikProps } from "formik";
import React, { useCallback, useMemo, useState } from "react";
import {
  focusBoardQuickly,
  getAllowedLayerTypes,
  mathRound2,
} from "src/helper";
import {
  BuilderLayerJSONParitalAll,
  PartialAllLayerData,
  ValueMap,
} from "src/types/common";

import {
  FormColorPickerInput,
  FormSliderInput,
  FormTextField,
} from "../../../components";
import { LabelTypography } from "../../../PropertyBar.style";

type ShadowPropertyProps = {
  editable: boolean;
  onLayerDataUpdateOnly: (valueMap: PartialAllLayerData) => void;
  onLayerDataUpdate: (valueMap: PartialAllLayerData) => void;
} & FormikProps<BuilderLayerJSONParitalAll>;

export const ShadowProperty = React.memo(
  ({
    editable,
    errors,
    handleBlur,
    touched,
    values,
    onLayerDataUpdateOnly,
    onLayerDataUpdate,
  }: ShadowPropertyProps) => {
    const DefaultBlurToSet = 10;
    const layerDataProperties = [
      "shadowColor",
      "shadowBlur",
      "shadowOpacity",
      "shadowOffsetX",
      "shadowOffsetY",
    ];
    const [expanded, setExpanded] = useState(true);
    const AllowedLayerTypes = useMemo(() => getAllowedLayerTypes(values), [
      values,
    ]);

    const colorMapFunc = useCallback(
      (value: string) => {
        const updatingMap: ValueMap = {
          shadowColor: value,
        };

        if (
          (!values.layer_data.shadowColor ||
            values.layer_data.shadowColor === "transparent") &&
          !values.layer_data.shadowBlur
        ) {
          updatingMap.shadowBlur = DefaultBlurToSet;
        }

        return updatingMap;
      },
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
          <Typography variant="subtitle1">Shadow</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box display="flex" flexDirection="column" width="100%">
            {AllowedLayerTypes.includes("layer_data.shadowColor") ? (
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box display="flex" alignItems="center" height="100%">
                    <LabelTypography
                      variant="body1"
                      color="textSecondary"
                      style={{ marginRight: "8px" }}
                    >
                      Shadow Color
                    </LabelTypography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <FormColorPickerInput
                    value={values.layer_data.shadowColor}
                    fieldKey="shadowColor"
                    disabled={!editable}
                    error={Boolean(errors.layer_data?.shadowColor)}
                    helperText={errors.layer_data?.shadowColor}
                    fieldFunc={colorMapFunc}
                    onUpdateDB={onLayerDataUpdate}
                  />
                </Grid>
              </Grid>
            ) : (
              <></>
            )}
            {AllowedLayerTypes.includes("layer_data.shadowOpacity") ? (
              <Box height="40px" display="flex" alignItems="center">
                <FormSliderInput
                  label="Opacity"
                  fieldKey="shadowOpacity"
                  min={0}
                  max={1}
                  step={0.01}
                  value={values.layer_data.shadowOpacity}
                  disabled={!editable}
                  onUpdateField={onLayerDataUpdateOnly}
                  onUpdateDB={onLayerDataUpdate}
                />
              </Box>
            ) : (
              <></>
            )}
            {AllowedLayerTypes.includes("layer_data.shadowBlur") ? (
              <FormTextField
                name="layer_data.shadowBlur"
                fieldKey="shadowBlur"
                label="Shadow Blur"
                variant="outlined"
                type="number"
                value={mathRound2(values.layer_data.shadowBlur ?? 0)}
                disabled={!editable}
                error={Boolean(
                  touched.layer_data?.shadowBlur &&
                    errors.layer_data?.shadowBlur
                )}
                helperText={
                  touched.layer_data?.shadowBlur &&
                  errors.layer_data?.shadowBlur
                }
                onBlur={handleBlur}
                onUpdateField={onLayerDataUpdateOnly}
                onUpdateDB={onLayerDataUpdate}
                fullWidth
                margin="normal"
                style={{ marginBottom: "16px" }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            ) : (
              <></>
            )}
            <Grid container spacing={2}>
              <Grid item sm={6}>
                {AllowedLayerTypes.includes("layer_data.shadowOffsetX") ? (
                  <FormTextField
                    name="layer_data.shadowOffsetX"
                    fieldKey="shadowOffsetX"
                    label="Offset (X)"
                    variant="outlined"
                    type="number"
                    value={mathRound2(values.layer_data.shadowOffsetX ?? 0)}
                    disabled={!editable}
                    error={Boolean(
                      touched.layer_data?.shadowOffsetX &&
                        errors.layer_data?.shadowOffsetX
                    )}
                    helperText={
                      touched.layer_data?.shadowOffsetX &&
                      errors.layer_data?.shadowOffsetX
                    }
                    onBlur={handleBlur}
                    onUpdateField={onLayerDataUpdateOnly}
                    onUpdateDB={onLayerDataUpdate}
                    fullWidth
                    margin="normal"
                    style={{ marginBottom: "16px" }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                ) : (
                  <></>
                )}
              </Grid>
              <Grid item sm={6}>
                {AllowedLayerTypes.includes("layer_data.shadowOffsetY") ? (
                  <FormTextField
                    name="layer_data.shadowOffsetY"
                    fieldKey="shadowOffsetY"
                    label="Offset (Y)"
                    variant="outlined"
                    type="number"
                    value={mathRound2(values.layer_data.shadowOffsetY ?? 0)}
                    disabled={!editable}
                    error={Boolean(
                      touched.layer_data?.shadowOffsetY &&
                        errors.layer_data?.shadowOffsetY
                    )}
                    helperText={
                      touched.layer_data?.shadowOffsetY &&
                      errors.layer_data?.shadowOffsetY
                    }
                    onBlur={handleBlur}
                    onUpdateField={onLayerDataUpdateOnly}
                    onUpdateDB={onLayerDataUpdate}
                    fullWidth
                    margin="normal"
                    style={{ marginBottom: "16px" }}
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
  }
);

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
import React, { useMemo, useState } from "react";
import {
  focusBoardQuickly,
  getAllowedLayerTypes,
  mathRound2,
} from "src/helper";
import {
  BuilderLayerJSONParitalAll,
  PartialAllLayerData,
} from "src/types/common";

import { FormColorPickerInput, FormTextField } from "../../../components";
import { LabelTypography } from "../../../PropertyBar.style";

type BackgroundPropertyProps = {
  editable: boolean;
  onLayerDataUpdateOnly: (valueMap: PartialAllLayerData) => void;
  onLayerDataUpdate: (valueMap: PartialAllLayerData) => void;
} & FormikProps<BuilderLayerJSONParitalAll>;

export const BackgroundProperty = React.memo(
  ({
    editable,
    errors,
    handleBlur,
    touched,
    values,
    onLayerDataUpdateOnly,
    onLayerDataUpdate,
  }: BackgroundPropertyProps) => {
    const layerDataProperties = [
      "bgColor",
      "paddingX",
      "paddingY",
      "bgCornerTopLeft",
      "bgCornerTopRight",
      "bgCornerBottomLeft",
      "bgCornerBottomRight",
    ];
    const [expanded, setExpanded] = useState(true);
    const AllowedLayerTypes = useMemo(() => getAllowedLayerTypes(values), [
      values,
    ]);

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
                    <FormColorPickerInput
                      value={values.layer_data.bgColor}
                      fieldKey="bgColor"
                      disabled={!editable}
                      error={Boolean(errors.layer_data?.bgColor)}
                      helperText={errors.layer_data?.bgColor}
                      onUpdateDB={onLayerDataUpdate}
                    />
                  </Grid>
                </>
              ) : (
                <></>
              )}
              <Grid item sm={6}>
                {AllowedLayerTypes.includes("layer_data.paddingX") ? (
                  <FormTextField
                    name="layer_data.paddingX"
                    fieldKey="paddingX"
                    label="Padding (X)"
                    variant="outlined"
                    value={mathRound2(values.layer_data.paddingX ?? 0)}
                    type="number"
                    disabled={!editable}
                    error={Boolean(
                      touched.layer_data?.paddingX &&
                        errors.layer_data?.paddingX
                    )}
                    helperText={
                      touched.layer_data?.paddingX &&
                      errors.layer_data?.paddingX
                    }
                    fullWidth
                    margin="normal"
                    style={{
                      marginBottom: "16px",
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      min: 0,
                      max: 99999,
                    }}
                    onBlur={handleBlur}
                    onUpdateField={onLayerDataUpdateOnly}
                    onUpdateDB={onLayerDataUpdate}
                  />
                ) : (
                  <></>
                )}
              </Grid>
              <Grid item sm={6}>
                {AllowedLayerTypes.includes("layer_data.paddingY") ? (
                  <FormTextField
                    name="layer_data.paddingY"
                    label="Padding (Y)"
                    fieldKey="paddingY"
                    variant="outlined"
                    type="number"
                    value={mathRound2(values.layer_data.paddingY ?? 0)}
                    disabled={!editable}
                    error={Boolean(
                      touched.layer_data?.paddingY &&
                        errors.layer_data?.paddingY
                    )}
                    helperText={
                      touched.layer_data?.paddingY &&
                      errors.layer_data?.paddingY
                    }
                    fullWidth
                    margin="normal"
                    style={{
                      marginBottom: "16px",
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      min: 0,
                      max: 99999,
                    }}
                    onBlur={handleBlur}
                    onUpdateField={onLayerDataUpdateOnly}
                    onUpdateDB={onLayerDataUpdate}
                  />
                ) : (
                  <></>
                )}
              </Grid>
              {values.layer_data.bgColor ? (
                <>
                  <Grid item xs={6}>
                    {AllowedLayerTypes.includes(
                      "layer_data.bgCornerTopLeft"
                    ) ? (
                      <FormTextField
                        name="layer_data.bgCornerTopLeft"
                        fieldKey="bgCornerTopLeft"
                        label="Top Left"
                        variant="outlined"
                        type="number"
                        value={mathRound2(
                          values.layer_data.bgCornerTopLeft ?? 0
                        )}
                        disabled={!editable}
                        error={Boolean(
                          touched.layer_data?.bgCornerTopLeft &&
                            errors.layer_data?.bgCornerTopLeft
                        )}
                        helperText={
                          touched.layer_data?.bgCornerTopLeft &&
                          errors.layer_data?.bgCornerTopLeft
                        }
                        fullWidth
                        margin="normal"
                        style={{ marginBottom: "16px" }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        inputProps={{
                          min: 0,
                          max: 99999,
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
                    {AllowedLayerTypes.includes(
                      "layer_data.bgCornerTopRight"
                    ) ? (
                      <FormTextField
                        name="layer_data.bgCornerTopRight"
                        fieldKey="bgCornerTopRight"
                        label="Top Right"
                        variant="outlined"
                        type="number"
                        value={mathRound2(
                          values.layer_data.bgCornerTopRight ?? 0
                        )}
                        disabled={!editable}
                        error={Boolean(
                          touched.layer_data?.bgCornerTopRight &&
                            errors.layer_data?.bgCornerTopRight
                        )}
                        helperText={
                          touched.layer_data?.bgCornerTopRight &&
                          errors.layer_data?.bgCornerTopRight
                        }
                        fullWidth
                        margin="normal"
                        style={{ marginBottom: "16px" }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        inputProps={{
                          min: 0,
                          max: 99999,
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
                    {AllowedLayerTypes.includes(
                      "layer_data.bgCornerBottomLeft"
                    ) ? (
                      <FormTextField
                        name="layer_data.bgCornerBottomLeft"
                        fieldKey="bgCornerBottomLeft"
                        label="Bottom Left"
                        variant="outlined"
                        type="number"
                        value={mathRound2(
                          values.layer_data.bgCornerBottomLeft ?? 0
                        )}
                        disabled={!editable}
                        error={Boolean(
                          touched.layer_data?.bgCornerBottomLeft &&
                            errors.layer_data?.bgCornerBottomLeft
                        )}
                        helperText={
                          touched.layer_data?.bgCornerBottomLeft &&
                          errors.layer_data?.bgCornerBottomLeft
                        }
                        fullWidth
                        margin="normal"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        inputProps={{
                          min: 0,
                          max: 99999,
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
                    {AllowedLayerTypes.includes(
                      "layer_data.bgCornerBottomRight"
                    ) ? (
                      <FormTextField
                        name="layer_data.bgCornerBottomRight"
                        fieldKey="bgCornerBottomRight"
                        label="Bottom Right"
                        variant="outlined"
                        type="number"
                        value={mathRound2(
                          values.layer_data.bgCornerBottomRight ?? 0
                        )}
                        disabled={!editable}
                        error={Boolean(
                          touched.layer_data?.bgCornerBottomRight &&
                            errors.layer_data?.bgCornerBottomRight
                        )}
                        helperText={
                          touched.layer_data?.bgCornerBottomRight &&
                          errors.layer_data?.bgCornerBottomRight
                        }
                        fullWidth
                        margin="normal"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        inputProps={{
                          min: 0,
                          max: 99999,
                        }}
                        onBlur={handleBlur}
                        onUpdateField={onLayerDataUpdateOnly}
                        onUpdateDB={onLayerDataUpdate}
                      />
                    ) : (
                      <></>
                    )}
                  </Grid>
                </>
              ) : (
                <></>
              )}
            </Grid>
          </Box>
        </AccordionDetails>
      </Accordion>
    );
  }
);

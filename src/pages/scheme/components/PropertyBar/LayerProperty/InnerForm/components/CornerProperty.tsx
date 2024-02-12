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

import { FormTextField } from "../../../components";

type CornerPropertyProps = {
  editable: boolean;
  onLayerDataUpdateOnly: (valueMap: PartialAllLayerData) => void;
  onLayerDataUpdate: (valueMap: PartialAllLayerData) => void;
} & FormikProps<BuilderLayerJSONParitalAll>;

export const CornerProperty = React.memo(
  ({
    editable,
    errors,
    handleBlur,
    onLayerDataUpdate,
    onLayerDataUpdateOnly,
    touched,
    values,
  }: CornerPropertyProps) => {
    const layerDataProperties = [
      "cornerTopLeft",
      "cornerTopRight",
      "cornerBottomLeft",
      "cornerBottomRight",
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
                    value={mathRound2(values.layer_data.cornerTopLeft ?? 0)}
                    disabled={!editable}
                    error={Boolean(
                      touched.layer_data?.cornerTopLeft &&
                        errors.layer_data?.cornerTopLeft
                    )}
                    helperText={
                      touched.layer_data?.cornerTopLeft &&
                      errors.layer_data?.cornerTopLeft
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
                {AllowedLayerTypes.includes("layer_data.cornerTopRight") ? (
                  <FormTextField
                    name="layer_data.cornerTopRight"
                    fieldKey="cornerTopRight"
                    label="Top Right"
                    variant="outlined"
                    type="number"
                    value={mathRound2(values.layer_data.cornerTopRight ?? 0)}
                    disabled={!editable}
                    error={Boolean(
                      touched.layer_data?.cornerTopRight &&
                        errors.layer_data?.cornerTopRight
                    )}
                    helperText={
                      touched.layer_data?.cornerTopRight &&
                      errors.layer_data?.cornerTopRight
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
                {AllowedLayerTypes.includes("layer_data.cornerBottomLeft") ? (
                  <FormTextField
                    name="layer_data.cornerBottomLeft"
                    fieldKey="cornerBottomLeft"
                    label="Bottom Left"
                    variant="outlined"
                    type="number"
                    value={mathRound2(values.layer_data.cornerBottomLeft ?? 0)}
                    disabled={!editable}
                    error={Boolean(
                      touched.layer_data?.cornerBottomLeft &&
                        errors.layer_data?.cornerBottomLeft
                    )}
                    helperText={
                      touched.layer_data?.cornerBottomLeft &&
                      errors.layer_data?.cornerBottomLeft
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
                {AllowedLayerTypes.includes("layer_data.cornerBottomRight") ? (
                  <FormTextField
                    name="layer_data.cornerBottomRight"
                    fieldKey="cornerBottomRight"
                    label="Bottom Right"
                    variant="outlined"
                    type="number"
                    value={mathRound2(values.layer_data.cornerBottomRight ?? 0)}
                    disabled={!editable}
                    error={Boolean(
                      touched.layer_data?.cornerBottomRight &&
                        errors.layer_data?.cornerBottomRight
                    )}
                    helperText={
                      touched.layer_data?.cornerBottomRight &&
                      errors.layer_data?.cornerBottomRight
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
            </Grid>
          </Box>
        </AccordionDetails>
      </Accordion>
    );
  }
);

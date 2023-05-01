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

type SkewPropertyProps = {
  editable: boolean;
  onLayerDataUpdateOnly: (valueMap: PartialAllLayerData) => void;
  onLayerDataUpdate: (valueMap: PartialAllLayerData) => void;
} & FormikProps<BuilderLayerJSONParitalAll>;

export const SkewProperty = React.memo(
  ({
    editable,
    errors,
    handleBlur,
    touched,
    values,
    onLayerDataUpdateOnly,
    onLayerDataUpdate,
  }: SkewPropertyProps) => {
    const layerDataProperties = ["skewX", "skewY"];
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
          <Typography variant="subtitle1">Skew</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box display="flex" flexDirection="column" width="100%">
            <Grid container spacing={2}>
              <Grid item sm={6}>
                {AllowedLayerTypes.includes("layer_data.skewX") ? (
                  <FormTextField
                    name="layer_data.skewX"
                    fieldKey="skewX"
                    label="Skew (X)"
                    variant="outlined"
                    type="number"
                    inputProps={{
                      step: 0.1,
                    }}
                    value={mathRound2(values.layer_data.skewX ?? 0)}
                    disabled={!editable}
                    error={Boolean(
                      touched.layer_data?.skewX && errors.layer_data?.skewX
                    )}
                    helperText={
                      touched.layer_data?.skewX && errors.layer_data?.skewX
                    }
                    onBlur={handleBlur}
                    onUpdateField={onLayerDataUpdateOnly}
                    onUpdateDB={onLayerDataUpdate}
                    fullWidth
                    margin="normal"
                    style={{
                      marginBottom: "16px",
                    }}
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
                  <FormTextField
                    name="layer_data.skewY"
                    fieldKey="skewY"
                    label="Skew (Y)"
                    variant="outlined"
                    type="number"
                    inputProps={{
                      step: 0.1,
                    }}
                    value={mathRound2(values.layer_data.skewY ?? 0)}
                    disabled={!editable}
                    error={Boolean(
                      touched.layer_data?.skewY && errors.layer_data?.skewY
                    )}
                    helperText={
                      touched.layer_data?.skewY && errors.layer_data?.skewY
                    }
                    onBlur={handleBlur}
                    onUpdateField={onLayerDataUpdateOnly}
                    onUpdateDB={onLayerDataUpdate}
                    fullWidth
                    margin="normal"
                    style={{
                      marginBottom: "16px",
                    }}
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

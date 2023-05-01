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

type PositionPropertyProps = {
  editable: boolean;
  onLayerDataUpdateOnly: (valueMap: PartialAllLayerData) => void;
  onLayerDataUpdate: (valueMap: PartialAllLayerData) => void;
} & FormikProps<BuilderLayerJSONParitalAll>;

export const PositionProperty = React.memo(
  ({
    editable,
    errors,
    handleBlur,
    touched,
    values,
    onLayerDataUpdate,
    onLayerDataUpdateOnly,
  }: PositionPropertyProps) => {
    const layerDataProperties = ["left", "top"];
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
          <Typography variant="subtitle1">Position</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box display="flex" flexDirection="column" width="100%">
            <Grid container spacing={2}>
              <Grid item sm={6}>
                {AllowedLayerTypes.includes("layer_data.left") ? (
                  <FormTextField
                    name="layer_data.left"
                    fieldKey="left"
                    label="X"
                    variant="outlined"
                    type="number"
                    value={mathRound2(values.layer_data.left ?? 0)}
                    disabled={!editable}
                    error={Boolean(
                      touched.layer_data?.left && errors.layer_data?.left
                    )}
                    helperText={
                      touched.layer_data?.left && errors.layer_data?.left
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
                {AllowedLayerTypes.includes("layer_data.top") ? (
                  <FormTextField
                    name="layer_data.top"
                    fieldKey="top"
                    label="Y"
                    variant="outlined"
                    type="number"
                    value={mathRound2(values.layer_data.top ?? 0)}
                    disabled={!editable}
                    error={Boolean(
                      touched.layer_data?.top && errors.layer_data?.top
                    )}
                    helperText={
                      touched.layer_data?.top && errors.layer_data?.top
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

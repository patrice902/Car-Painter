import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  FormControl as MuiFormControl,
  Grid,
  InputLabel,
  Typography,
} from "@material-ui/core";
import { ExpandMore as ExpandMoreIcon } from "@material-ui/icons";
import { spacing } from "@material-ui/system";
import { FormikProps } from "formik";
import React, { useMemo, useState } from "react";
import { focusBoardQuickly, getAllowedLayerTypes } from "src/helper";
import {
  BuilderLayerJSONParitalAll,
  PartialAllLayerData,
} from "src/types/common";
import { BuilderFont } from "src/types/model";
import styled from "styled-components/macro";

import {
  FormColorPickerInput,
  FormFontSelect,
  FormSliderInput,
} from "../../../components";
import { LabelTypography } from "../../../PropertyBar.style";

const FormControl = styled(MuiFormControl)(spacing);

type FontPropertyProps = {
  editable: boolean;
  fontList: BuilderFont[];
  onLayerDataUpdateOnly: (valueMap: PartialAllLayerData) => void;
  onLayerDataUpdate: (valueMap: PartialAllLayerData) => void;
} & FormikProps<BuilderLayerJSONParitalAll>;

export const FontProperty = React.memo(
  ({
    editable,
    errors,
    values,
    fontList,
    onLayerDataUpdate,
    onLayerDataUpdateOnly,
  }: FontPropertyProps) => {
    const layerDataProperties = ["font", "size"];
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
          <Typography variant="subtitle1">Font</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box display="flex" flexDirection="column" width="100%">
            {AllowedLayerTypes.includes("layer_data.font") ? (
              <FormControl variant="outlined" style={{ marginTop: "8px" }}>
                <InputLabel id="font-select-label">Font</InputLabel>
                <FormFontSelect
                  value={values.layer_data.font}
                  fieldKey="font"
                  disabled={!editable}
                  fontList={fontList}
                  onUpdateField={onLayerDataUpdateOnly}
                  onUpdateDB={onLayerDataUpdate}
                />
              </FormControl>
            ) : (
              <></>
            )}
            {AllowedLayerTypes.includes("layer_data.color") ? (
              <Box display="flex" alignItems="center" height="40px">
                <Grid container alignItems="center" spacing={2}>
                  <Grid item xs={6}>
                    <LabelTypography
                      variant="body1"
                      color="textSecondary"
                      style={{ marginRight: "8px" }}
                    >
                      Font Color
                    </LabelTypography>
                  </Grid>
                  <Grid item xs={6}>
                    <FormColorPickerInput
                      value={values.layer_data.color}
                      fieldKey="color"
                      disabled={!editable}
                      error={Boolean(errors.layer_data?.color)}
                      helperText={errors.layer_data?.color}
                      onUpdateDB={onLayerDataUpdate}
                    />
                  </Grid>
                </Grid>
              </Box>
            ) : (
              <></>
            )}
            {AllowedLayerTypes.includes("layer_data.size") ? (
              <Box display="flex" alignItems="center" height="40px">
                <FormSliderInput
                  label="Font Size"
                  fieldKey="size"
                  disabled={!editable}
                  min={6}
                  max={512}
                  value={values.layer_data.size}
                  onUpdateField={onLayerDataUpdateOnly}
                  onUpdateDB={onLayerDataUpdate}
                />
              </Box>
            ) : (
              <></>
            )}
          </Box>
        </AccordionDetails>
      </Accordion>
    );
  }
);

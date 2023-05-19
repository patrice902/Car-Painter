import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Grid,
  MenuItem,
  Typography,
} from "@material-ui/core";
import { ExpandMore as ExpandMoreIcon } from "@material-ui/icons";
import { FormikProps } from "formik";
import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { FinishOptions } from "src/constant";
import { focusBoardQuickly, getAllowedLayerTypes } from "src/helper";
import { RootState } from "src/redux";
import {
  BuilderLayerJSONParitalAll,
  PartialAllLayerData,
} from "src/types/common";
import { LayerTypes } from "src/types/enum";

import { FormColorPickerInput, FormSelect } from "../../../components";
import { LabelTypography } from "../../../PropertyBar.style";

type ColorPropertyProps = {
  editable: boolean;
  onLayerDataUpdateOnly: (valueMap: PartialAllLayerData) => void;
  onLayerDataUpdate: (valueMap: PartialAllLayerData) => void;
} & FormikProps<BuilderLayerJSONParitalAll>;

export const ColorProperty = React.memo(
  ({
    editable,
    errors,
    values,
    onLayerDataUpdate,
    onLayerDataUpdateOnly,
  }: ColorPropertyProps) => {
    const [expanded, setExpanded] = useState(true);
    const currentScheme = useSelector(
      (state: RootState) => state.schemeReducer.current
    );
    const currentCarMake = useSelector(
      (state: RootState) => state.carMakeReducer.current
    );
    const logoList = useSelector((state: RootState) => state.logoReducer.list);
    const AllowedLayerTypes = useMemo(() => getAllowedLayerTypes(values), [
      values,
    ]);

    const foundLogo = useMemo(
      () =>
        values.layer_type === LayerTypes.LOGO
          ? logoList.find(
              (item) => item.source_file === values.layer_data.source_file
            )
          : null,
      [logoList, values.layer_data.source_file, values.layer_type]
    );
    const showColor = useMemo(
      () =>
        !AllowedLayerTypes ||
        (AllowedLayerTypes.includes("layer_data.color") &&
          values.layer_type !== LayerTypes.TEXT &&
          (values.layer_type !== LayerTypes.LOGO ||
            (foundLogo && foundLogo.enable_color))),
      [AllowedLayerTypes, foundLogo, values.layer_type]
    );
    const showBlendType = useMemo(
      () =>
        !AllowedLayerTypes ||
        AllowedLayerTypes.includes("layer_data.blendType"),
      [AllowedLayerTypes]
    );
    const showFinish = useMemo(
      () =>
        !AllowedLayerTypes ||
        (!currentScheme?.hide_spec &&
          AllowedLayerTypes.includes("layer_data.finish") &&
          currentCarMake?.car_type !== "Misc"),
      [AllowedLayerTypes, currentScheme?.hide_spec, currentCarMake?.car_type]
    );

    if (!showColor && !showBlendType && !showFinish) return <></>;

    return (
      <Accordion
        expanded={expanded}
        onChange={() => {
          setExpanded(!expanded);
          focusBoardQuickly();
        }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">Colors</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box display="flex" flexDirection="column" width="100%">
            {showColor ? (
              <Box display="flex" alignItems="center" height="40px">
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box height="100%" display="flex" alignItems="center">
                      <LabelTypography
                        color="textSecondary"
                        style={{ marginRight: "8px" }}
                      >
                        Color
                      </LabelTypography>
                    </Box>
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
            {showBlendType ? (
              <Box display="flex" alignItems="center" height="40px">
                <Grid container spacing={2} component={Box}>
                  <Grid item xs={6}>
                    <Box height="100%" display="flex" alignItems="center">
                      <LabelTypography
                        variant="body1"
                        color="textSecondary"
                        style={{ marginRight: "8px" }}
                      >
                        Blend Type
                      </LabelTypography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <FormSelect
                      name="layer_data.blendType"
                      fieldKey="blendType"
                      value={values.layer_data.blendType}
                      disabled={!editable}
                      onUpdateField={onLayerDataUpdateOnly}
                      onUpdateDB={onLayerDataUpdate}
                    >
                      <MenuItem value="normal">Normal</MenuItem>

                      <MenuItem value="multiply">Multiply</MenuItem>
                      <MenuItem value="darken">Darken</MenuItem>
                      <MenuItem value="lighten">Lighten</MenuItem>
                      <MenuItem value="color-burn">Color Burn</MenuItem>
                      <MenuItem value="color">Color</MenuItem>
                      <MenuItem value="screen">Screen</MenuItem>
                      <MenuItem value="overlay">Overlay</MenuItem>
                      <MenuItem value="hue">Hue</MenuItem>
                      <MenuItem value="saturation">Saturation</MenuItem>
                      <MenuItem value="luminosity">Luminosity</MenuItem>
                      <MenuItem value="xor">Xor</MenuItem>
                    </FormSelect>
                  </Grid>
                </Grid>
              </Box>
            ) : (
              <></>
            )}
            {showFinish ? (
              <Box display="flex" alignItems="center" height="40px">
                <Grid container spacing={2} component={Box}>
                  <Grid item xs={6}>
                    <Box height="100%" display="flex" alignItems="center">
                      <LabelTypography
                        variant="body1"
                        color="textSecondary"
                        style={{ marginRight: "8px" }}
                      >
                        Finish
                      </LabelTypography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <FormSelect
                      name="layer_data.finish"
                      fieldKey="finish"
                      value={values.layer_data.finish}
                      disabled={!editable}
                      onUpdateField={onLayerDataUpdateOnly}
                      onUpdateDB={onLayerDataUpdate}
                    >
                      {FinishOptions.map((finishItem, index) => (
                        <MenuItem value={finishItem.value} key={index}>
                          {finishItem.label}
                        </MenuItem>
                      ))}
                    </FormSelect>
                  </Grid>
                </Grid>
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

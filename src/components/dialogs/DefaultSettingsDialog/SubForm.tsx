import { Box, Grid, Typography } from "@material-ui/core";
import { FormikProps } from "formik";
import { useCallback } from "react";
import { ColorPickerInput, SliderInput } from "src/components/common";

import { DefaultSettingsFormValues } from "./DefaultSettingsDialog.model";

type SubFormProps = {
  extraChildren: React.ReactElement;
} & FormikProps<DefaultSettingsFormValues>;

export const SubForm = (props: SubFormProps) => {
  const { errors, setFieldValue, values, extraChildren } = props;

  const handleColorChange = useCallback(
    (color) => setFieldValue("default_shape_color", color),
    [setFieldValue]
  );

  const handleOpacityChange = useCallback(
    (value) => setFieldValue("default_shape_opacity", value),
    [setFieldValue]
  );

  const handleDefaultShapeSColorChange = useCallback(
    (color) => {
      setFieldValue("default_shape_scolor", color);
    },
    [setFieldValue]
  );

  const handleDefaultShapeStrokeChange = useCallback(
    (value) => {
      setFieldValue("default_shape_stroke", value);
    },
    [setFieldValue]
  );

  return (
    <Box display="flex" flexDirection="column" width="100%" mb={1}>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={6}>
              <Typography
                variant="body1"
                color="textSecondary"
                style={{ marginRight: "8px" }}
              >
                Color
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <ColorPickerInput
                value={values.default_shape_color}
                onChange={handleColorChange}
                onInputChange={handleColorChange}
                error={Boolean(errors.default_shape_color)}
                helperText={errors.default_shape_color}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={6}>
          <SliderInput
            label="Opacity"
            min={0}
            max={1}
            step={0.01}
            value={values.default_shape_opacity}
            setValue={handleOpacityChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={6}>
              <Typography
                variant="body1"
                color="textSecondary"
                style={{ marginRight: "8px" }}
              >
                Stroke Color
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <ColorPickerInput
                value={values["default_shape_scolor"]}
                onChange={handleDefaultShapeSColorChange}
                onInputChange={handleDefaultShapeSColorChange}
                error={Boolean(errors["default_shape_scolor"])}
                helperText={errors["default_shape_scolor"]}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={6}>
          <SliderInput
            label="Stroke Width"
            min={0}
            max={10}
            step={1}
            value={values["default_shape_stroke"]}
            setValue={handleDefaultShapeStrokeChange}
          />
        </Grid>
      </Grid>
      {extraChildren}
    </Box>
  );
};

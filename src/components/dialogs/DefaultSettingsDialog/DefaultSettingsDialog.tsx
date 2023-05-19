import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
} from "@material-ui/core";
import { Form, Formik, FormikProps } from "formik";
import React, { useCallback } from "react";
import { useSelector } from "react-redux";
import { ColorPickerInput, SliderInput } from "src/components/common";
import { colorValidator } from "src/helper";
import { RootState } from "src/redux";
import { MovableObjLayerData, RectObjLayerData } from "src/types/common";
import * as Yup from "yup";

import {
  DefaultSettingsDialogProps,
  DefaultSettingsFormValues,
} from "./DefaultSettingsDialog.model";
import { SubForm } from "./SubForm";

const validationSchema = Yup.object().shape({
  default_shape_color: Yup.string()
    .nullable()
    .test("color-validation", "Incorrect Color Format", colorValidator),
  default_shape_opacity: Yup.number().min(0).max(1),
  default_shape_scolor: Yup.string()
    .nullable()
    .test("color-validation", "Incorrect Color Format", colorValidator),
  default_shape_stroke: Yup.number(),
});

export const DefaultSettingsDialog = React.memo(
  ({ onCancel, open, onApply }: DefaultSettingsDialogProps) => {
    const guide_data = useSelector(
      (state: RootState) => state.schemeReducer.current?.guide_data
    );
    const currentLayer = useSelector(
      (state: RootState) => state.layerReducer.current
    );

    const initialValues: DefaultSettingsFormValues = {
      default_shape_color:
        (currentLayer?.layer_data as RectObjLayerData)?.color ??
        guide_data?.default_shape_color ??
        "#000000",
      default_shape_opacity:
        (currentLayer?.layer_data as MovableObjLayerData)?.opacity ??
        guide_data?.default_shape_opacity ??
        1,
      default_shape_scolor:
        (currentLayer?.layer_data as MovableObjLayerData)?.scolor ??
        guide_data?.default_shape_scolor ??
        "#000000",
      default_shape_stroke:
        (currentLayer?.layer_data as MovableObjLayerData)?.stroke ??
        guide_data?.default_shape_stroke ??
        1,
    };

    return (
      <Dialog
        aria-labelledby="insert-text-title"
        open={open}
        onClose={onCancel}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle id="insert-text-title">
          {!currentLayer ? "Default " : ""}Shape Settings
        </DialogTitle>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          enableReinitialize
          validate={() => ({})}
          onSubmit={onApply}
        >
          {(formProps) => (
            <DefaultSettingsForm onCancel={onCancel} {...formProps} />
          )}
        </Formik>
      </Dialog>
    );
  }
);

type DefaultSettingsFormProps = {
  onCancel: () => void;
} & FormikProps<DefaultSettingsFormValues>;

const DefaultSettingsForm = React.memo(
  ({ onCancel, ...formProps }: DefaultSettingsFormProps) => {
    const handleDefaultShapeSColorChange = useCallback(
      (color) => {
        formProps.setFieldValue("default_shape_scolor", color);
      },
      [formProps]
    );

    const handleDefaultShapeStrokeChange = useCallback(
      (value) => {
        formProps.setFieldValue("default_shape_stroke", value);
      },
      [formProps]
    );

    return (
      <Form onSubmit={formProps.handleSubmit} noValidate>
        <DialogContent dividers id="insert-text-dialog-content">
          <SubForm
            {...formProps}
            extraChildren={
              <>
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
                        value={formProps.values["default_shape_scolor"]}
                        onChange={handleDefaultShapeSColorChange}
                        onInputChange={handleDefaultShapeSColorChange}
                        error={Boolean(
                          formProps.errors["default_shape_scolor"]
                        )}
                        helperText={formProps.errors["default_shape_scolor"]}
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
                    value={formProps.values["default_shape_stroke"]}
                    setValue={handleDefaultShapeStrokeChange}
                  />
                </Grid>
              </>
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancel} color="secondary">
            Cancel
          </Button>
          <Button
            type="submit"
            color="primary"
            variant="outlined"
            disabled={formProps.isSubmitting || !formProps.isValid}
          >
            Apply
          </Button>
        </DialogActions>
      </Form>
    );
  }
);

export default DefaultSettingsDialog;

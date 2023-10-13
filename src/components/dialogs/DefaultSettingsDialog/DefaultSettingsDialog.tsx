import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Typography,
} from "@material-ui/core";
import {
  Add as AddIcon,
  DeleteOutline as DeleteIcon,
} from "@material-ui/icons";
import { FieldArray, Form, Formik, FormikProps, getIn } from "formik";
import { ColorPicker } from "material-ui-color";
import React from "react";
import { useSelector } from "react-redux";
import { ColorPickerInput } from "src/components/common";
import { colorValidator } from "src/helper";
import { RootState } from "src/redux";
import { MovableObjLayerData, RectObjLayerData } from "src/types/common";
import { Palette } from "src/types/enum";
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
  saved_colors: Yup.array().of(
    Yup.string()
      .required("Required")
      .test("color-validation", "Incorrect Color Format", colorValidator)
  ),
});

export const DefaultSettingsDialog = React.memo(
  ({ onCancel, open, onApply }: DefaultSettingsDialogProps) => {
    const guide_data = useSelector(
      (state: RootState) => state.schemeReducer.current?.guide_data
    );
    const currentLayer = useSelector(
      (state: RootState) => state.layerReducer.current
    );
    const currentUser = useSelector(
      (state: RootState) => state.authReducer.user
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
      saved_colors: JSON.parse(currentUser?.saved_colors ?? "[]") as string[],
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
  ({ onCancel, ...formProps }: DefaultSettingsFormProps) => (
    <Form onSubmit={formProps.handleSubmit} noValidate>
      <DialogContent dividers id="insert-text-dialog-content">
        <SubForm
          {...formProps}
          extraChildren={
            <Box pt={4}>
              <Typography variant="subtitle1">Saved Colors</Typography>
              <FieldArray name="saved_colors">
                {({ push, remove }) => (
                  <Grid container spacing={4}>
                    {formProps.values.saved_colors.map((colorItem, index) => (
                      <Grid key={index} item xs={6} sm={4}>
                        <Grid container spacing={2} alignItems="center">
                          <Grid item xs={10}>
                            <ColorPickerInput
                              value={colorItem}
                              onChange={(color) =>
                                formProps.setFieldValue(
                                  `saved_colors[${index}]`,
                                  color
                                )
                              }
                              onInputChange={(color) =>
                                formProps.setFieldValue(
                                  `saved_colors[${index}]`,
                                  color
                                )
                              }
                              error={Boolean(
                                getIn(
                                  formProps.errors,
                                  `saved_colors[${index}]`
                                )
                              )}
                              helperText={getIn(
                                formProps.errors,
                                `saved_colors[${index}]`
                              )}
                            />
                          </Grid>
                          <Grid item xs={2}>
                            <IconButton
                              size="small"
                              onClick={() => remove(index)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Grid>
                        </Grid>
                      </Grid>
                    ))}
                    <Grid item xs={6} sm={4}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={4}>
                          <ColorPicker
                            value="#"
                            onChange={(color) => {
                              if (color.css.backgroundColor) {
                                push(color.css.backgroundColor);
                              }
                            }}
                            palette={Palette}
                            deferred
                            hideTextfield
                          />
                        </Grid>
                        <Grid item xs={8}>
                          <Button
                            startIcon={<AddIcon />}
                            size="small"
                            onClick={() => push("#000000")}
                          >
                            Add New
                          </Button>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                )}
              </FieldArray>
            </Box>
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
  )
);

export default DefaultSettingsDialog;

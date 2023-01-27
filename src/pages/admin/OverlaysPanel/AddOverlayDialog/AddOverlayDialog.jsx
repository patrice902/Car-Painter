import React, { useCallback, useMemo } from "react";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
} from "components/MaterialUI";

import { DropzoneArea } from "material-ui-dropzone";

import { CustomDialogContent } from "./AddOverlayDialog.style";
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  Grid,
  TextField,
  Typography,
} from "@material-ui/core";
import { useDispatch } from "react-redux";
import { ColorPickerInput, SliderInput } from "components/common";
import { uploadAndCreateOverlay } from "redux/reducers/overlayReducer";

export const AddOverlayDialog = React.memo((props) => {
  const { onClose, open } = props;
  const dispatch = useDispatch();

  const initialValues = useMemo(
    () => ({
      name: "",
      overlay_file: undefined,
      overlay_thumb: undefined,
      color: "000000",
      stroke_scale: 1,
      legacy_mode: 0,
    }),
    []
  );

  const validationSchema = useMemo(
    () =>
      Yup.object().shape({
        name: Yup.string().required(),
        overlay_file: Yup.string().required(),
        overlay_thumb: Yup.string().required(),
        color: Yup.string().required(),
        stroke_scale: Yup.number().required().min(1),
      }),
    []
  );

  const onApply = useCallback((data) => {
    dispatch(uploadAndCreateOverlay(data));
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Dialog aria-labelledby="upload-title" open={open} onClose={onClose}>
        <DialogTitle id="upload-title">Add a Graphic</DialogTitle>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          enableReinitialize
          validate={(values) => {
            return {};
          }}
          onSubmit={onApply}
        >
          {(formProps) => <AddOverlayForm onClose={onClose} {...formProps} />}
        </Formik>
      </Dialog>
    </>
  );
});

const AddOverlayForm = React.memo(({ onClose, ...formProps }) => {
  return (
    <Form onSubmit={formProps.handleSubmit} noValidate>
      <CustomDialogContent dividers>
        <Grid
          container
          spacing={4}
          component={Box}
          display="flex"
          alignItems="center"
        >
          <Grid item xs={12} sm={6}>
            <DropzoneArea
              onChange={(file) =>
                formProps.setFieldValue(
                  "overlay_file",
                  file.length ? file[0] : undefined
                )
              }
              value={
                formProps.values["overlay_file"]
                  ? [formProps.values["overlay_file"]]
                  : []
              }
              showPreviewsInDropzone
              showFileNamesInPreview
              showFileNames
              acceptedFiles={["image/*"]}
              dropzoneText="Origin File"
              filesLimit={1}
            />
            <FormHelperText error>
              {formProps.touched.overlay_file && formProps.errors.overlay_file}
            </FormHelperText>
          </Grid>
          <Grid item xs={12} sm={6}>
            <DropzoneArea
              onChange={(file) =>
                formProps.setFieldValue(
                  "overlay_thumb",
                  file.length ? file[0] : undefined
                )
              }
              value={
                formProps.values["overlay_thumb"]
                  ? [formProps.values["overlay_thumb"]]
                  : []
              }
              showPreviewsInDropzone
              showFileNamesInPreview
              showFileNames
              acceptedFiles={["image/*"]}
              dropzoneText="Thumbnail File"
              filesLimit={1}
            />
            <FormHelperText error>
              {formProps.touched.overlay_thumb &&
                formProps.errors.overlay_thumb}
            </FormHelperText>
          </Grid>
          <Grid item xs={12} sm={8}>
            <TextField
              type="text"
              name="name"
              label="Name"
              variant="outlined"
              color="primary"
              value={formProps.values.name}
              error={Boolean(formProps.touched.name && formProps.errors.name)}
              fullWidth
              helperText={formProps.touched.name && formProps.errors.name}
              onBlur={formProps.handleBlur}
              onChange={formProps.handleChange}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControlLabel
              control={
                <Box mt={1}>
                  <Checkbox
                    checked={formProps.values.legacy_mode === 1}
                    onChange={(event) =>
                      formProps.setFieldValue(
                        "legacy_mode",
                        event.target.checked ? 1 : 0
                      )
                    }
                    color="primary"
                  />
                </Box>
              }
              label="Legacy Mode"
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Typography variant="body1" color="textSecondary">
              Color
            </Typography>
          </Grid>
          <Grid item xs={12} sm={3}>
            <ColorPickerInput
              value={"#" + (formProps.values.color || "")}
              onChange={(value) =>
                formProps.setFieldValue("color", value.replace("#", ""))
              }
              onInputChange={(value) =>
                formProps.setFieldValue("color", value.replace("#", ""))
              }
              error={Boolean(formProps.errors.color)}
              helperText={formProps.errors.color}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <SliderInput
              label="Stroke Scale"
              min={0}
              max={10}
              value={formProps.values.stroke_scale}
              setValue={(value) =>
                formProps.setFieldValue("stroke_scale", value)
              }
            />
          </Grid>
        </Grid>
      </CustomDialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button
          type="submit"
          color="primary"
          variant="outlined"
          // disabled={formProps.isSubmitting || !formProps.isValid}
        >
          Add
        </Button>
      </DialogActions>
    </Form>
  );
});

export default AddOverlayDialog;

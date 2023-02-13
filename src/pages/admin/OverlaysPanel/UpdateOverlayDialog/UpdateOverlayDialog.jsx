import {
  Box,
  Checkbox,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
} from "@material-ui/core";
import {
  ColorPickerInput,
  ImageWithLoad,
  SliderInput,
} from "components/common";
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
} from "components/MaterialUI";
import config from "config";
import { Form, Formik } from "formik";
import { DropzoneArea } from "material-ui-dropzone";
import React, { useCallback, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { uploadAndUpdateOverlay } from "redux/reducers/overlayReducer";
import * as Yup from "yup";

import { CustomDialogContent } from "./UpdateOverlayDialog.style";

export const UpdateOverlayDialog = React.memo((props) => {
  const { onClose, open, data } = props;
  const dispatch = useDispatch();

  const initialValues = useMemo(
    () => ({
      name: data ? data.name : "",
      overlay_file: undefined,
      overlay_thumb: undefined,
      color: data ? data.color : "000000",
      stroke_scale: data ? data.stroke_scale : 1,
      legacy_mode: data ? data.legacy_mode : 0,
    }),
    [data]
  );

  const validationSchema = useMemo(
    () =>
      Yup.object().shape({
        name: Yup.string().required(),
        color: Yup.string().required(),
        stroke_scale: Yup.number().required().min(1),
      }),
    []
  );

  const onApply = useCallback(
    (payload) => {
      dispatch(uploadAndUpdateOverlay(data.id, payload));
      onClose();
    },
    [data.id, dispatch, onClose]
  );

  return (
    <>
      <Dialog aria-labelledby="upload-title" open={open} onClose={onClose}>
        <DialogTitle id="upload-title">Update a Graphic</DialogTitle>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          enableReinitialize
          validate={() => {
            return {};
          }}
          onSubmit={onApply}
        >
          {(formProps) => (
            <UpdateOverlayForm onClose={onClose} data={data} {...formProps} />
          )}
        </Formik>
      </Dialog>
    </>
  );
});

const UpdateOverlayForm = React.memo(({ onClose, data, ...formProps }) => {
  const [replaceOrigin, setReplaceOrigin] = useState(false);
  const [replaceThumbnail, setReplaceThumbnail] = useState(false);

  const handleUseOriginalSource = useCallback(() => {
    formProps.setFieldValue("overlay_file", undefined);
    setReplaceOrigin(false);
  }, [formProps]);

  const handleUseOriginalThumbnail = useCallback(() => {
    formProps.setFieldValue("overlay_thumb", undefined);
    setReplaceThumbnail(false);
  }, [formProps]);

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
            {replaceOrigin ? (
              <Box display="flex" flexDirection="column" alignItems="center">
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
                <Button
                  color="secondary"
                  variant="contained"
                  my={2}
                  onClick={handleUseOriginalSource}
                >
                  Use Original Image
                </Button>
              </Box>
            ) : (
              <Box display="flex" flexDirection="column" alignItems="center">
                <ImageWithLoad
                  src={`${config.assetsURL}/${data.overlay_file}`}
                  alt={data.name}
                  alignItems="center"
                  height={100}
                />
                <Button
                  color="secondary"
                  variant="contained"
                  my={2}
                  onClick={() => setReplaceOrigin(true)}
                >
                  Replace Origin Image
                </Button>
              </Box>
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            {replaceThumbnail ? (
              <Box display="flex" flexDirection="column" alignItems="center">
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
                <Button
                  color="secondary"
                  variant="contained"
                  my={2}
                  onClick={handleUseOriginalThumbnail}
                >
                  Use Original Thumbnail
                </Button>
              </Box>
            ) : (
              <Box display="flex" flexDirection="column" alignItems="center">
                <ImageWithLoad
                  src={`${config.assetsURL}/${data.overlay_thumb}`}
                  alt={data.name}
                  alignItems="center"
                  height={100}
                />
                <Button
                  color="secondary"
                  variant="contained"
                  my={2}
                  onClick={() => setReplaceThumbnail(true)}
                >
                  Replace Thumbnail Image
                </Button>
              </Box>
            )}
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
          Update
        </Button>
      </DialogActions>
    </Form>
  );
});

export default UpdateOverlayDialog;

import {
  Box,
  Checkbox,
  FormControlLabel,
  Grid,
  TextField,
} from "@material-ui/core";
import { ImageWithLoad } from "components/common";
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
import { uploadAndUpdateLogo } from "redux/reducers/logoReducer";
import * as Yup from "yup";

import { CustomDialogContent } from "./UpdateLogoDialog.style";

export const UpdateLogoDialog = React.memo((props) => {
  const { onClose, open, data } = props;
  const dispatch = useDispatch();

  const initialValues = useMemo(
    () => ({
      name: data ? data.name : "",
      source_file: undefined,
      preview_file: undefined,
      type: data ? data.type : "0",
      active: data ? data.active : 1,
      enable_color: data ? data.enable_color : 0,
    }),
    [data]
  );

  const validationSchema = useMemo(
    () =>
      Yup.object().shape({
        name: Yup.string().required(),
      }),
    []
  );

  const onApply = useCallback(
    (payload) => {
      dispatch(uploadAndUpdateLogo(data.id, payload));
      onClose();
    },
    [data, onClose, dispatch]
  );

  return (
    <>
      <Dialog aria-labelledby="upload-title" open={open} onClose={onClose}>
        <DialogTitle id="upload-title">Update a Logo</DialogTitle>
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
            <UpdateLogoForm onClose={onClose} data={data} {...formProps} />
          )}
        </Formik>
      </Dialog>
    </>
  );
});

const UpdateLogoForm = React.memo(({ onClose, data, ...formProps }) => {
  const [replaceSource, setReplaceSource] = useState(false);
  const [replacePreview, setReplacePreview] = useState(false);

  const handleUseOriginalSource = useCallback(() => {
    formProps.setFieldValue("source_file", undefined);
    setReplaceSource(false);
  }, [formProps]);

  const handleUseOriginalPreview = useCallback(() => {
    formProps.setFieldValue("preview_file", undefined);
    setReplacePreview(false);
  }, [formProps]);

  return (
    <Form onSubmit={formProps.handleSubmit} noValidate>
      <CustomDialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            {replaceSource ? (
              <Box display="flex" flexDirection="column" alignItems="center">
                <DropzoneArea
                  onChange={(file) =>
                    formProps.setFieldValue(
                      "source_file",
                      file.length ? file[0] : undefined
                    )
                  }
                  value={
                    formProps.values["source_file"]
                      ? [formProps.values["source_file"]]
                      : []
                  }
                  showPreviewsInDropzone
                  showFileNamesInPreview
                  showFileNames
                  acceptedFiles={["image/*"]}
                  dropzoneText="Source File"
                  filesLimit={1}
                />
                <Button
                  color="secondary"
                  variant="contained"
                  my={2}
                  onClick={handleUseOriginalSource}
                >
                  Use Original Source Image
                </Button>
              </Box>
            ) : (
              <Box display="flex" flexDirection="column" alignItems="center">
                <ImageWithLoad
                  src={`${config.assetsURL}/${data.source_file}`}
                  alt={data.name}
                  alignItems="center"
                  height={100}
                />
                <Button
                  color="secondary"
                  variant="contained"
                  my={2}
                  onClick={() => setReplaceSource(true)}
                >
                  Replace Source Image
                </Button>
              </Box>
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            {replacePreview ? (
              <Box display="flex" flexDirection="column" alignItems="center">
                <DropzoneArea
                  onChange={(file) =>
                    formProps.setFieldValue(
                      "preview_file",
                      file.length ? file[0] : undefined
                    )
                  }
                  value={
                    formProps.values["preview_file"]
                      ? [formProps.values["preview_file"]]
                      : []
                  }
                  showPreviewsInDropzone
                  showFileNamesInPreview
                  showFileNames
                  acceptedFiles={["image/*"]}
                  dropzoneText="Preview File"
                  filesLimit={1}
                />
                <Button
                  color="secondary"
                  variant="contained"
                  my={2}
                  onClick={handleUseOriginalPreview}
                >
                  Use Original Preview Image
                </Button>
              </Box>
            ) : (
              <Box display="flex" flexDirection="column" alignItems="center">
                <ImageWithLoad
                  src={`${config.assetsURL}/${data.preview_file}`}
                  alt={data.name}
                  alignItems="center"
                  height={100}
                />
                <Button
                  color="secondary"
                  variant="contained"
                  my={2}
                  onClick={() => setReplacePreview(true)}
                >
                  Replace Preview Image
                </Button>
              </Box>
            )}
          </Grid>
          <Grid item xs={12} sm={12}>
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
                <Checkbox
                  checked={formProps.values.type === "flag"}
                  onChange={(event) =>
                    formProps.setFieldValue(
                      "type",
                      event.target.checked ? "flag" : "0"
                    )
                  }
                  color="primary"
                />
              }
              label="Flag"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formProps.values.active === 1}
                  onChange={(event) =>
                    formProps.setFieldValue(
                      "active",
                      event.target.checked ? 1 : 0
                    )
                  }
                  color="primary"
                />
              }
              label="Active"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formProps.values.enable_color === 1}
                  onChange={(event) =>
                    formProps.setFieldValue(
                      "enable_color",
                      event.target.checked ? 1 : 0
                    )
                  }
                  color="primary"
                />
              }
              label="Enable Color"
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

export default UpdateLogoDialog;

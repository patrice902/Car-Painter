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

import { CustomDialogContent } from "./AddLogoDialog.style";
import {
  Checkbox,
  FormControlLabel,
  FormHelperText,
  Grid,
  TextField,
} from "@material-ui/core";
import { uploadAndCreateLogo } from "redux/reducers/logoReducer";
import { useDispatch } from "react-redux";

export const AddLogoDialog = React.memo((props) => {
  const { onClose, open } = props;
  const dispatch = useDispatch();

  const initialValues = useMemo(
    () => ({
      name: "",
      source_file: undefined,
      preview_file: undefined,
      type: "0",
      active: 1,
      enable_color: 0,
    }),
    []
  );

  const validationSchema = useMemo(
    () =>
      Yup.object().shape({
        name: Yup.string().required(),
        source_file: Yup.string().required(),
        preview_file: Yup.string().required(),
      }),
    []
  );

  const onApply = useCallback((data) => {
    dispatch(uploadAndCreateLogo(data));
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Dialog aria-labelledby="upload-title" open={open} onClose={onClose}>
        <DialogTitle id="upload-title">Add a Logo</DialogTitle>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          enableReinitialize
          validate={(values) => {
            return {};
          }}
          onSubmit={onApply}
        >
          {(formProps) => <AddLogoForm onClose={onClose} {...formProps} />}
        </Formik>
      </Dialog>
    </>
  );
});

const AddLogoForm = React.memo(({ onClose, ...formProps }) => {
  return (
    <Form onSubmit={formProps.handleSubmit} noValidate>
      <CustomDialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
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
            <FormHelperText error>
              {formProps.touched.source_file && formProps.errors.source_file}
            </FormHelperText>
          </Grid>
          <Grid item xs={12} sm={6}>
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
            <FormHelperText error>
              {formProps.touched.preview_file && formProps.errors.preview_file}
            </FormHelperText>
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
          Add
        </Button>
      </DialogActions>
    </Form>
  );
});

export default AddLogoDialog;

import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogTitle,
  FormControlLabel,
  Grid,
  TextField,
} from "@material-ui/core";
import { Form, Formik, FormikProps } from "formik";
import { DropzoneArea } from "material-ui-dropzone";
import React, { useCallback, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { ImageWithLoad } from "src/components/common";
import config from "src/config";
import { decodeHtml } from "src/helper";
import { uploadAndUpdateLogo } from "src/redux/reducers/logoReducer";
import { BuilderLogo } from "src/types/model";
import * as Yup from "yup";

import { CustomDialogContent } from "./UpdateLogoDialog.style";

type UpdateLogoFormValues = {
  name: string;
  source_file?: File;
  preview_file?: File;
  type: string;
  active: number;
  enable_color: number;
};

type UpdateLogoDialogProps = {
  onClose: () => void;
  open: boolean;
  data: BuilderLogo;
};

export const UpdateLogoDialog = React.memo(
  ({ onClose, open, data }: UpdateLogoDialogProps) => {
    const dispatch = useDispatch();

    const initialValues: UpdateLogoFormValues = useMemo(
      () => ({
        name: decodeHtml(data?.name ?? ""),
        source_file: undefined,
        preview_file: undefined,
        type: data?.type ?? "0",
        active: +data?.active ?? 1,
        enable_color: +data?.enable_color ?? 0,
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
            validate={() => ({})}
            onSubmit={onApply}
          >
            {(formProps) => (
              <UpdateLogoForm onClose={onClose} data={data} {...formProps} />
            )}
          </Formik>
        </Dialog>
      </>
    );
  }
);

type UpdateLogoFormProps = {
  onClose: () => void;
  data: BuilderLogo;
} & FormikProps<UpdateLogoFormValues>;

const UpdateLogoForm = React.memo(
  ({ onClose, data, ...formProps }: UpdateLogoFormProps) => {
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
                    style={{
                      marginTop: "8px",
                      marginBottom: "8px",
                    }}
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
                    style={{
                      marginTop: "8px",
                      marginBottom: "8px",
                    }}
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
                    style={{
                      marginTop: "8px",
                      marginBottom: "8px",
                    }}
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
                    style={{
                      marginTop: "8px",
                      marginBottom: "8px",
                    }}
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
                value={decodeHtml(formProps.values.name)}
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
  }
);

export default UpdateLogoDialog;

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import { Form, Formik } from "formik";
import React from "react";
import { useSelector } from "react-redux";
import { colorValidator } from "src/helper";
import { RootState } from "src/redux";
import { BuilderFont } from "src/types/model";
import * as Yup from "yup";

import { InnerForm } from "./InnerForm";
import { TextDialogFormValues } from "./InnerForm/model";

const validationSchema = Yup.object().shape({
  text: Yup.string().required("Required"),
  color: Yup.string()
    .nullable()
    .test("color-validation", "Incorrect Color Format", colorValidator),
  scolor: Yup.string()
    .nullable()
    .test("color-validation", "Incorrect Color Format", colorValidator),
});

type TextDialogProps = {
  fontList: BuilderFont[];
  onCancel: () => void;
  open: boolean;
  baseColor: string;
  defaultColor?: string;
  defaultStrokeColor?: string;
  onCreate: (values: TextDialogFormValues) => void;
};

export const TextDialog = React.memo(
  ({
    fontList,
    onCancel,
    open,
    baseColor,
    defaultColor,
    defaultStrokeColor,
    onCreate,
  }: TextDialogProps) => {
    const currentScheme = useSelector(
      (state: RootState) => state.schemeReducer.current
    );
    const initialValues: TextDialogFormValues = {
      text: "",
      font: currentScheme?.last_font ?? fontList?.[0]?.id ?? 1,
      size: 36,
      color: defaultColor || "#000000",
      stroke: 0,
      scolor: defaultStrokeColor || "#000000",
      rotation: 0,
    };

    return (
      <Dialog
        aria-labelledby="insert-text-title"
        open={open}
        onClose={onCancel}
      >
        <DialogTitle id="insert-text-title">Insert Text</DialogTitle>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onCreate}
        >
          {(formProps) => (
            <Form onSubmit={formProps.handleSubmit}>
              <DialogContent dividers id="insert-text-dialog-content">
                <InnerForm
                  {...formProps}
                  fontList={fontList}
                  baseColor={baseColor}
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
                  disabled={formProps.isSubmitting}
                >
                  Create
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    );
  }
);

export default TextDialog;

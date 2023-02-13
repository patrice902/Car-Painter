import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "components/MaterialUI";
import { Form, Formik } from "formik";
import { colorValidator } from "helper";
import React from "react";
import { useSelector } from "react-redux";
import * as Yup from "yup";

import { InnerForm } from "./InnerForm";

export const TextDialog = React.memo((props) => {
  const {
    fontList,
    onCancel,
    open,
    baseColor,
    defaultColor,
    defaultStrokeColor,
    onCreate,
  } = props;
  const currentScheme = useSelector((state) => state.schemeReducer.current);

  return (
    <Dialog aria-labelledby="insert-text-title" open={open} onClose={onCancel}>
      <DialogTitle id="insert-text-title">Insert Text</DialogTitle>
      <Formik
        initialValues={{
          text: "",
          font: currentScheme.last_font || (fontList && fontList[0].id) || 1,
          size: 36,
          color: defaultColor || "#000000",
          stroke: 0,
          scolor: defaultStrokeColor || "#000000",
          rotation: 0,
        }}
        validationSchema={Yup.object().shape({
          text: Yup.string().required("Required"),
          color: Yup.string()
            .nullable()
            .test("color-validation", "Incorrect Color Format", colorValidator),
          scolor: Yup.string()
            .nullable()
            .test("color-validation", "Incorrect Color Format", colorValidator),
        })}
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
});

export default TextDialog;

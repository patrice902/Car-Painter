import { Box, Link, Typography } from "@material-ui/core";
import { Formik, FormikHelpers } from "formik";
import React from "react";
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import config from "src/config";
import { RootState } from "src/redux";
import { signIn } from "src/redux/reducers/authReducer";
import * as Yup from "yup";

import { InnerForm } from "./InnerForm";
import { SignInFormValues } from "./InnerForm/InnerForm";

const validationSchema = Yup.object().shape({
  usr: Yup.string().max(255).required("Email/ID is required"),
  password: Yup.string().max(255).required("Password is required"),
});

export const SignIn = React.memo(() => {
  const dispatch = useDispatch();
  const history = useHistory();
  const previousPath = useSelector(
    (state: RootState) => state.authReducer.previousPath
  );

  const initialValues: SignInFormValues = {
    usr: "",
    password: "",
    submit: false,
  };

  const handleSubmit = async (
    values: SignInFormValues,
    { setErrors, setStatus, setSubmitting }: FormikHelpers<SignInFormValues>
  ) => {
    try {
      dispatch(
        signIn(
          { usr: values.usr, password: values.password },
          (returnedUser) => {
            if (!returnedUser.pro_user) {
              window.location.href =
                "https://www.tradingpaints.com/page/Builder";
            } else if (returnedUser) {
              history.push(
                previousPath && previousPath !== "/auth/sign-in"
                  ? previousPath
                  : "/"
              );
            }
          }
        )
      );
    } catch (error) {
      const message = "Invalid Data";

      setStatus({ success: false });
      setErrors({ submit: message });
      setSubmitting(false);
    }
  };

  return (
    <>
      <Helmet title="Sign In" />
      <Box
        display="flex"
        width="100%"
        height="100%"
        padding={10}
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        bgcolor="#444"
        borderRadius={20}
      >
        <Typography variant="h1" style={{ marginBottom: "20px" }}>
          Sign In
        </Typography>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {(formProps) => <InnerForm {...formProps} />}
        </Formik>

        <Typography variant="h4" align="center" color="textSecondary">
          Not a member yet?
          <Link
            href={`${config.parentAppURL}/register`}
            color="primary"
            style={{ marginLeft: "8px" }}
          >
            Sign up
          </Link>
        </Typography>
      </Box>
    </>
  );
});

export default SignIn;

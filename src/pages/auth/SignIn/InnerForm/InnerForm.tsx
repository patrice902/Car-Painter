import {
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  Link,
  OutlinedInput,
  TextField,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { FormikProps } from "formik";
import React, { useState } from "react";
import config from "src/config";

import { FullForm, VisibilityIcon, VisibilityOffIcon } from "./InnerForm.style";

export type SignInFormValues = {
  usr: string;
  password: string;
  submit: boolean;
};

export const InnerForm = React.memo(
  ({
    errors,
    isSubmitting,
    touched,
    values,
    handleBlur,
    handleChange,
    handleSubmit,
  }: FormikProps<SignInFormValues>) => {
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => {
      setShowPassword(!showPassword);
    };

    return (
      <FullForm noValidate onSubmit={handleSubmit}>
        {errors.submit && (
          <Alert
            style={{ marginTop: "8px", marginBottom: "4px" }}
            severity="warning"
          >
            {errors.submit}
          </Alert>
        )}
        <TextField
          autoComplete="off"
          type="text"
          name="usr"
          label="Email or iRacing Customer ID number"
          variant="outlined"
          color="primary"
          value={values.usr}
          error={Boolean(touched.usr && errors.usr)}
          fullWidth
          helperText={touched.usr && errors.usr}
          onBlur={handleBlur}
          onChange={handleChange}
          margin="normal"
        />
        <FormControl
          fullWidth
          margin="normal"
          variant="outlined"
          color="primary"
          error={Boolean(touched.password && errors.password)}
        >
          <InputLabel htmlFor="password">Password</InputLabel>
          <OutlinedInput
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={values.password}
            onBlur={handleBlur}
            onChange={handleChange}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={(e) => e.preventDefault()}
                  edge="end"
                  color="default"
                >
                  {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                </IconButton>
              </InputAdornment>
            }
            labelWidth={70}
          />
          <FormHelperText id="password-helper-text">
            {errors.password}
          </FormHelperText>
        </FormControl>
        <Link href={`${config.parentAppURL}/lostpasswd`} color="primary">
          Forgot password?
        </Link>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          size="large"
          disabled={isSubmitting}
          style={{
            marginTop: "20px",
            marginBottom: "20px",
          }}
        >
          Log in
        </Button>
      </FullForm>
    );
  }
);

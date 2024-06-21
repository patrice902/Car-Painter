import { Button, Typography } from "@material-ui/core";
import React from "react";
import { FallbackProps } from "react-error-boundary";
import { Link } from "react-router-dom";
import Fallback from "src/layouts/Fallback";

import { Wrapper } from "./ErrorPage.style";

export const ErrorPage = React.memo(
  ({ error, resetErrorBoundary }: FallbackProps) => (
    <Fallback>
      <Wrapper>
        <Typography component="h1" variant="h1" align="center" gutterBottom>
          Oops
        </Typography>
        <Typography component="h2" variant="h5" align="center" gutterBottom>
          {error.message ?? "Something went wrong."}
        </Typography>
        <Typography component="h2" variant="body1" align="center" gutterBottom>
          Please try again and if it persists please report this error.
        </Typography>

        {resetErrorBoundary ? (
          <Button
            onClick={resetErrorBoundary}
            variant="contained"
            color="secondary"
            style={{
              marginTop: "8px",
            }}
          >
            Try again
          </Button>
        ) : (
          <Button
            component={Link}
            to="/"
            variant="contained"
            color="secondary"
            style={{
              marginTop: "8px",
            }}
          >
            Return to homepage
          </Button>
        )}
      </Wrapper>
    </Fallback>
  )
);

export default ErrorPage;

import { Button, Typography } from "@material-ui/core";
import React from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

import { Wrapper } from "./Page500.style";

export const Page500 = React.memo(() => (
  <Wrapper>
    <Helmet title="500 Error" />
    <Typography component="h1" variant="h1" align="center" gutterBottom>
      500
    </Typography>
    <Typography component="h2" variant="h5" align="center" gutterBottom>
      Internal server error.
    </Typography>
    <Typography component="h2" variant="body1" align="center" gutterBottom>
      The server encountered something unexpected that didn&apos;t allow it to
      complete the request.
    </Typography>

    <Button
      component={Link}
      to="/"
      variant="contained"
      color="secondary"
      style={{
        marginTop: "8px",
      }}
    >
      Return to website
    </Button>
  </Wrapper>
));

export default Page500;

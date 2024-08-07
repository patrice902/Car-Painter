import { Button, Typography } from "@material-ui/core";
import React from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

import { Wrapper } from "./Page404.style";

export const Page404 = React.memo(() => (
  <Wrapper>
    <Helmet title="404 Error" />
    <Typography component="h1" variant="h1" align="center" gutterBottom>
      404
    </Typography>
    <Typography component="h2" variant="h5" align="center" gutterBottom>
      Page not found.
    </Typography>
    <Typography component="h2" variant="body1" align="center" gutterBottom>
      The page you are looking for might have been removed.
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
      Return to homepage
    </Button>
  </Wrapper>
));

export default Page404;

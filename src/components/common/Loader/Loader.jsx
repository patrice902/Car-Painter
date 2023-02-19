import { CircularProgress } from "@material-ui/core";
import React from "react";

import { Root } from "./Loader.style";

export const Loader = React.memo(() => (
  <Root>
    <CircularProgress m={2} color="secondary" />
  </Root>
));

export default Loader;

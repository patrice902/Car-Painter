import React from "react";

import { Progress, Root } from "./Loader.style";

export const Loader = React.memo(() => (
  <Root>
    <Progress color="secondary" />
  </Root>
));

export default Loader;

import { CssBaseline } from "@material-ui/core";
import { withMessage } from "hooks/withMessage";
import React from "react";

import { GlobalStyle, Root } from "./Auth.style";

export const Auth = withMessage(({ children }) => {
  return (
    <Root>
      <CssBaseline />
      <GlobalStyle />
      {children}
    </Root>
  );
});

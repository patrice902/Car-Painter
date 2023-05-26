import { CssBaseline } from "@material-ui/core";
import { withMessage } from "src/hooks/withMessage";

import { GlobalStyle, Root } from "./Auth.style";

export const Auth = withMessage(({ children }) => (
  <Root>
    <CssBaseline />
    <GlobalStyle />
    {children}
  </Root>
));
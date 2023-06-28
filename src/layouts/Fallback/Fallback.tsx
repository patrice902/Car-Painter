import { CssBaseline } from "@material-ui/core";
import { withEmergencyShutdown } from "src/hooks";
import { withMessage } from "src/hooks/withMessage";

import { GlobalStyle, Root } from "./Fallback.style";

export const Fallback = withEmergencyShutdown(
  withMessage(({ children }) => (
    <Root>
      <CssBaseline />
      <GlobalStyle />
      {children}
    </Root>
  ))
);

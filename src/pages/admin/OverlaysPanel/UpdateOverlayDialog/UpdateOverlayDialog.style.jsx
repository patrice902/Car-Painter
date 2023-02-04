import styled from "styled-components/macro";

import { DialogContent } from "@material-ui/core";

export const CustomDialogContent = styled(DialogContent)(
  ({ theme }) => `
  width: 300px;
   ${theme.breakpoints.up("sm")} {
    width: 600px;
  }
`
);

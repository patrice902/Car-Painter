import { DialogContent } from "@material-ui/core";
import styled from "styled-components/macro";

export const CustomDialogContent = styled(DialogContent)(
  ({ theme }) => `
  width: 300px;
   ${theme.breakpoints.up("sm")} {
    width: 600px;
  }
`
);

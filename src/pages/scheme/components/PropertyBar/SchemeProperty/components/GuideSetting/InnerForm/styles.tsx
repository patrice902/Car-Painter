import { DialogContent, FormControlLabel } from "@material-ui/core";
import styled from "styled-components/macro";

export const CustomFormControlLabel = styled(FormControlLabel)`
  margin-left: 0;
  color: rgba(255, 255, 255, 0.5);
  width: 100%;
  display: flex;
  justify-content: space-between;
  height: 40px;
  & .MuiFormControlLabel-label {
    font-size: 14px;
  }
`;

export const CustomDialogContent = styled(DialogContent)`
  padding-right: 0;
`;

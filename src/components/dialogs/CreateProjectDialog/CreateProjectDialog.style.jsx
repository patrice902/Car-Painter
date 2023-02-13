import { DialogActions, TextField } from "components/MaterialUI";
import styled from "styled-components/macro";

export const CustomDialogActions = styled(DialogActions)`
  padding-right: 24px;
`;
export const NameField = styled(TextField)`
  .MuiInputBase-root {
    height: 56px;
  }
  .MuiInputBase-input {
    font-family: CircularXXWeb-Regular;
  }
`;

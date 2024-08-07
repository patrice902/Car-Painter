import { TextField, Typography } from "@material-ui/core";
import styled from "styled-components/macro";

export const LabelTypography = styled(Typography)`
  font-size: 14px;
`;

export const SmallTextField = styled(TextField)`
  .MuiInputBase-input {
    height: 1.5rem;
  }
  &.MuiTextField-root {
    margin: 12px 0;
  }
`;

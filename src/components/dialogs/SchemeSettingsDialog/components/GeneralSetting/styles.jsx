import {
  Button,
  DialogContent,
  FormControlLabel,
  TextField,
} from "components/MaterialUI";
import styled from "styled-components/macro";

export const CustomDialogContent = styled(DialogContent)``;

export const CustomButton = styled(Button)`
  font-size: 16px;
  font-weight: 400;
`;

export const NameInput = styled(TextField)`
  width: ${(props) => props.width};
`;

export const CustomFormControlLabel = styled(FormControlLabel)`
  margin-left: 8px;
`;

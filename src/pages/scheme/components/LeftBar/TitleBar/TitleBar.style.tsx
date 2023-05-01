import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TextField } from "@material-ui/core";
import styled from "styled-components/macro";

export const CustomIcon = styled(FontAwesomeIcon)`
  width: 20px !important;
  height: 20px !important;
`;

export const NameInput = styled(TextField)<{
  width?: string | number;
}>`
  ${(props) => (props.width ? `width: ${props.width};` : "")}
  flex-grow: 1;
  .MuiInputBase-input {
    font-family: "CircularXXWeb-Bold";
  }
`;

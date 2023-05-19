import { Box, TextField } from "@material-ui/core";
import styled from "styled-components/macro";

export const CustomeTextField = styled(TextField)`
  margin-bottom: 16px;

  .MuiInputBase-input {
    height: 2rem;
  }
`;
export const TextPreviewWrapper = styled(Box)<{ backcolor: string }>`
  overflow: hidden;
  background: #${(props) => props.backcolor};
`;

export const TextPreview = styled("div")<{
  color: string;
  stroke: string | number;
  scolor: string;
  size?: string | number;
  font?: string | number;
  rotate?: string | number;
}>`
  ${(props) => (props.color ? `color: ${props.color};` : "")}
  ${(props) =>
    props.stroke ? `-webkit-text-stroke-width: ${props.stroke}px;` : ""}
  ${(props) =>
    props.scolor ? ` -webkit-text-stroke-color: ${props.scolor};` : ""}
  ${(props) => (props.size ? `font-size: ${props.size}px;` : "")}
  ${(props) => (props.font ? `font-family: ${props.font};` : "")}
  ${(props) => (props.rotate ? `transform: rotate(${props.rotate}deg);` : "")}
`;

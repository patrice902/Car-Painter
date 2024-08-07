import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button } from "@material-ui/core";
import styled from "styled-components/macro";

export const LayerWrapper = styled(Box)`
  background: #666666;
  overflow: auto;
  transition: 0.25s;
`;

export const ColorApplyButton = styled(Button)`
  padding: 3px 15px 5px;
`;

export const CustomFontAwesomeIcon = styled(FontAwesomeIcon)<{
  isstretch?: string;
}>`
  margin-right: 10px;
  width: 25px !important;
  transform: ${(props) =>
    props.isstretch === "true" ? "scaleX(1.2) scaleY(0.8)" : "none"};
`;

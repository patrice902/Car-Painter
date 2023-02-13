import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, ButtonGroup } from "@material-ui/core";
import {
  ArrowDropDown as DropDownIcon,
  Share as ShareIcon,
} from "@material-ui/icons";
import styled from "styled-components/macro";

export { DropDownIcon, ShareIcon };

export const CustomButtonGroup = styled(ButtonGroup)`
  height: 30px;
  margin: 0 8px;
`;

export const CustomIcon = styled(FontAwesomeIcon)`
  width: 20px !important;
  height: 20px !important;
`;

export const DropDownButton = styled(Button)`
  padding-left: 12px;
  height: 30px;
  & .MuiButton-startIcon svg {
    font-size: 14px;
  }
`;

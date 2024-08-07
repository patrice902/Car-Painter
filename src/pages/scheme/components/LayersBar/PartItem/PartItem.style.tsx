import { Box, IconButton, Typography } from "@material-ui/core";
import styled from "styled-components/macro";

export const Wrapper = styled(Box)`
  cursor: pointer;
  &.sortable-chosen {
    background: rgba(255, 255, 255, 0.2);
  }
  &.activeItem {
    background: rgba(0, 0, 0, 0.5) !important;
  }
  &.hoveredItem {
    background: rgba(0, 0, 0, 0.2);
  }
  &.notAllowed {
    cursor: not-allowed;
  }
`;

export const CustomTypography = styled(Typography)<{ active: string }>`
  color: ${(props) => (props.active === "true" ? "white" : "darkgray")};
  font-size: 11px;
`;

export const SmallIconButton = styled(IconButton)`
  .MuiSvgIcon-root {
    width: 18px;
    height: 18px;
  }
`;

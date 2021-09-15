import styled from "styled-components/macro";
import InfiniteScroll from "react-infinite-scroll-component";

import {
  IconButton,
  DialogContent,
  GridList,
  GridListTile,
} from "@material-ui/core";
export const CustomInfiniteScroll = styled(InfiniteScroll)`
  &.infinite-scroll-component {
    overflow: hidden !important;
  }
`;

export const CustomGridList = styled(GridList)`
  overflow: hidden !important;
  margin: 0 !important;
`;
export const CustomGridListTile = styled(GridListTile)`
  cursor: pointer;
`;
export const CustomDialogContent = styled(DialogContent)`
  width: 600px;
`;

export const DeleteButton = styled(IconButton)`
  color: #ccc;
`;
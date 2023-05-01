import { ImageList, ImageListItem, makeStyles } from "@material-ui/core";
import styled from "styled-components/macro";

export const CustomImageList = styled(ImageList)`
  overflow: hidden !important;
  margin: 0 !important;
`;
export const CustomImageListItem = styled(ImageListItem)`
  cursor: pointer;
  border: 1px solid transparent;
  height: auto !important;
  min-height: 182px;
  &:hover {
    border: 1px solid gray;
  }
`;

export const useStyles = makeStyles(() => ({
  link: {
    color: "white",
  },
}));

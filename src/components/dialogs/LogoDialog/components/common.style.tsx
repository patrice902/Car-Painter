import { IconButton, ImageList, ImageListItem } from "@material-ui/core";
import styled from "styled-components/macro";

export const CustomImageList = styled(ImageList)`
  overflow: hidden !important;
  margin: 0 !important;
`;
export const CustomImageListItem = styled(ImageListItem)`
  cursor: pointer;
  border: 1px solid transparent;
  &:hover {
    border: 1px solid gray;
  }
`;

export const CustomImg = styled.img`
  width: 100%;
  height: 100%;
  position: relative;
  object-fit: contain;
`;

export const DeleteButton = styled(IconButton)`
  color: #ccc;
`;

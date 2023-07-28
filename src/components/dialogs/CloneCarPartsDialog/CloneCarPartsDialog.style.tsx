import { DialogContent, ImageList, ImageListItem } from "@material-ui/core";
import styled from "styled-components/macro";

export const CustomImageList = styled(ImageList)`
  overflow: hidden !important;
  margin: 0 !important;
`;
export const CustomImageListItem = styled(ImageListItem)<{ active?: boolean }>`
  cursor: pointer;

  & .MuiImageListItem-item {
    border: 1px solid ${({ active }) => (active ? "lightgreen" : "gray")};
  }

  & .MuiImageListItemBar-root {
    display: none;
  }
  &:hover {
    & .MuiImageListItemBar-root {
      display: flex;
    }
  }

  & img {
    cursor: pointer;
  }
`;

export const CustomDialogContent = styled(DialogContent)(
  ({ theme }) => `
  width: 300px;
   ${theme.breakpoints.up("sm")} {
    width: 600px;
  }
`
);

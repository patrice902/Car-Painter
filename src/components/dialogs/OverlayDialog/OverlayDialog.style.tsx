import { faStar as faStarOff } from "@fortawesome/free-regular-svg-icons";
import { faStar as faStarOn } from "@fortawesome/free-solid-svg-icons";
import {
  DialogContent,
  ImageList,
  ImageListItem,
  Typography,
} from "@material-ui/core";
import styled from "styled-components/macro";

export const CustomImageList = styled(ImageList)`
  overflow: hidden !important;
  margin: 0 !important;
`;
export const CustomImageListItem = styled(ImageListItem)`
  cursor: pointer;
  border: 1px solid transparent;

  & .MuiImageListItemBar-root {
    display: none;
  }
  &:hover {
    border: 1px solid gray;
    & .MuiImageListItemBar-root {
      display: flex;
      background: transparent;
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

export const CategoryText = styled(Typography)`
  background: rgba(0, 0, 0, 0.5);
  padding: 8px;
  margin: 0;
  color: white;
`;

export { faStarOn, faStarOff };

import { faStar as faStarOff } from "@fortawesome/free-regular-svg-icons";
import { faStar as faStarOn } from "@fortawesome/free-solid-svg-icons";
import {
  IconButton,
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

export const CustomImg = styled.img`
  width: 100%;
  height: 100%;
  position: relative;
  object-fit: contain;
`;

export const DeleteButton = styled(IconButton)`
  color: #ccc;
`;

export const CategoryText = styled(Typography)`
  background: rgba(0, 0, 0, 0.5);
  padding: 8px;
  margin: 0;
  color: white;
`;

export { faStarOn, faStarOff };

import { IconButton, makeStyles } from "@material-ui/core";
import styled from "styled-components/macro";

export const useStyles = makeStyles((theme) => ({
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
    position: "absolute",
    left: "14px",
    top: "12px",
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
}));

export const CustomIconButton = styled(IconButton)`
  border-radius: 5px;
`;

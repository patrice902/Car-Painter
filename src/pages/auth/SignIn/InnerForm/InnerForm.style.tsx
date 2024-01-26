import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from "@material-ui/icons";
import { createStyles, makeStyles } from "@material-ui/styles";
import styled from "styled-components";

export { VisibilityIcon, VisibilityOffIcon };

export const FullForm = styled.form`
  width: 100%;
`;

export const useStyles = makeStyles(() =>
  createStyles({
    gRecaptcha: {
      transform: "scale(1.46)",
      transformOrigin: "0 0",
      height: "115px",
    },
  })
);

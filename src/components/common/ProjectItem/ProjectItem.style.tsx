import { faStar as faStarOff } from "@fortawesome/free-regular-svg-icons";
import { faStar as faStarOn } from "@fortawesome/free-solid-svg-icons";
import { MoreVert as ActionIcon } from "@material-ui/icons";
import { createStyles, makeStyles } from "@material-ui/styles";

export const useStyles = makeStyles(() =>
  createStyles({
    breakableTypography: {
      wordBreak: "break-word",
      lineHeight: 1.2,
      color: "white",
      textDecoration: "none",
      display: "block",
      curosr: "pointer",
    },
  })
);

export { ActionIcon, faStarOn, faStarOff };

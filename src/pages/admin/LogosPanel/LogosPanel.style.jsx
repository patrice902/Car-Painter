import { withStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";

export const BigTooltip = withStyles((theme) => ({
  tooltip: {
    fontSize: 16,
  },
}))(Tooltip);

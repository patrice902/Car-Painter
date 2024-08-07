import { Box, Typography } from "@material-ui/core";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "src/redux";
import { MouseModes } from "src/types/enum";

import { useStyles } from "./BoardGuide.style";

export const BoardGuide = React.memo(() => {
  const classes = useStyles();

  const mouseMode = useSelector(
    (state: RootState) => state.boardReducer.mouseMode
  );

  return (
    <Box
      position="absolute"
      left={0}
      top="10px"
      width="100%"
      display="flex"
      justifyContent="center"
      className={classes.noPointerEvents}
    >
      {[MouseModes.LINE, MouseModes.ARROW, MouseModes.POLYGON].includes(
        mouseMode
      ) ? (
        <Box
          bgcolor="#666"
          p="8px 16px"
          borderRadius={10}
          border="2px solid navajowhite"
          className={classes.noPointerEvents}
        >
          <Typography className={classes.noPointerEvents}>
            Double-Click or Press Enter to finish drawing
          </Typography>
          <Typography className={classes.noPointerEvents}>
            You can also Press Esc to cancel/remove drawing.
          </Typography>
        </Box>
      ) : (
        <></>
      )}
    </Box>
  );
});

import React from "react";
import { Box, Typography } from "@material-ui/core";

export const ReconnectionBanner = React.memo(({ show }) => {
  return (
    <Box
      position="absolute"
      left={0}
      right={0}
      top="10px"
      width="520px"
      display="flex"
      justifyContent="center"
      margin="auto"
    >
      {show ? (
        <Box
          bgcolor="#666"
          p="15px 20px"
          borderRadius={10}
          border="2px solid navajowhite"
          position="relative"
        >
          <Typography>Connection Failure, Trying to reconnect...</Typography>
          <Typography>It'll refresh the page after reconnecting it.</Typography>
          <Typography>
            Please try to refresh the page manually if it doesn't reconnect at
            all.
          </Typography>
        </Box>
      ) : (
        <></>
      )}
    </Box>
  );
});

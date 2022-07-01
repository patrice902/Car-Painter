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
          <Typography>Paint Builder is trying to reconnect.</Typography>
          <Typography>
            This page will refresh after the connection is restored, or you can
            attempt to manually refresh the page.
          </Typography>
        </Box>
      ) : (
        <></>
      )}
    </Box>
  );
});

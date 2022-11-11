import React from "react";
import { Box, Typography, useMediaQuery } from "@material-ui/core";

export const ReconnectionBanner = React.memo(({ show }) => {
  const isDesktop = useMediaQuery((theme) => theme.breakpoints.up("sm"));

  return (
    <Box
      position="absolute"
      left={0}
      right={0}
      top="10px"
      width={isDesktop ? "520px" : "100%"}
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
          {isDesktop ? (
            <>
              <Typography>Paint Builder is trying to reconnect.</Typography>
              <Typography>
                This page will refresh after the connection is restored, or you
                can attempt to manually refresh the page.
              </Typography>
            </>
          ) : (
            <Typography>Reconnecting...</Typography>
          )}
        </Box>
      ) : (
        <></>
      )}
    </Box>
  );
});

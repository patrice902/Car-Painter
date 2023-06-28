import {
  Box,
  IconButton,
  Theme,
  Typography,
  useMediaQuery,
} from "@material-ui/core";
import { HighlightOff as CloseIcon } from "@material-ui/icons";
import React from "react";
import { NavLink } from "react-router-dom";
import { HelpLinks } from "src/constant";

import { useStyles } from "./LegacyBanner.style";

type LegacyBannerProps = {
  show: boolean;
  carMakeID: number;
  onDismiss: () => void;
};

export const LegacyBanner = React.memo(
  ({ show, carMakeID, onDismiss }: LegacyBannerProps) => {
    const isAboveMobile = useMediaQuery((theme: Theme) =>
      theme.breakpoints.up("sm")
    );
    const classes = useStyles();

    return (
      <Box
        position="absolute"
        left={0}
        right={0}
        top="10px"
        width={isAboveMobile ? "600px" : "350px"}
        display="flex"
        justifyContent="center"
        margin="auto"
      >
        {show ? (
          <Box
            bgcolor="#666"
            p="15px 45px 15px 20px"
            borderRadius={10}
            border="2px solid navajowhite"
            position="relative"
            zIndex={1090}
          >
            <Box position="absolute" right="5px" top="5px">
              <IconButton size="small" onClick={onDismiss}>
                <CloseIcon />
              </IconButton>
            </Box>
            <Typography>
              This project was created with an old version of Paint Builder.
              Legacy projects have some limitations compared to new projects. We
              suggest creating a new project.
            </Typography>
            <Typography>
              <a
                href={HelpLinks.LegacyProjects}
                className={classes.moreLink}
                target="_blank"
                rel="noreferrer"
              >
                More Info
              </a>
              <NavLink to={`/?make=${carMakeID}`} className={classes.link}>
                Create a new project
              </NavLink>
            </Typography>
          </Box>
        ) : (
          <></>
        )}
      </Box>
    );
  }
);

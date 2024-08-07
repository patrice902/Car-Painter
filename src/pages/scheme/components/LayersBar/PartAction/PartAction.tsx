import { Box, IconButton, Popover, Typography } from "@material-ui/core";
import {
  Add as AddIcon,
  ExpandMore as ExpandMoreIcon,
} from "@material-ui/icons";
import clsx from "clsx";
import React, { useCallback, useState } from "react";
import { LightTooltip } from "src/components/common";
import { focusBoardQuickly } from "src/helper";

import { CustomIconButton, useStyles } from "./PartAction.style";

export type PartActionItem = {
  title: string;
  icon: React.ReactNode;
  onClick: () => void;
};

type PartActionProps = {
  expanded: boolean;
  isPopover?: boolean;
  popoverTooltip?: string;
  hideActionLabel?: boolean;
  actions?: PartActionItem[];
  onExpandClick: () => void;
};

export const PartAction = React.memo(
  ({
    expanded,
    actions,
    isPopover,
    hideActionLabel,
    popoverTooltip,
    onExpandClick,
  }: PartActionProps) => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement>();

    const handlePoperOpen = useCallback(
      (event) => {
        setAnchorEl(event.currentTarget);
        focusBoardQuickly();
      },
      [setAnchorEl]
    );

    const handleClosePoper = useCallback(() => {
      setAnchorEl(undefined);
      focusBoardQuickly();
    }, [setAnchorEl]);

    return (
      <Box display="flex" justifyContent="flex-end">
        <IconButton
          size="small"
          onClick={onExpandClick}
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded,
          })}
        >
          <ExpandMoreIcon />
        </IconButton>
        {!actions ? (
          <></>
        ) : !isPopover ? (
          <LightTooltip title={actions[0].title} arrow>
            <IconButton size="small" onClick={actions[0].onClick}>
              <AddIcon />
            </IconButton>
          </LightTooltip>
        ) : (
          <>
            <LightTooltip title={popoverTooltip ?? ""} arrow>
              <IconButton size="small" onClick={handlePoperOpen}>
                <AddIcon />
              </IconButton>
            </LightTooltip>

            <Popover
              open={Boolean(anchorEl)}
              anchorEl={anchorEl}
              onClose={handleClosePoper}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <Box display="flex" flexDirection="column" p={1}>
                {actions.map((action, index) =>
                  hideActionLabel ? (
                    <LightTooltip key={index} title={action.title} arrow>
                      <CustomIconButton
                        size="small"
                        key={index}
                        onClick={() => {
                          handleClosePoper();
                          action.onClick();
                        }}
                      >
                        {action.icon}
                      </CustomIconButton>
                    </LightTooltip>
                  ) : (
                    <CustomIconButton
                      size="small"
                      key={index}
                      onClick={() => {
                        handleClosePoper();
                        action.onClick();
                      }}
                    >
                      <Box
                        display="flex"
                        justifyContent="flex-start"
                        alignItems="center"
                        width="100%"
                      >
                        {action.icon}
                        <Typography>{action.title}</Typography>
                      </Box>
                    </CustomIconButton>
                  )
                )}
              </Box>
            </Popover>
          </>
        )}
      </Box>
    );
  }
);

export default PartAction;

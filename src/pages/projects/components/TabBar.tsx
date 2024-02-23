import {
  Box,
  Button,
  Link,
  Theme,
  Typography,
  useMediaQuery,
} from "@material-ui/core";
import { Add as AddIcon } from "@material-ui/icons";
import { useFeatureFlag } from "configcat-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { ChangelogDialog } from "src/components/dialogs/ChangelogDialog";
import { RootState } from "src/redux";
import { ConfigCatFlags } from "src/types/enum";
import styled from "styled-components/macro";

const tabURLs = ["mine", "shared", "favorite"];

type TabBarProps = {
  tabValue: number;
  setTabValue: (value: number) => void;
  onCreateNew: () => void;
};

export const TabBar = React.memo(
  ({ tabValue, setTabValue, onCreateNew }: TabBarProps) => {
    const history = useHistory();
    const isAboveMobile = useMediaQuery((theme: Theme) =>
      theme.breakpoints.up("sm")
    );
    const [openChangeLog, setOpenChangeLog] = useState(false);

    const sharedSchemeList = useSelector(
      (state: RootState) => state.schemeReducer.sharedList
    );

    const newInvitationCount = useMemo(
      () => sharedSchemeList.filter((item) => !item.accepted).length,
      [sharedSchemeList]
    );
    const { value: helpLinkMenu } = useFeatureFlag(
      ConfigCatFlags.HELP_LINK_MENU,
      ""
    );

    const handleClickTabItem = useCallback(
      (tabIndex) => {
        window.history.replaceState({}, "", tabURLs[tabIndex]);
        setTabValue(tabIndex);
      },
      [setTabValue]
    );

    useEffect(() => {
      // Set Tab based on query string
      const url = new URL(window.location.href);
      const schemeID = url.searchParams.get("scheme");
      if (schemeID) {
        history.push(`/project/${schemeID}`);
        return;
      }

      const pathName = url.pathname.slice(1);
      const tab = tabURLs.findIndex((item) => item === pathName);
      if (tab !== -1) setTabValue(+tab);
    }, [history, setTabValue]);

    return (
      <Box
        width={isAboveMobile ? "250px" : "100%"}
        display="flex"
        flexDirection={isAboveMobile ? "column" : "row"}
        justifyContent={"space-between"}
      >
        <Box>
          {isAboveMobile ? (
            <Box display="flex" justifyContent="space-between" p={3}>
              <GreyButton
                onClick={onCreateNew}
                color="primary"
                variant="contained"
                startIcon={<AddIcon />}
                style={{ marginRight: "8px" }}
              >
                <Typography variant="subtitle1"> New</Typography>
              </GreyButton>
            </Box>
          ) : null}
          <Box
            display="flex"
            flexDirection={isAboveMobile ? "column" : "row"}
            width="100%"
            justifyContent={isAboveMobile ? "start" : "space-between"}
          >
            <Tab
              state={tabValue === 0 ? "active" : null}
              onClick={() => handleClickTabItem(0)}
            >
              <Typography>My Projects</Typography>
            </Tab>
            <Tab
              display="flex"
              justifyContent={
                newInvitationCount || isAboveMobile ? "space-between" : "center"
              }
              state={tabValue === 1 ? "active" : null}
              onClick={() => handleClickTabItem(1)}
            >
              <Typography>Shared with Me</Typography>
              {newInvitationCount ? (
                <Box borderRadius="100%" bgcolor="#444" px="10px">
                  <Typography variant="body1">{newInvitationCount}</Typography>
                </Box>
              ) : (
                <></>
              )}
            </Tab>
            <Tab
              state={tabValue === 2 ? "active" : null}
              onClick={() => handleClickTabItem(2)}
            >
              <Typography>Favorite Projects</Typography>
            </Tab>
          </Box>
        </Box>
        {isAboveMobile && (
          <Box padding="12px 12px 24px">
            <ClickableTypography
              color="textSecondary"
              variant="subtitle1"
              onClick={() => setOpenChangeLog(true)}
            >
              What&apos;s New
            </ClickableTypography>
            <Typography color="textSecondary" variant="subtitle1">
              <Link href={helpLinkMenu} color="inherit" target="_blank">
                Help
              </Link>
            </Typography>
            <ChangelogDialog
              open={openChangeLog}
              onCancel={() => setOpenChangeLog(false)}
            />
          </Box>
        )}
      </Box>
    );
  }
);

const ClickableTypography = styled(Typography)`
  cursor: pointer;
`;

const GreyButton = styled(Button)`
  background-color: #444;
  &:hover {
    background-color: #666;
  }
`;

const Tab = styled(Box)<{ state?: string | null }>`
  background-color: ${(props) => (props.state === "active" ? "#222" : "#333")};
  cursor: pointer;
  padding: 12px 6px;
  flex-grow: 1;
  text-align: center;

  ${(props) => props.theme.breakpoints.up("sm")} {
    padding: 4px 12px;
    text-align: left;
  }
`;

export default TabBar;

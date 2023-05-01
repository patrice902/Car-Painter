import {
  Box,
  Button,
  Theme,
  Typography,
  useMediaQuery,
} from "@material-ui/core";
import { Add as AddIcon } from "@material-ui/icons";
import React, { useCallback, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { RootState } from "src/redux";
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

    const sharedSchemeList = useSelector(
      (state: RootState) => state.schemeReducer.sharedList
    );

    const newInvitationCount = useMemo(
      () => sharedSchemeList.filter((item) => !item.accepted).length,
      [sharedSchemeList]
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
      >
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
    );
  }
);

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

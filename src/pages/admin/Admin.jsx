import GraphicsIcon from "assets/insert-graphics.svg";
import LogoIcon from "assets/insert-logo.svg";
import { AppHeader } from "components/common";
import { Box, Paper, Tab, Tabs } from "components/MaterialUI";
import React, { useState } from "react";

import LogosPanel from "./LogosPanel";
import OverlaysPanel from "./OverlaysPanel";

export const Admin = React.memo(() => {
  const [tabValue, setTabValue] = useState(0);

  return (
    <Box width="100%" height="100%" display="flex" flexDirection="column">
      <AppHeader />
      <Box p={2}>
        <Paper variant="outlined">
          <Tabs
            value={tabValue}
            onChange={(_, newValue) => setTabValue(newValue)}
            variant="fullWidth"
            indicatorColor="secondary"
            textColor="secondary"
            aria-label="icon label tabs example"
          >
            <Tab
              icon={<img src={LogoIcon} alt="Logos" height={"40px"} />}
              label="Logos"
            />
            <Tab
              icon={
                <img
                  src={GraphicsIcon}
                  alt="Graphics"
                  height="45px"
                  style={{ margin: "-4px" }}
                />
              }
              label="Graphics"
            />
          </Tabs>
          <TabPanel value={tabValue} index={0}>
            <LogosPanel />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <OverlaysPanel />
          </TabPanel>
        </Paper>
      </Box>
    </Box>
  );
});

const TabPanel = ({ children, value, index, ...props }) => (
  <Box
    role="tabpanel"
    hidden={value !== index}
    id={`projects-tabpanel-${index}`}
    aria-labelledby={`projects-tab-${index}`}
    width="100%"
    {...props}
  >
    {value === index && (
      <Box display="flex" flexDirection="column">
        {children}
      </Box>
    )}
  </Box>
);

export default Admin;

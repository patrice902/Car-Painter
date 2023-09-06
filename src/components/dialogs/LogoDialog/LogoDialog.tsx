import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  Theme,
  Typography,
  useMediaQuery,
} from "@material-ui/core";
import _ from "lodash";
import React, { ChangeEvent, useCallback, useMemo, useState } from "react";
import { SearchBox } from "src/components/common";
import { BuilderLogo, BuilderUpload } from "src/types/model";
import { UserWithoutPassword } from "src/types/query";

import EnterCodeBtn from "../UploadDialog/EnterCodeBtn";
import { FlagContent, LogoContent, UploadContent } from "./components";
import {
  a11yProps,
  CustomDialogActions,
  CustomDialogContent,
  StyledTab,
  StyledTabs,
  TabPanel,
} from "./LogoDialog.style";

type LogoDialogProps = {
  logos: BuilderLogo[];
  uploads: BuilderUpload[];
  user: UserWithoutPassword;
  open: boolean;
  onOpenLogo: (logo: BuilderLogo) => void;
  onOpenUpload: (upload: BuilderUpload) => void;
  onCancel: () => void;
};

export const LogoDialog = React.memo(
  ({
    logos,
    uploads,
    open,
    onOpenLogo,
    onOpenUpload,
    onCancel,
  }: LogoDialogProps) => {
    const step = 40;
    const [tabValue, setTabValue] = useState(0);
    const [search, setSearch] = useState("");
    const isAboveMobile = useMediaQuery((theme: Theme) =>
      theme.breakpoints.up("sm")
    );
    const sortedLogos = useMemo(
      () =>
        _.orderBy(
          logos,
          [
            function (o) {
              return o.name.toLowerCase();
            },
          ],
          ["asc"]
        ),
      [logos]
    );

    const handleTabChange = useCallback(
      (event: ChangeEvent<unknown>, newValue?: number) => {
        if (newValue === undefined) return;

        setTabValue(newValue);
        setSearch("");
      },
      [setTabValue, setSearch]
    );

    const handleSearchChange = useCallback((value) => setSearch(value), []);

    console.log("tabValue: ", tabValue);

    return (
      <Dialog aria-labelledby="logo-title" open={open} onClose={onCancel}>
        <DialogTitle id="logo-title" style={{ padding: "0px 24px" }}>
          <Box display="flex" flexDirection="row" alignItems="center">
            {isAboveMobile ? (
              <Typography variant="h5" style={{ marginRight: "8px" }}>
                Insert:
              </Typography>
            ) : (
              <></>
            )}
            <StyledTabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="logo tab"
            >
              <StyledTab label="Logos" {...a11yProps(0)} />
              <StyledTab label="Flags" {...a11yProps(1)} />
              <StyledTab label="My Uploads" {...a11yProps(2)} />
            </StyledTabs>
          </Box>
        </DialogTitle>
        <CustomDialogContent dividers>
          <Box mb={2}>
            <SearchBox value={search} onChange={handleSearchChange} />
          </Box>
          <TabPanel value={tabValue} index={0}>
            <LogoContent
              step={step}
              logos={sortedLogos}
              search={search}
              onOpen={onOpenLogo}
            />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <FlagContent
              step={step}
              logos={logos}
              search={search}
              onOpen={onOpenLogo}
            />
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            <UploadContent
              step={step}
              uploads={uploads}
              search={search}
              setSearch={setSearch}
              onOpen={onOpenUpload}
            />
          </TabPanel>
        </CustomDialogContent>
        <CustomDialogActions
          justifyContent={tabValue === 2 ? "space-between" : "flex-end"}
        >
          {tabValue === 2 && <EnterCodeBtn />}
          <Button onClick={onCancel} color="secondary">
            Cancel
          </Button>
        </CustomDialogActions>
      </Dialog>
    );
  }
);

export default LogoDialog;

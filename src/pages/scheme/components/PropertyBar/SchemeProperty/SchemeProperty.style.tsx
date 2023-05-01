import { Box, Tab, TabProps, Tabs, TabsProps } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { CustomTabPanelProps } from "src/types/common";

export const TabPanel = ({
  children,
  value,
  index,
  ...other
}: CustomTabPanelProps) => (
  <Box
    role="tabpanel"
    hidden={value !== index}
    id={`project-settings-tabpanel-${index}`}
    aria-labelledby={`project-settings-tab-${index}`}
    {...other}
  >
    {value === index && <>{children}</>}
  </Box>
);

export const a11yProps = (index: string | number) => ({
  id: `project-settings-tab-${index}`,
  "aria-controls": `project-settings-tabpanel-${index}`,
});

export const StyledTabs = withStyles({
  indicator: {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "transparent",
    "& > span": {
      width: "100%",
      backgroundColor: "#279AF1",
    },
  },
  root: {
    paddingLeft: "0",
    borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
  },
})((props: TabsProps) => (
  <Tabs {...props} TabIndicatorProps={{ children: <span /> }} />
));

export const StyledTab = withStyles((theme) => ({
  root: {
    textTransform: "none",
    color: "#fff",
    fontWeight: theme.typography.fontWeightRegular,
    marginRight: "10px",
    padding: "6px 5px",
    minWidth: 50,
    fontSize: "12px",
    "&:focus": {
      opacity: 1,
    },
    [theme.breakpoints.up("md")]: {
      fontSize: "1rem",
    },
  },
}))((props: TabProps) => <Tab disableRipple {...props} />);

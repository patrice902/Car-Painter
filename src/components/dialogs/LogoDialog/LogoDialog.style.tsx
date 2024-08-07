import {
  DialogActions,
  DialogContent,
  Tab,
  TabProps,
  Tabs,
  TabsProps,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { CustomTabPanelProps } from "src/types/common";
import styled from "styled-components/macro";

export const CustomDialogContent = styled(DialogContent)(
  ({ theme }) => `
  width: 300px;
   ${theme.breakpoints.up("sm")} {
    width: 600px;
  }
`
);

export const StyledTabs = withStyles({
  indicator: {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "transparent",
    "& > span": {
      maxWidth: "calc(100% - 10px)",
      width: "100%",
      backgroundColor: "#279AF1",
    },
  },
})((props: TabsProps) => (
  <Tabs {...props} TabIndicatorProps={{ children: <span /> }} />
));

export const StyledTab = withStyles((theme) => ({
  root: {
    textTransform: "none",
    color: "#fff",
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: "1rem",
    marginRight: 0,
    padding: "6px 5px",
    minWidth: 60,
    "&:focus": {
      opacity: 1,
    },
  },
}))((props: TabProps) => <Tab disableRipple {...props} />);

export const TabPanel = (props: CustomTabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`logo-tabpanel-${index}`}
      aria-labelledby={`logo-tab-${index}`}
      {...other}
    >
      {value === index && <>{children}</>}
    </div>
  );
};

export const a11yProps = (index: string | number) => ({
  id: `logo-tab-${index}`,
  "aria-controls": `logo-tabpanel-${index}`,
});

export const CustomDialogActions = styled(DialogActions)<{
  justifyContent?: string;
}>`
  display: flex;
  justify-content: ${(props) => props.justifyContent};
  align-items: center;
  padding: 8px 16px;
`;

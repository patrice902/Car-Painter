/* eslint-disable import/export */
import {
  Button as MuiButton,
  CircularProgress as MuiCircularProgress,
  Divider as MuiDivider,
  Grid as MuiGrid,
  IconButton as MuiIconButton,
  Link as MuiLink,
  Select as MuiSelect,
  TextField as MuiTextField,
  Typography as MuiTypography,
} from "@material-ui/core";
import {
  Alert as MuiAlert,
  Autocomplete as MuiAutocomplete,
  ToggleButton as MuiToggleButton,
  ToggleButtonGroup as MuiToggleButtonGroup,
} from "@material-ui/lab";
import { spacing } from "@material-ui/system";
import styled from "styled-components";

export * from "@material-ui/core";

export const Alert = styled(MuiAlert)(spacing);
export const Autocomplete = styled(MuiAutocomplete)(spacing);
export const TextField = styled(MuiTextField)(spacing);
export const Button = styled(MuiButton)(spacing);
export const IconButton = styled(MuiIconButton)(spacing);
export const Link = styled(MuiLink)(spacing);
export const Typography = styled(MuiTypography)(spacing);
export const Grid = styled(MuiGrid)(spacing);
export const CircularProgress = styled(MuiCircularProgress)(spacing);
export const Select = styled(MuiSelect)(spacing);
export const ToggleButton = styled(MuiToggleButton)(spacing);
export const ToggleButtonGroup = styled(MuiToggleButtonGroup)(spacing);

export const HorizontalDivider = styled(MuiDivider)`
  width: 100%;
`;

import { DialogActions, makeStyles, TextField } from "@material-ui/core";
import styled from "styled-components/macro";

export const CustomDialogActions = styled(DialogActions)`
  padding-right: 24px;
`;

export const NameField = styled(TextField)`
  .MuiInputBase-root {
    height: 56px;
  }
  .MuiInputBase-input {
    font-family: CircularXXWeb-Regular;
  }
`;

export const useStyles = makeStyles((theme) => ({
  carMakeAutocomplete: {
    marginBottom: "16px",
    ".MuiInputLabel-outlined": {
      transform: "translate(14px, 19px) scale(1)",
      "&.MuiInputLabel-shrink": {
        transform: "translate(14px, -6px) scale(0.75)",
      },
    },

    width: "250px",

    [theme.breakpoints.up("sm")]: {
      width: "500px",
    },
  },
}));

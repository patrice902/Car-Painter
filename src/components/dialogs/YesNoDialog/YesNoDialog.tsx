import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import React from "react";

import { TextWrapper } from "./YesNoDialog.style";

type YesNoDialogProps = {
  text: string | JSX.Element | Element;
  open: boolean;
  onYes: () => void;
  onNo: () => void;
};

export const YesNoDialog = React.memo((props: YesNoDialogProps) => {
  const { text, open, onYes, onNo } = props;

  return (
    <Dialog aria-labelledby="confirm-title" open={open}>
      <DialogTitle id="confirm-title">Confirm</DialogTitle>
      <DialogContent dividers>
        <TextWrapper>{text}</TextWrapper>
      </DialogContent>
      <DialogActions>
        <Button onClick={onYes} color="secondary" variant="outlined" autoFocus>
          Yes
        </Button>
        <Button onClick={onNo} color="primary" variant="outlined">
          No
        </Button>
      </DialogActions>
    </Dialog>
  );
});

export default YesNoDialog;

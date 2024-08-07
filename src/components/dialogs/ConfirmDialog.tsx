import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@material-ui/core";
import React from "react";

type ConfirmDialogProps = {
  text?: JSX.Element | string | null;
  open: boolean;
  confirmLoading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export const ConfirmDialog = React.memo((props: ConfirmDialogProps) => {
  const { text, open, confirmLoading, onCancel, onConfirm } = props;

  return (
    <Dialog aria-labelledby="confirm-title" open={open} onClose={onCancel}>
      <DialogTitle id="confirm-title">Confirm</DialogTitle>
      <DialogContent dividers>
        <Typography variant="body1">{text}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="primary">
          Cancel
        </Button>

        <Button
          onClick={onConfirm}
          color="secondary"
          variant="outlined"
          autoFocus
        >
          {confirmLoading ? (
            <CircularProgress color="secondary" size={20} />
          ) : (
            "Confirm"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
});

export default ConfirmDialog;

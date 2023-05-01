import {
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Typography,
} from "@material-ui/core";
import React, { useCallback, useState } from "react";
import styled from "styled-components";

interface LayerDeleteDialogProps {
  text?: string;
  open?: boolean;
  deleteUpload?: boolean;
  loading?: boolean;
  onCancel: () => void;
  onConfirm: (deleteUpload?: boolean) => void;
}

export const LayerDeleteDialog = React.memo((props: LayerDeleteDialogProps) => {
  const { text, open, deleteUpload, loading, onCancel, onConfirm } = props;
  const [gonnaDeleteAll, setGonnaDeleteAll] = useState(false);

  const handleConfirm = useCallback(() => {
    onConfirm(deleteUpload && gonnaDeleteAll);
  }, [deleteUpload, gonnaDeleteAll, onConfirm]);

  return (
    <Dialog
      aria-labelledby="confirm-title"
      open={Boolean(open)}
      onClose={onCancel}
    >
      <DialogTitle id="confirm-title">Confirm</DialogTitle>
      <CustomDialogContent dividers>
        <Typography variant="body1">{text}</Typography>
        {deleteUpload ? (
          <FormControlLabel
            control={
              <Checkbox
                checked={gonnaDeleteAll}
                onChange={(event) => setGonnaDeleteAll(event.target.checked)}
                color="primary"
              />
            }
            label="Also delete logo from My Uploads"
          />
        ) : (
          <></>
        )}
      </CustomDialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="primary">
          Cancel
        </Button>

        <Button
          onClick={handleConfirm}
          color="secondary"
          variant="outlined"
          autoFocus
        >
          {loading ? (
            <CircularProgress color="secondary" size={20} />
          ) : (
            "Confirm"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
});

export const CustomDialogContent = styled(DialogContent)(
  ({ theme }) => `
  padding-right: 8px;
   ${theme.breakpoints.up("sm")} {
    padding-right: 24px;
  }
`
);

export default LayerDeleteDialog;

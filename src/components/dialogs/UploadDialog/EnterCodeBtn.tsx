import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "src/redux";
import { createSharedUploadByCode } from "src/redux/reducers/uploadReducer";

export const EnterCodeBtn = React.memo(() => {
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState<string>("");

  const user = useSelector((state: RootState) => state.authReducer.user);

  const handleClose = () => {
    setOpen(false);
    setCode("");
  };

  const handleApply = () => {
    if (!user || !code) return;

    setLoading(true);
    dispatch(
      createSharedUploadByCode(
        {
          code,
          userID: user.id,
        },
        () => {
          handleClose();
          setLoading(false);
        },
        () => setLoading(false)
      )
    );
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>Enter Code</Button>
      <Dialog open={Boolean(open)} onClose={handleClose}>
        <DialogTitle>
          <Typography variant="h5">Enter Code</Typography>
        </DialogTitle>
        <DialogContent dividers style={{ width: "400px" }}>
          <TextField
            variant="outlined"
            fullWidth
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleApply}
            color="primary"
            variant="outlined"
            disabled={!code.length || loading}
          >
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
});

export default EnterCodeBtn;

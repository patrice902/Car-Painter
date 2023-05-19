import { Dialog, DialogContent, DialogTitle, Grid } from "@material-ui/core";
import React from "react";
import { ShortCuts } from "src/constant/shortcuts";

import { DescriptionText, KeyText } from "./ShortCutsDialog.style";

type ShortCutsDialogProps = {
  open: boolean;
  onCancel: () => void;
};

export const ShortCutsDialog = React.memo(
  ({ onCancel, open }: ShortCutsDialogProps) => (
    <Dialog
      aria-labelledby="short-cuts-title"
      open={open}
      onClose={onCancel}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle id="short-cuts-title">Shortcuts</DialogTitle>
      <DialogContent dividers id="short-cuts-dialog-content">
        {Object.keys(ShortCuts).map((item, index) => (
          <Grid
            container
            spacing={2}
            key={index}
            style={{ marginBottom: "4px" }}
          >
            <Grid item xs={6}>
              <KeyText>{item}</KeyText>
            </Grid>
            <Grid item xs={6}>
              <DescriptionText>
                {ShortCuts[item as keyof typeof ShortCuts]}
              </DescriptionText>
            </Grid>
          </Grid>
        ))}
      </DialogContent>
    </Dialog>
  )
);

export default ShortCutsDialog;

import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import Markdown from "react-markdown";
import config from "src/config";

type ChangelogDialogProps = {
  onCancel: () => void;
  open: boolean;
};

export const ChangelogDialog = React.memo(
  ({ onCancel, open }: ChangelogDialogProps) => {
    const [markdown, setMarkdown] = useState<string>();

    useEffect(() => {
      fetch(config.assetsURL + config.changeLogAssetPath)
        .then((response) => response.text())
        .then((textContent) => {
          setMarkdown(textContent);
        });
    }, []);

    return (
      <Dialog open={open} onClose={onCancel} maxWidth="lg">
        <DialogTitle>Changelog</DialogTitle>
        <DialogContent dividers>
          {markdown ? <Markdown>{markdown}</Markdown> : <CircularProgress />}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={onCancel}
            color="secondary"
            variant="outlined"
            autoFocus
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
);
export default ChangelogDialog;

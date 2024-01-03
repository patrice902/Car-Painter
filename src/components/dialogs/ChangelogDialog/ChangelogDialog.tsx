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
import styled from "styled-components";

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
        <DialogTitle>What&apos;s New</DialogTitle>
        <CustomDialogContent dividers>
          {markdown ? <Markdown>{markdown}</Markdown> : <CircularProgress />}
        </CustomDialogContent>
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

export const CustomDialogContent = styled(DialogContent)`
  font-size: 14px;
`;

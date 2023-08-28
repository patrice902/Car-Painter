import {
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
} from "@material-ui/core";
import copy from "copy-to-clipboard";
import _ from "lodash";
import React, { useState } from "react";

import { CopiedText, CopyableText, CopyIcon } from "./UploadDialog.style";

type CopyCodeDialogProps = {
  open?: boolean;
  onCancel: () => void;
  code?: string;
};

export const CopyCodeDialog = React.memo(
  ({ open, code, onCancel }: CopyCodeDialogProps) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
      copy(code ?? "");
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    };

    return (
      <Dialog open={Boolean(open)} onClose={onCancel}>
        <DialogTitle>
          <Typography variant="h5">Copy Sharing Code</Typography>
        </DialogTitle>
        <DialogContent dividers style={{ width: "500px" }}>
          <CopyableText onClick={handleCopy}>
            {code}
            {copied ? <CopiedText>Copied!</CopiedText> : <CopyIcon />}
          </CopyableText>
        </DialogContent>
      </Dialog>
    );
  }
);

export default CopyCodeDialog;

import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
} from "@material-ui/core";
import copy from "copy-to-clipboard";
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
          <Box
            bgcolor="#666"
            p="10px 16px"
            borderRadius={10}
            border="2px solid navajowhite"
            position="relative"
            mb="10px"
          >
            <Typography>
              Copy the code below to share this item with another Paint Builder
              user. When someone enters this code by choosing Enter Code on
              their My Uploads screen, they&#39;ll be able to use this item in
              their Paint Builder projects.
            </Typography>
          </Box>
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

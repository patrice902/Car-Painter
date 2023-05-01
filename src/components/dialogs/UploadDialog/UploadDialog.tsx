import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
} from "@material-ui/core";
import React, { useCallback, useState } from "react";
import { SearchBox } from "src/components/common";
import { BuilderUpload } from "src/types/model";

import { CustomDialogContent } from "./UploadDialog.style";
import UploadListContent from "./UploadListConent";

type UploadDialogProps = {
  uploads: BuilderUpload[];
  open: boolean;
  onCancel: () => void;
  onOpenUpload: (upload: BuilderUpload) => void;
};

export const UploadDialog = React.memo(
  ({ uploads, onCancel, open, onOpenUpload }: UploadDialogProps) => {
    const [search, setSearch] = useState("");

    const handleSearchChange = useCallback((value) => setSearch(value), []);

    return (
      <Dialog aria-labelledby="upload-title" open={open} onClose={onCancel}>
        <DialogTitle id="upload-title">My Uploads</DialogTitle>
        <CustomDialogContent dividers>
          <Box mb={2}>
            <SearchBox value={search} onChange={handleSearchChange} />
          </Box>
          <UploadListContent
            uploads={uploads}
            search={search}
            setSearch={setSearch}
            onOpenUpload={onOpenUpload}
          />
        </CustomDialogContent>
        <DialogActions>
          <Button onClick={onCancel} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
);

export default UploadDialog;

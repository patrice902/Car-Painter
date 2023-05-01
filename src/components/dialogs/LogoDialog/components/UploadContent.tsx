import React from "react";
import UploadListContent from "src/components/dialogs/UploadDialog/UploadListConent";
import { BuilderUpload } from "src/types/model";

type UploadContentProps = {
  step?: number;
  uploads: BuilderUpload[];
  search: string;
  setSearch: (value: string) => void;
  onOpen: (upload: BuilderUpload) => void;
};

export const UploadContent = React.memo(
  ({ step = 40, uploads, search, setSearch, onOpen }: UploadContentProps) => (
    <UploadListContent
      step={step}
      uploads={uploads}
      search={search}
      setSearch={setSearch}
      onOpenUpload={onOpen}
    />
  )
);

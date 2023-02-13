import UploadListContent from "components/dialogs/UploadDialog/UploadListConent";
import React from "react";

export const UploadContent = React.memo((props) => {
  const { uploads, search, setSearch, onOpen } = props;

  return (
    <UploadListContent
      uploads={uploads}
      search={search}
      setSearch={setSearch}
      onOpenUpload={onOpen}
    />
  );
});

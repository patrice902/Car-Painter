import {
  Button,
  DialogActions,
  DialogContent,
  Typography,
} from "@material-ui/core";
import React, { useCallback, useRef, useState } from "react";
import config from "src/config";

type ShowroomTabProps = {
  schemeID: number;
  retrieveTGAPNGDataUrl: () => Promise<string | null | undefined>;
  onClose: () => void;
};

export const ShowroomTab = React.memo(
  ({ schemeID, retrieveTGAPNGDataUrl, onClose }: ShowroomTabProps) => {
    const showroomFormRef = useRef<HTMLFormElement>(null);
    const [showroomFile, setShowroomFile] = useState<string | null | undefined>(
      null
    );

    const handleSubmitToShowroom = useCallback(async () => {
      const dataURL = await retrieveTGAPNGDataUrl();
      setShowroomFile(dataURL);
      showroomFormRef.current?.submit();
      onClose();
    }, [onClose, retrieveTGAPNGDataUrl]);

    return (
      <>
        <DialogContent dividers>
          <Typography>
            Submit this project to the Showroom in its current state so that
            other people can race with this paint.
          </Typography>
          <form
            ref={showroomFormRef}
            style={{ display: "none" }}
            action={`${config.parentAppURL}/showroom/upload/${schemeID}`}
            method="post"
            target="_blank"
            encType="multipart/form-data"
          >
            <input type="hidden" name="car_file" value={showroomFile ?? ""} />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">
            Cancel
          </Button>
          <Button
            color="primary"
            variant="outlined"
            onClick={handleSubmitToShowroom}
          >
            Submit
          </Button>
        </DialogActions>
      </>
    );
  }
);

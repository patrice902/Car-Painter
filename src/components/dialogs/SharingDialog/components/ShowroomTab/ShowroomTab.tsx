import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  Link,
  Typography,
} from "@material-ui/core";
import { useFeatureFlag } from "configcat-react";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSelector } from "react-redux";
import config from "src/config";
import { detectBrowser } from "src/helper";
import { RootState } from "src/redux";
import { Browser, ConfigCatFlags } from "src/types/enum";

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
    const [capturing, setCapturing] = useState(false);
    const currentScheme = useSelector(
      (state: RootState) => state.schemeReducer.current
    );
    const { value: helpLinkSpecTga } = useFeatureFlag(
      ConfigCatFlags.HELP_LINK_SPEC_TGA,
      ""
    );

    const showroomURL = useMemo(
      () => `${config.parentAppURL}/showroom/upload/${schemeID}`,
      [schemeID]
    );

    const setShowroomFileFromScreen = useCallback(async () => {
      setCapturing(true);
      const dataURL = await retrieveTGAPNGDataUrl();
      setShowroomFile(dataURL);
      setCapturing(false);
    }, [retrieveTGAPNGDataUrl]);

    const handleSubmitToShowroom = useCallback(async () => {
      if (detectBrowser() !== Browser.FIREFOX) {
        await setShowroomFileFromScreen();
      }
      showroomFormRef.current?.submit();
      onClose();
    }, [onClose, setShowroomFileFromScreen]);

    useEffect(() => {
      if (detectBrowser() === Browser.FIREFOX) {
        setShowroomFileFromScreen();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <>
        <DialogContent dividers>
          <Typography>
            Submit this project to the Showroom in its current state so that
            other people can race with this paint.
          </Typography>
          {!currentScheme?.hide_spec ? (
            <Box
              bgcolor="#666"
              p="10px 16px"
              borderRadius={10}
              border="2px solid navajowhite"
              position="relative"
              mt="10px"
            >
              <Typography>
                In order to race with or assign a Paint Builder-generated spec
                map that shows your selected Finish options, you&apos;ll need to
                obtain and upload a MIP file from iRacing.{" "}
                <Link
                  href={helpLinkSpecTga}
                  color="secondary"
                  target="_blank"
                  rel="noreferrer"
                >
                  Learn how
                </Link>
              </Typography>
            </Box>
          ) : (
            <></>
          )}
          <form
            ref={showroomFormRef}
            style={{ display: "none" }}
            action={showroomURL}
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
            disabled={capturing}
            onClick={handleSubmitToShowroom}
          >
            Submit
          </Button>
        </DialogActions>
      </>
    );
  }
);

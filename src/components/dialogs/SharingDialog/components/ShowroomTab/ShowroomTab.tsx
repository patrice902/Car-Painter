import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  FormControlLabel,
  Link,
  Switch,
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
import { useDispatch, useSelector } from "react-redux";
import config from "src/config";
import { detectBrowser } from "src/helper";
import { RootState } from "src/redux";
import { updateScheme } from "src/redux/reducers/schemeReducer";
import { Browser, ConfigCatFlags } from "src/types/enum";

type ShowroomTabProps = {
  schemeID: number;
  retrieveTGAPNGDataUrl: () => Promise<string | null | undefined>;
  onClose: () => void;
};

export const ShowroomTab = React.memo(
  ({ schemeID, retrieveTGAPNGDataUrl, onClose }: ShowroomTabProps) => {
    const dispatch = useDispatch();
    const showroomFormRef = useRef<HTMLFormElement>(null);
    const [showroomFile, setShowroomFile] = useState<string | null | undefined>(
      null
    );
    const [capturing, setCapturing] = useState(false);
    const currentScheme = useSelector(
      (state: RootState) => state.schemeReducer.current
    );
    const owner = useSelector((state: RootState) => state.schemeReducer.owner);
    const currentUser = useSelector(
      (state: RootState) => state.authReducer.user
    );

    const { value: helpLinkSpecTga } = useFeatureFlag(
      ConfigCatFlags.HELP_LINK_SPEC_TGA,
      ""
    );
    const { value: enablePublicSharing } = useFeatureFlag(
      ConfigCatFlags.PUBLIC_SHARING,
      false
    );

    const showroomURL = useMemo(
      () => `${config.parentAppURL}/showroom/upload/${schemeID}`,
      [schemeID]
    );
    const isOwner = useMemo(() => owner?.id === currentUser?.id, [
      currentUser,
      owner,
    ]);

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

    const handleTogglePublic = useCallback(
      (toggleOn: boolean) => {
        dispatch(updateScheme({ id: currentScheme?.id, public: toggleOn }));
      },
      [dispatch, currentScheme]
    );

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
          {isOwner && enablePublicSharing ? (
            <Box my={2}>
              <FormControlLabel
                control={
                  <Switch
                    checked={currentScheme?.public}
                    onChange={(event) =>
                      handleTogglePublic(event.target.checked)
                    }
                  />
                }
                label="Allow other users to make a copy of this project"
              />
            </Box>
          ) : (
            <></>
          )}
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

import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Popover,
  Theme,
  Typography,
  useMediaQuery,
} from "@material-ui/core";
import { Settings as SettingsIcon } from "@material-ui/icons";
import { useFeatureFlag } from "configcat-react";
import React, { useCallback, useMemo, useState } from "react";
import { FaDownload } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import RaceIcon from "src/assets/race.svg";
import { AppHeader } from "src/components/common";
import { SchemeSettingsDialog, SharingDialog } from "src/components/dialogs";
import RaceConfirmDialog from "src/components/dialogs/RaceConfirmDialog";
import RaceDialog from "src/components/dialogs/RaceDialog/RaceDialog";
import { dataURItoBlob, focusBoardQuickly } from "src/helper";
import { RootState } from "src/redux";
import { getCarRaces, setCarRace } from "src/redux/reducers/carReducer";
import { setMessage } from "src/redux/reducers/messageReducer";
import { updateScheme } from "src/redux/reducers/schemeReducer";
import { ConfigCatFlags, DialogTypes } from "src/types/enum";

import {
  CustomButtonGroup,
  CustomIcon,
  DropDownButton,
  DropDownIcon,
  ShareIcon,
} from "./Header.style";

type HeaderProps = {
  editable: boolean;
  onBack: (goParent?: boolean) => void;
  onDownloadTGA: (isCustomNumberTGA?: boolean) => void;
  onDownloadSpecTGA: () => void;
  retrieveTGAPNGDataUrl: () => Promise<string | null | undefined>;
};

export const Header = React.memo(
  ({
    editable,
    onBack,
    onDownloadTGA,
    onDownloadSpecTGA,
    retrieveTGAPNGDataUrl,
  }: HeaderProps) => {
    const [tgaAnchorEl, setTGAAnchorEl] = useState<HTMLButtonElement>();
    const [raceAnchorEl, setRaceAnchorEl] = useState<HTMLButtonElement>();
    const [shareAnchorEl, setShareAnchorEl] = useState<HTMLButtonElement>();
    const [dialog, setDialog] = useState<DialogTypes>();
    const [applyingRace, setApplyingRace] = useState(false);
    const [sharingTab, setSharingTab] = useState(0);

    const dispatch = useDispatch();
    const isAboveMobile = useMediaQuery((theme: Theme) =>
      theme.breakpoints.up("sm")
    );
    const { value: enabledRaceFunctionality } = useFeatureFlag(
      ConfigCatFlags.RACE_FUNCTIONALITY,
      true
    );
    const { value: enableSubmitToShowroom } = useFeatureFlag(
      ConfigCatFlags.SUBMIT_TO_SHOWROOM,
      true
    );

    const currentCarMake = useSelector(
      (state: RootState) => state.carMakeReducer.current
    );
    const currentScheme = useSelector(
      (state: RootState) => state.schemeReducer.current
    );
    // const viewMode = useSelector(
    //   (state: RootState) => state.boardReducer.viewMode
    // );
    const cars = useSelector((state: RootState) => state.carReducer.cars);
    const primaryRaceNumber = useMemo(() => {
      if (!cars) return -1;
      if (cars[0] && cars[0].primary) return 0;
      if (cars[1] && cars[1].primary) return 1;
      return -1;
    }, [cars]);

    const showSowroomTab = useMemo(() => enableSubmitToShowroom && editable, [
      enableSubmitToShowroom,
      editable,
    ]);

    const handleCloseDialog = useCallback(() => {
      setDialog(undefined);
      focusBoardQuickly();
    }, []);

    const handleApplyRace = useCallback(
      async (values = null) => {
        if (!values && primaryRaceNumber === -1) {
          console.error("Cannot Apply Race options!");
          return;
        }
        if (!currentScheme) return;

        setApplyingRace(true);
        const dataURL = await retrieveTGAPNGDataUrl();
        if (!dataURL) return;

        const blob = dataURItoBlob(dataURL);
        const fileOfBlob = new File([blob], `${currentScheme?.id}.png`, {
          type: "image/png",
        });

        const formData = new FormData();
        formData.append("car_tga", fileOfBlob);
        formData.append("builder_id", currentScheme?.id.toString() ?? "");

        let isCustomNumber = 0;
        if (values) {
          formData.append("night", values.night);
          formData.append("primary", values.primary);
          formData.append("num", values.num);
          formData.append("number", values.number);
          formData.append("series", values.series);
          formData.append("team", values.team);
          isCustomNumber = values.number;
        } else {
          formData.append(
            "primary",
            cars[primaryRaceNumber].primary.toString()
          );
          formData.append(
            "night",
            (cars[primaryRaceNumber].primary
              ? false
              : cars[primaryRaceNumber].night
            ).toString()
          );

          formData.append("num", cars[primaryRaceNumber].num);
          formData.append("number", primaryRaceNumber.toString());
          const carSeries = cars[primaryRaceNumber].leagues
            .filter((item) => item.racing)
            .map((item) => item.series_id);

          formData.append(
            "series",
            new Blob([JSON.stringify(carSeries)], {
              type: "application/json",
            })
          );
          const carTeams = cars[primaryRaceNumber].teams
            .filter((item) => item.racing)
            .map((item) => item.team_id);

          formData.append(
            "team",
            new Blob([JSON.stringify(carTeams)], {
              type: "application/json",
            })
          );
          isCustomNumber = primaryRaceNumber;
        }

        dispatch(
          updateScheme(
            {
              ...currentScheme,
              last_number: isCustomNumber,
            },
            false,
            false
          )
        );

        dispatch(
          setCarRace(
            formData,
            () => {
              dispatch(
                getCarRaces(
                  currentScheme.id,
                  () => {
                    setApplyingRace(false);
                    handleCloseDialog();
                    dispatch(
                      setMessage({
                        type: "success",
                        message: "Raced car successfully!",
                      })
                    );
                  },
                  () => {
                    setApplyingRace(false);
                  }
                )
              );
            },
            () => {
              setApplyingRace(false);
            }
          )
        );
        focusBoardQuickly();
      },
      [
        primaryRaceNumber,
        retrieveTGAPNGDataUrl,
        currentScheme,
        dispatch,
        cars,
        handleCloseDialog,
      ]
    );

    const handleConfirmRace = useCallback(
      (dismiss) => {
        if (dismiss) {
          dispatch(
            updateScheme(
              {
                ...currentScheme,
                dismiss_race_confirm: dismiss,
              },
              false,
              false
            )
          );
        }
        handleCloseDialog();
        handleApplyRace();
        focusBoardQuickly();
      },
      [handleApplyRace, handleCloseDialog, dispatch, currentScheme]
    );

    const handleTGAOptionsClose = () => {
      setTGAAnchorEl(undefined);
      focusBoardQuickly();
    };

    const handleDownloadCustomNumberTGA = () => {
      onDownloadTGA(true);
      handleTGAOptionsClose();
    };

    const handleDownloadSimStampedTGA = () => {
      onDownloadTGA();
      handleTGAOptionsClose();
    };

    // const handleToggleSpecView = () => {
    //   if (viewMode === ViewModes.NORMAL_VIEW) {
    //     dispatch(setViewMode(ViewModes.SPEC_VIEW));
    //   } else {
    //     dispatch(setViewMode(ViewModes.NORMAL_VIEW));
    //   }
    // };

    const handleDownloadSpecMapTGA = () => {
      onDownloadSpecTGA();
      handleTGAOptionsClose();
    };

    const handleShareOptionsClose = () => {
      setShareAnchorEl(undefined);
      focusBoardQuickly();
    };

    const handleRaceOptionsClose = () => {
      setRaceAnchorEl(undefined);
      focusBoardQuickly();
    };

    const handleOpenRaceDialog = () => {
      setDialog(DialogTypes.RACE);
      handleRaceOptionsClose();
    };

    const onRaceUpdate = useCallback(() => {
      if (currentScheme?.dismiss_race_confirm) {
        handleApplyRace();
      } else {
        setDialog(DialogTypes.RACE_CONFIRM);
      }
      focusBoardQuickly();
    }, [currentScheme, handleApplyRace]);

    const handleOpenShareDialog = () => {
      handleShareOptionsClose();
      setSharingTab(0);
      setDialog(DialogTypes.SHARING);
    };

    const handleSubmitToShowroom = useCallback(async () => {
      handleShareOptionsClose();
      setSharingTab(1);
      setDialog(DialogTypes.SHARING);
    }, []);

    if (!currentScheme) return <></>;

    return (
      <>
        <AppHeader isBoard onBack={onBack}>
          {!isAboveMobile ? (
            <IconButton
              size={isAboveMobile ? "medium" : "small"}
              onClick={() => onBack()}
            >
              <CustomIcon icon={faChevronLeft} size="xs" />
            </IconButton>
          ) : (
            <></>
          )}
          {!isAboveMobile ? (
            <IconButton
              size={isAboveMobile ? "medium" : "small"}
              onClick={() => setDialog(DialogTypes.SETTINGS)}
            >
              <SettingsIcon />
            </IconButton>
          ) : (
            <></>
          )}
          {/* <Button onClick={handleToggleSpecView}>Toggle Spec</Button> */}
          <Box
            mr={isAboveMobile ? 4 : 0}
            height="100%"
            display="flex"
            alignItems="center"
          >
            {isAboveMobile ? (
              <DropDownButton
                aria-controls="share-options-menu"
                aria-haspopup="true"
                startIcon={<ShareIcon />}
                endIcon={showSowroomTab ? <DropDownIcon /> : undefined}
                onClick={(event) =>
                  showSowroomTab
                    ? setShareAnchorEl(event.currentTarget)
                    : handleOpenShareDialog()
                }
              >
                <Typography variant="subtitle2">Share</Typography>
              </DropDownButton>
            ) : (
              <IconButton
                aria-controls="share-options-menu"
                aria-haspopup="true"
                size="small"
                onClick={(event) =>
                  showSowroomTab
                    ? setShareAnchorEl(event.currentTarget)
                    : handleOpenShareDialog()
                }
              >
                <ShareIcon />
              </IconButton>
            )}
          </Box>

          {isAboveMobile ? (
            <Box
              mr={isAboveMobile ? 4 : 0}
              height="100%"
              display="flex"
              alignItems="center"
            >
              {isAboveMobile ? (
                <DropDownButton
                  aria-controls="tga-options-menu"
                  aria-haspopup="true"
                  onClick={(event) => setTGAAnchorEl(event.currentTarget)}
                  startIcon={<FaDownload />}
                  endIcon={<DropDownIcon />}
                >
                  <Typography variant="subtitle2">Download</Typography>
                </DropDownButton>
              ) : (
                <IconButton
                  aria-controls="tga-options-menu"
                  aria-haspopup="true"
                  size="small"
                  onClick={(event) => setTGAAnchorEl(event.currentTarget)}
                >
                  <FaDownload />
                </IconButton>
              )}
            </Box>
          ) : (
            <></>
          )}

          {enabledRaceFunctionality ? (
            <>
              {primaryRaceNumber > -1 ? (
                <CustomButtonGroup variant="outlined">
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    disabled={Boolean(
                      currentScheme.race_updated || applyingRace
                    )}
                    startIcon={
                      <img src={RaceIcon} width={25} height={25} alt="Race" />
                    }
                    onClick={onRaceUpdate}
                  >
                    {applyingRace ? (
                      <CircularProgress size={20} />
                    ) : (
                      <Typography variant="subtitle2">Update</Typography>
                    )}
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    aria-controls="race-options-menu"
                    aria-haspopup="true"
                    size="small"
                    onClick={(event) => setRaceAnchorEl(event.currentTarget)}
                  >
                    <DropDownIcon />
                  </Button>
                </CustomButtonGroup>
              ) : (
                <>
                  {isAboveMobile ? (
                    <Button
                      variant="outlined"
                      size="small"
                      style={{
                        marginRight: isAboveMobile ? "16px" : 0,
                        paddingRight: "16px",
                      }}
                      startIcon={
                        <img src={RaceIcon} width={22} height={22} alt="Race" />
                      }
                      onClick={() => setDialog(DialogTypes.RACE)}
                    >
                      <Typography variant="subtitle2">Race</Typography>
                    </Button>
                  ) : (
                    <IconButton
                      size="small"
                      style={{
                        marginRight: isAboveMobile ? "16px" : 0,
                      }}
                      onClick={() => setDialog(DialogTypes.RACE)}
                    >
                      <img src={RaceIcon} width={28} height={28} alt="Race" />
                    </IconButton>
                  )}
                </>
              )}
            </>
          ) : (
            <></>
          )}

          <Popover
            open={Boolean(shareAnchorEl)}
            anchorEl={shareAnchorEl}
            onClose={handleShareOptionsClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <Box display="flex" flexDirection="column" py={1}>
              <Button onClick={handleOpenShareDialog}>
                <Typography variant="subtitle2">Share</Typography>
              </Button>
              <Button onClick={handleSubmitToShowroom}>
                <Typography variant="subtitle2">Submit to Showroom</Typography>
              </Button>
            </Box>
          </Popover>

          <Popover
            open={Boolean(raceAnchorEl)}
            anchorEl={raceAnchorEl}
            onClose={handleRaceOptionsClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <Box py={1}>
              <Button
                startIcon={
                  <img src={RaceIcon} width={25} height={25} alt="Race" />
                }
                onClick={handleOpenRaceDialog}
              >
                <Typography variant="subtitle2">Open Race Settings</Typography>
              </Button>
            </Box>
          </Popover>
          <Popover
            open={Boolean(tgaAnchorEl)}
            anchorEl={tgaAnchorEl}
            onClose={handleTGAOptionsClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <Box display="flex" flexDirection="column" py={1}>
              <Button onClick={handleDownloadSimStampedTGA}>
                <Typography variant="subtitle2">
                  Sim-Stamped Number TGA
                </Typography>
              </Button>
              <Button onClick={handleDownloadCustomNumberTGA}>
                <Typography variant="subtitle2">Custom Number TGA</Typography>
              </Button>
              {!currentScheme.hide_spec &&
              currentCarMake?.car_type !== "Misc" ? (
                <Button onClick={handleDownloadSpecMapTGA}>
                  <Typography variant="subtitle2">Spec Map TGA</Typography>
                </Button>
              ) : (
                <></>
              )}
            </Box>
          </Popover>
        </AppHeader>

        <RaceDialog
          open={dialog === DialogTypes.RACE}
          applying={applyingRace}
          onCancel={handleCloseDialog}
          onApply={handleApplyRace}
        />
        <RaceConfirmDialog
          open={dialog === DialogTypes.RACE_CONFIRM}
          onCancel={handleCloseDialog}
          onConfirm={handleConfirmRace}
        />
        <SharingDialog
          editable={editable}
          open={dialog === DialogTypes.SHARING}
          tab={sharingTab}
          retrieveTGAPNGDataUrl={retrieveTGAPNGDataUrl}
          onCancel={handleCloseDialog}
        />
        <SchemeSettingsDialog
          editable={editable}
          open={dialog === DialogTypes.SETTINGS}
          onCancel={handleCloseDialog}
        />
      </>
    );
  }
);

export default Header;

import React, { useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DialogTypes } from "constant";

import {
  Typography,
  Box,
  Button,
  Popover,
  useMediaQuery,
  IconButton,
} from "components/MaterialUI";
import {
  DropDownIcon,
  ShareIcon,
  DropDownButton,
  CustomButtonGroup,
} from "./Header.style";
import { AppHeader } from "components/common";
import RaceIcon from "assets/race.svg";
import { FaDownload } from "react-icons/fa";

import RaceDialog from "components/dialogs/RaceDialog/RaceDialog";
import { getCarRaces, setCarRace } from "redux/reducers/carReducer";
import { dataURItoBlob, focusBoardQuickly } from "helper";
import { CircularProgress } from "components/MaterialUI";
import { setMessage } from "redux/reducers/messageReducer";
import RaceConfirmDialog from "components/dialogs/RaceConfirmDialog";
import { updateScheme } from "redux/reducers/schemeReducer";
import { SharingDialog } from "components/dialogs";
import { TitleBar } from "../SideBar/components";

export const Header = React.memo((props) => {
  const {
    editable,
    onBack,
    onDownloadTGA,
    onDownloadSpecTGA,
    retrieveTGAPNGDataUrl,
  } = props;
  const [tgaAnchorEl, setTGAAnchorEl] = useState(null);
  const [raceAnchorEl, setRaceAnchorEl] = useState(null);
  const [shareAnchorEl, setShareAnchorEl] = useState(null);
  const [dialog, setDialog] = useState(null);
  const [applyingRace, setApplyingRace] = useState(false);
  const [sharingTab, setSharingTab] = useState(0);

  const dispatch = useDispatch();
  const overMobile = useMediaQuery((theme) => theme.breakpoints.up("sm"));

  const currentCarMake = useSelector((state) => state.carMakeReducer.current);
  const currentScheme = useSelector((state) => state.schemeReducer.current);
  const cars = useSelector((state) => state.carReducer.cars);
  const primaryRaceNumber = useMemo(() => {
    if (!cars) return -1;
    if (cars[0] && cars[0].primary) return 0;
    if (cars[1] && cars[1].primary) return 1;
    return -1;
  }, [cars]);

  const handleCloseDialog = useCallback(() => {
    setDialog(null);
    focusBoardQuickly();
  }, []);

  const handleApplyRace = useCallback(
    async (values = null) => {
      if (!values && primaryRaceNumber === -1) {
        console.error("Cannot Apply Race options!");
        return;
      }
      setApplyingRace(true);
      const dataURL = await retrieveTGAPNGDataUrl();
      let blob = dataURItoBlob(dataURL);
      var fileOfBlob = new File([blob], `${currentScheme.id}.png`, {
        type: "image/png",
      });

      let formData = new FormData();
      formData.append("car_tga", fileOfBlob);
      formData.append("builder_id", currentScheme.id);

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
        formData.append("primary", cars[primaryRaceNumber].primary);
        formData.append(
          "night",
          cars[primaryRaceNumber].primary
            ? false
            : cars[primaryRaceNumber].night
        );

        formData.append("num", cars[primaryRaceNumber].num);
        formData.append("number", primaryRaceNumber);
        formData.append(
          "series",
          cars[primaryRaceNumber].leagues
            .filter((item) => item.racing)
            .map((item) => item.series_id)
        );
        formData.append(
          "team",
          cars[primaryRaceNumber].teams
            .filter((item) => item.racing)
            .map((item) => item.team_id)
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

  const handleOpenTGAOptions = (event) => {
    setTGAAnchorEl(event.currentTarget);
  };

  const handleTGAOptionsClose = () => {
    setTGAAnchorEl(null);
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

  const handleDownloadSpecMapTGA = () => {
    onDownloadSpecTGA();
    handleTGAOptionsClose();
  };

  const handleOpenShareOptions = (event) => {
    setShareAnchorEl(event.currentTarget);
  };

  const handleShareOptionsClose = () => {
    setShareAnchorEl(null);
    focusBoardQuickly();
  };

  const handleOpenRaceOptions = (event) => {
    setRaceAnchorEl(event.currentTarget);
  };

  const handleRaceOptionsClose = () => {
    setRaceAnchorEl(null);
    focusBoardQuickly();
  };

  const handleOpenRaceDialog = () => {
    setDialog(DialogTypes.RACE);
    handleRaceOptionsClose();
  };

  const onRaceUpdate = useCallback(() => {
    if (currentScheme.dismiss_race_confirm) {
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

  return (
    <>
      <AppHeader isBoard>
        {!overMobile ? <TitleBar editable={editable} onBack={onBack} /> : <></>}
        <Box mr={4} height="100%" display="flex" alignItems="center">
          {overMobile ? (
            <DropDownButton
              aria-controls="share-options-menu"
              aria-haspopup="true"
              startIcon={<ShareIcon />}
              endIcon={<DropDownIcon />}
              onClick={handleOpenShareOptions}
            >
              <Typography variant="subtitle2">Share</Typography>
            </DropDownButton>
          ) : (
            <IconButton
              aria-controls="share-options-menu"
              aria-haspopup="true"
              size="small"
              onClick={handleOpenShareOptions}
            >
              <ShareIcon />
            </IconButton>
          )}
        </Box>

        <Box mr={4} height="100%" display="flex" alignItems="center">
          {overMobile ? (
            <DropDownButton
              aria-controls="tga-options-menu"
              aria-haspopup="true"
              onClick={handleOpenTGAOptions}
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
              onClick={handleOpenTGAOptions}
            >
              <FaDownload />
            </IconButton>
          )}
        </Box>

        {primaryRaceNumber > -1 ? (
          <CustomButtonGroup variant="outlined">
            <Button
              variant="outlined"
              color="primary"
              size="small"
              disabled={currentScheme.race_updated || applyingRace}
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
              onClick={handleOpenRaceOptions}
            >
              <DropDownIcon />
            </Button>
          </CustomButtonGroup>
        ) : (
          <>
            {overMobile ? (
              <Button
                variant="outlined"
                mr={4}
                pr="16px"
                size="small"
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
                mr={4}
                onClick={() => setDialog(DialogTypes.RACE)}
              >
                <img src={RaceIcon} width={28} height={28} alt="Race" />
              </IconButton>
            )}
          </>
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
            {!currentScheme.hide_spec && currentCarMake.car_type !== "Misc" ? (
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
    </>
  );
});

export default Header;

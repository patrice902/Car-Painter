import { faRedo, faUndo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Slider,
  Theme,
  Typography,
  useMediaQuery,
} from "@material-ui/core";
import { Rotate90DegreesCcw, Search as SearchIcon } from "@material-ui/icons";
import { useFeatureFlag } from "configcat-react";
import { Stage } from "konva/types/Stage";
import React, { RefObject, useCallback, useEffect, useState } from "react";
import { ChevronsLeft, ChevronsRight } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import ShortcutIcon from "src/assets/keyboard-shortcuts.svg";
import { LightTooltip } from "src/components/common";
import {
  ShortCutsDialog,
  SimPreviewGuideDialog,
  ZoomPopover,
} from "src/components/dialogs";
import { focusBoardQuickly, isWindows } from "src/helper";
import { useZoom } from "src/hooks";
import { RootState } from "src/redux";
import {
  historyActionBack,
  historyActionUp,
  setShowLayers,
  setShowProperties,
  setSpecTGADataURL,
  setZoom,
  // setViewMode,
} from "src/redux/reducers/boardReducer";
import {
  setAskingSimPreviewByLatest,
  submitSimPreview,
} from "src/redux/reducers/downloaderReducer";
import { updateScheme } from "src/redux/reducers/schemeReducer";
import { ConfigCatFlags, DialogTypes } from "src/types/enum";

import { Wrapper, ZoomButton } from "./Toolbar.style";

type ToolbarProps = {
  stageRef: RefObject<Stage | undefined>;
  retrieveTGAPNGDataUrl: () => Promise<string | null | undefined>;
  requestSpecTGAPNGDataUrl: () => Promise<void>;
  onChangeBoardRotation: (rotation: number) => void;
};

export const Toolbar = React.memo(
  ({
    stageRef,
    retrieveTGAPNGDataUrl,
    requestSpecTGAPNGDataUrl,
    onChangeBoardRotation,
  }: ToolbarProps) => {
    const { zoom, onZoomIn, onZoomOut, onZoomFit } = useZoom(stageRef);
    const isAboveTablet = useMediaQuery((theme: Theme) =>
      theme.breakpoints.up("md")
    );
    const { value: enableSimPreview } = useFeatureFlag(
      ConfigCatFlags.SIM_PREVIEW,
      true
    );

    const [anchorEl, setAnchorEl] = useState(null);
    const [dialog, setDialog] = useState<DialogTypes | null>(null);
    const [isCustom, setIsCustom] = useState(0);
    const [tgaPNGDataUrl, setTgaPNGDataUrl] = useState<string>();

    const dispatch = useDispatch();
    const actionHistoryIndex = useSelector(
      (state: RootState) => state.boardReducer.actionHistoryIndex
    );
    const actionHistoryMoving = useSelector(
      (state: RootState) => state.boardReducer.actionHistoryMoving
    );
    const specTGADataURL = useSelector(
      (state: RootState) => state.boardReducer.specTGADataURL
    );
    const actionHistory = useSelector(
      (state: RootState) => state.boardReducer.actionHistory
    );
    const currentScheme = useSelector(
      (state: RootState) => state.schemeReducer.current
    );
    const currentCarMake = useSelector(
      (state: RootState) => state.carMakeReducer.current
    );
    const showLayers = useSelector(
      (state: RootState) => state.boardReducer.showLayers
    );
    const boardRotate = useSelector(
      (state: RootState) => state.boardReducer.boardRotate
    );
    const showProperties = useSelector(
      (state: RootState) => state.boardReducer.showProperties
    );
    // const viewMode = useSelector((state: RootState) => state.boardReducer.viewMode);

    const downloaderRunning = useSelector(
      (state: RootState) => state.downloaderReducer.iracing
    );
    const simPreviewing = useSelector(
      (state: RootState) => state.downloaderReducer.simPreviewing
    );
    const askingSimPreviewByLatest = useSelector(
      (state: RootState) => state.downloaderReducer.askingSimPreviewByLatest
    );

    const handleCloseDialog = useCallback(() => {
      setDialog(null);
      focusBoardQuickly();
    }, []);

    const applySubmitSimPreview = useCallback(
      async (isCustomNumber = 0) => {
        if (!currentScheme || !currentCarMake) return;

        setIsCustom(isCustomNumber);
        const formData = new FormData();

        const dataURL = await retrieveTGAPNGDataUrl();
        if (!dataURL) return;

        setTgaPNGDataUrl(dataURL);
        formData.append("car_file", dataURL);

        if (!currentScheme.hide_spec && currentCarMake.car_type !== "Misc") {
          requestSpecTGAPNGDataUrl();
        } else {
          dispatch(
            submitSimPreview(currentScheme.id, isCustomNumber, formData)
          );
        }
      },
      [
        retrieveTGAPNGDataUrl,
        currentScheme,
        currentCarMake,
        dispatch,
        requestSpecTGAPNGDataUrl,
      ]
    );

    const handleApplySpecTGAToSimPreview = useCallback(() => {
      if (tgaPNGDataUrl && specTGADataURL && currentScheme) {
        const formData = new FormData();

        formData.append("car_file", tgaPNGDataUrl);
        formData.append("spec_file", specTGADataURL);
        dispatch(submitSimPreview(currentScheme.id, isCustom, formData));
        dispatch(setSpecTGADataURL(null));
      }
    }, [currentScheme, dispatch, isCustom, tgaPNGDataUrl, specTGADataURL]);

    useEffect(() => {
      if (specTGADataURL) {
        handleApplySpecTGAToSimPreview();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [specTGADataURL]);

    const handleSubmitSimPreview = useCallback(
      async (isCustomNumber = 0) => {
        handleCloseDialog();
        await applySubmitSimPreview(isCustomNumber);
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
        focusBoardQuickly();
      },
      [handleCloseDialog, applySubmitSimPreview, dispatch, currentScheme]
    );

    // const handleToggleViewMode = useCallback(() => {
    //   dispatch(
    //     setViewMode(
    //       viewMode === ViewModes.NORMAL_VIEW
    //         ? ViewModes.SPEC_VIEW
    //         : ViewModes.NORMAL_VIEW
    //     )
    //   );
    // }, [dispatch, viewMode]);

    const handleUndoRedo = useCallback(
      (isUndo = true) => {
        if (isUndo) {
          dispatch(historyActionBack());
        } else {
          dispatch(historyActionUp());
        }
        focusBoardQuickly();
      },
      [dispatch]
    );

    const handleChangeBoardRotation = useCallback(
      (isRight = true) => {
        let newBoardRotate;
        if (isRight) {
          newBoardRotate = boardRotate + 90;
          if (newBoardRotate >= 360) newBoardRotate = 0;
        } else {
          newBoardRotate = boardRotate - 90;
          if (newBoardRotate < 0) newBoardRotate = 270;
        }
        onChangeBoardRotation(newBoardRotate);
        focusBoardQuickly();
      },
      [boardRotate, onChangeBoardRotation]
    );

    const handleZoomPoperOpen = useCallback(
      (event) => {
        setAnchorEl(event.currentTarget);
      },
      [setAnchorEl]
    );

    const handleCloseZoomPoper = useCallback(() => {
      setAnchorEl(null);
      focusBoardQuickly();
    }, [setAnchorEl]);

    const handleZoom = useCallback(
      (value) => {
        dispatch(setZoom(value));
        focusBoardQuickly();
      },
      [dispatch]
    );

    const handleZoomToFit = () => {
      onZoomFit();
      focusBoardQuickly();
    };

    const handleToggleLayers = useCallback(() => {
      dispatch(setShowLayers(!showLayers));
      focusBoardQuickly();
    }, [dispatch, showLayers]);

    const handleToggleProperties = useCallback(() => {
      dispatch(setShowProperties(!showProperties));
      focusBoardQuickly();
    }, [dispatch, showProperties]);

    const handleClickSimPreview = useCallback(() => {
      setDialog(DialogTypes.SIM_PREVIEW_GUIDE);
    }, []);

    useEffect(() => {
      if (askingSimPreviewByLatest && currentScheme) {
        applySubmitSimPreview(currentScheme.last_number);
        dispatch(setAskingSimPreviewByLatest(false));
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [askingSimPreviewByLatest]);

    useEffect(() => {
      if (!isAboveTablet) {
        dispatch(setShowLayers(false));
      } else {
        dispatch(setShowLayers(true));
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAboveTablet]);

    return (
      <Wrapper>
        <Box
          display="flex"
          justifyContent="space-between"
          alignContent="center"
          width="100%"
          position="relative"
        >
          <Box display="flex" alignContent="center" flex={1}>
            <LightTooltip title="Toggle Layers" arrow>
              <IconButton onClick={handleToggleLayers}>
                {showLayers ? <ChevronsLeft /> : <ChevronsRight />}
              </IconButton>
            </LightTooltip>
            <LightTooltip title="Shortcuts" arrow>
              <IconButton onClick={() => setDialog(DialogTypes.SHORTCUTS)}>
                <img src={ShortcutIcon} width="20px" alt="shortcuts" />
              </IconButton>
            </LightTooltip>
          </Box>

          <Box
            display="flex"
            justifyContent="center"
            alignContent="center"
            flex={2}
          >
            {/* <Button variant="outlined" onClick={handleToggleViewMode} mx={1}>
            Toggle View Mode
          </Button> */}

            <LightTooltip title="Rotate View" arrow>
              <IconButton
                style={{
                  paddingLeft: "4px",
                  paddingRight: "4px",
                }}
                onClick={() => handleChangeBoardRotation(false)}
              >
                <Rotate90DegreesCcw />
              </IconButton>
            </LightTooltip>

            {enableSimPreview && isAboveTablet ? (
              <Box ml={2} mr={2} height="100%" display="flex">
                <LightTooltip
                  title={
                    downloaderRunning
                      ? "Open Sim Preview Dialog (Or just run quick Sim Preview Action by HotKey: P)"
                      : downloaderRunning === false
                      ? "Trading Paints Downloader is running but you are not in a iRacing session"
                      : "Trading Paints Downloader is not detected"
                  }
                  arrow
                >
                  <Button
                    variant="text"
                    disabled={!isWindows() || simPreviewing}
                    onClick={handleClickSimPreview}
                  >
                    {simPreviewing ? (
                      <CircularProgress size={20} />
                    ) : (
                      <Typography variant="subtitle2">Sim Preview</Typography>
                    )}
                  </Button>
                </LightTooltip>
              </Box>
            ) : (
              <></>
            )}

            <Box display="flex" alignItems="center">
              <LightTooltip title="Zoom to fit" arrow>
                <IconButton onClick={handleZoomToFit} size="small">
                  <SearchIcon />
                </IconButton>
              </LightTooltip>
              <Box width="80px" ml={2}>
                <Slider
                  min={0.1}
                  max={5}
                  step={0.1}
                  value={zoom}
                  onChange={(event, value) => handleZoom(value)}
                  aria-labelledby="zoom"
                />
              </Box>
              <ZoomButton variant="text" onClick={handleZoomPoperOpen}>
                <Typography variant="subtitle2">
                  {(zoom * 100).toFixed(2)} %
                </Typography>
              </ZoomButton>
            </Box>
          </Box>
          <Box
            display="flex"
            alignContent="center"
            justifyContent="flex-end"
            flex={1}
          >
            <LightTooltip title="Undo" arrow>
              <Box display="flex" justifyContent="center" width="40px">
                <IconButton
                  disabled={actionHistoryIndex === -1 || actionHistoryMoving}
                  size="small"
                  style={{
                    paddingLeft: "8px",
                    paddingRight: "8px",
                  }}
                  onClick={() => handleUndoRedo(true)}
                >
                  <FontAwesomeIcon icon={faUndo} size="sm" />
                </IconButton>
              </Box>
            </LightTooltip>

            <LightTooltip title="Redo" arrow>
              <Box display="flex" justifyContent="center" width="40px">
                <IconButton
                  disabled={
                    actionHistoryIndex === actionHistory.length - 1 ||
                    actionHistoryMoving
                  }
                  size="small"
                  style={{
                    paddingLeft: "8px",
                    paddingRight: "8px",
                  }}
                  onClick={() => handleUndoRedo(false)}
                >
                  <FontAwesomeIcon icon={faRedo} size="sm" />
                </IconButton>
              </Box>
            </LightTooltip>
            <LightTooltip title="Toggle Properties" arrow>
              <IconButton onClick={handleToggleProperties}>
                {showProperties ? <ChevronsRight /> : <ChevronsLeft />}
              </IconButton>
            </LightTooltip>
          </Box>
        </Box>
        <ZoomPopover
          anchorEl={anchorEl}
          zoom={zoom}
          setZoom={handleZoom}
          onZoomIn={onZoomIn}
          onZoomOut={onZoomOut}
          onZoomFit={onZoomFit}
          onClose={handleCloseZoomPoper}
        />
        <ShortCutsDialog
          open={dialog === DialogTypes.SHORTCUTS}
          onCancel={handleCloseDialog}
        />
        <SimPreviewGuideDialog
          open={dialog === DialogTypes.SIM_PREVIEW_GUIDE}
          applying={simPreviewing}
          onApply={handleSubmitSimPreview}
          onCancel={handleCloseDialog}
        />
      </Wrapper>
    );
  }
);

export default Toolbar;

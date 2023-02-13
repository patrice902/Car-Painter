import { faRedo, faUndo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Layers as LayersIcon,
  Rotate90DegreesCcw,
  SettingsInputSvideo as SettingsInputSvideoIcon,
  Tune as TuneIcon,
} from "@material-ui/icons";
import { DefaultSettingsButton } from "components/common";
import {
  DefaultSettingsDialog,
  ShortCutsDialog,
  SimPreviewGuideDialog,
  ZoomPopover,
} from "components/dialogs";
import { Box, IconButton } from "components/MaterialUI";
import { DialogTypes } from "constant";
import { focusBoardQuickly } from "helper";
import { useZoom } from "hooks";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  historyActionBack,
  historyActionUp,
  setShowLayers,
  setShowProperties,
  setSpecTGADataURL,
  setZoom,
  // setViewMode,
} from "redux/reducers/boardReducer";
import {
  setAskingSimPreviewByLatest,
  submitSimPreview,
} from "redux/reducers/downloaderReducer";
import { updateLayer } from "redux/reducers/layerReducer";
import { updateScheme } from "redux/reducers/schemeReducer";

import { Wrapper } from "./Toolbar.style";

export const MobileToolbar = React.memo((props) => {
  const {
    stageRef,
    editable,
    retrieveTGAPNGDataUrl,
    requestSpecTGAPNGDataUrl,
    onChangeBoardRotation,
  } = props;
  const { zoom, onZoomIn, onZoomOut, onZoomFit } = useZoom(stageRef);

  const [anchorEl, setAnchorEl] = useState(null);
  const [dialog, setDialog] = useState(null);
  const [isCustom, setIsCustom] = useState(0);
  const [tgaPNGDataUrl, setTgaPNGDataUrl] = useState(null);

  const dispatch = useDispatch();
  const actionHistoryIndex = useSelector(
    (state) => state.boardReducer.actionHistoryIndex
  );
  const actionHistoryMoving = useSelector(
    (state) => state.boardReducer.actionHistoryMoving
  );
  const specTGADataURL = useSelector(
    (state) => state.boardReducer.specTGADataURL
  );
  const actionHistory = useSelector(
    (state) => state.boardReducer.actionHistory
  );
  const currentScheme = useSelector((state) => state.schemeReducer.current);
  const currentCarMake = useSelector((state) => state.carMakeReducer.current);
  const showLayers = useSelector((state) => state.boardReducer.showLayers);
  const boardRotate = useSelector((state) => state.boardReducer.boardRotate);
  const showProperties = useSelector(
    (state) => state.boardReducer.showProperties
  );
  const currentLayer = useSelector((state) => state.layerReducer.current);

  const simPreviewing = useSelector(
    (state) => state.downloaderReducer.simPreviewing
  );
  const askingSimPreviewByLatest = useSelector(
    (state) => state.downloaderReducer.askingSimPreviewByLatest
  );

  const handleCloseDialog = useCallback(() => {
    setDialog(null);
    focusBoardQuickly();
  }, []);

  const applySubmitSimPreview = useCallback(
    async (isCustomNumber = 0) => {
      setIsCustom(isCustomNumber);
      let formData = new FormData();

      const dataURL = await retrieveTGAPNGDataUrl();
      setTgaPNGDataUrl(dataURL);
      formData.append("car_file", dataURL);

      if (!currentScheme.hide_spec && currentCarMake.car_type !== "Misc") {
        requestSpecTGAPNGDataUrl();
      } else {
        dispatch(submitSimPreview(currentScheme.id, isCustomNumber, formData));
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
    if (tgaPNGDataUrl && specTGADataURL) {
      let formData = new FormData();

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

  const handleToggleLayers = useCallback(() => {
    dispatch(setShowLayers(!showLayers));
    focusBoardQuickly();
  }, [dispatch, showLayers]);

  const handleToggleProperties = useCallback(() => {
    dispatch(setShowProperties(!showProperties));
    focusBoardQuickly();
  }, [dispatch, showProperties]);

  const handleApplySettings = useCallback(
    (guide_data) => {
      if (currentLayer) {
        dispatch(
          updateLayer({
            id: currentLayer.id,
            layer_data: {
              ...currentLayer.layer_data,
              color: guide_data.default_shape_color,
              opacity: guide_data.default_shape_opacity,
              scolor: guide_data.default_shape_scolor,
              stroke: guide_data.default_shape_stroke,
            },
          })
        );
      } else {
        dispatch(
          updateScheme({
            ...currentScheme,
            guide_data: {
              ...currentScheme.guide_data,
              ...guide_data,
            },
          })
        );
      }
      setDialog(null);
      focusBoardQuickly();
    },
    [dispatch, currentScheme, currentLayer, setDialog]
  );

  useEffect(() => {
    if (askingSimPreviewByLatest) {
      applySubmitSimPreview(currentScheme.last_number);
      dispatch(setAskingSimPreviewByLatest(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [askingSimPreviewByLatest]);

  return (
    <Wrapper>
      <Box
        display="flex"
        justifyContent="space-around"
        alignContent="center"
        width="100%"
        position="relative"
      >
        <IconButton onClick={handleToggleProperties}>
          {currentLayer ? <SettingsInputSvideoIcon /> : <TuneIcon />}
        </IconButton>
        <IconButton onClick={handleToggleLayers}>
          <LayersIcon />
        </IconButton>
        <IconButton px={1} onClick={() => handleChangeBoardRotation(false)}>
          <Rotate90DegreesCcw />
        </IconButton>
        <Box display="flex" justifyContent="center" width="40px">
          <IconButton
            disabled={actionHistoryIndex === -1 || actionHistoryMoving}
            size="small"
            px={2}
            onClick={() => handleUndoRedo(true)}
          >
            <FontAwesomeIcon icon={faUndo} size="sm" />
          </IconButton>
        </Box>
        <Box display="flex" justifyContent="center" width="40px">
          <IconButton
            disabled={
              actionHistoryIndex === actionHistory.length - 1 ||
              actionHistoryMoving
            }
            size="small"
            px={2}
            onClick={() => handleUndoRedo(false)}
          >
            <FontAwesomeIcon icon={faRedo} size="sm" />
          </IconButton>
        </Box>
        <DefaultSettingsButton
          onClick={() =>
            editable ? setDialog(DialogTypes.DEFAULT_SHAPE_SETTINGS) : null
          }
        />
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
      <DefaultSettingsDialog
        open={dialog === DialogTypes.DEFAULT_SHAPE_SETTINGS}
        onApply={handleApplySettings}
        onCancel={handleCloseDialog}
      />
    </Wrapper>
  );
});

export default MobileToolbar;

import { faRedo, faUndo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, IconButton } from "@material-ui/core";
import {
  Layers as LayersIcon,
  Rotate90DegreesCcw,
  SettingsInputSvideo as SettingsInputSvideoIcon,
  Tune as TuneIcon,
} from "@material-ui/icons";
import { Stage } from "konva/types/Stage";
import React, { RefObject, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DefaultSettingsButton } from "src/components/common";
import {
  DefaultSettingsDialog,
  ShortCutsDialog,
  SimPreviewGuideDialog,
  ZoomPopover,
} from "src/components/dialogs";
import { focusBoardQuickly } from "src/helper";
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
import { updateLayer } from "src/redux/reducers/layerReducer";
import { updateScheme } from "src/redux/reducers/schemeReducer";
import { DefaultLayerData } from "src/types/common";
import { DialogTypes } from "src/types/enum";

import { Wrapper } from "./Toolbar.style";

type MobileToolbarProps = {
  stageRef: RefObject<Stage | undefined>;
  editable: boolean;
  retrieveTGAPNGDataUrl: () => Promise<string | null | undefined>;
  requestSpecTGAPNGDataUrl: () => Promise<void>;
  onChangeBoardRotation: (rotation: number) => void;
};

export const MobileToolbar = React.memo(
  ({
    stageRef,
    editable,
    retrieveTGAPNGDataUrl,
    requestSpecTGAPNGDataUrl,
    onChangeBoardRotation,
  }: MobileToolbarProps) => {
    const { zoom, onZoomIn, onZoomOut, onZoomFit } = useZoom(stageRef);

    const [anchorEl, setAnchorEl] = useState(null);
    const [dialog, setDialog] = useState<DialogTypes | null>(null);
    const [isCustom, setIsCustom] = useState(0);
    const [tgaPNGDataUrl, setTgaPNGDataUrl] = useState<string | null>(null);

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
    const currentLayer = useSelector(
      (state: RootState) => state.layerReducer.current
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
        if (!currentScheme) return;

        setIsCustom(isCustomNumber);
        const dataURL = await retrieveTGAPNGDataUrl();
        if (!dataURL) return;

        const formData = new FormData();
        setTgaPNGDataUrl(dataURL);
        formData.append("car_file", dataURL);

        if (!currentScheme.hide_spec && currentCarMake?.car_type !== "Misc") {
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
        if (!currentScheme) return;

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
              } as DefaultLayerData,
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
      if (askingSimPreviewByLatest && currentScheme) {
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
          <IconButton
            style={{ paddingLeft: "4px", paddingRight: "4px" }}
            onClick={() => handleChangeBoardRotation(false)}
          >
            <Rotate90DegreesCcw />
          </IconButton>
          <Box display="flex" justifyContent="center" width="40px">
            <IconButton
              disabled={actionHistoryIndex === -1 || actionHistoryMoving}
              size="small"
              style={{ paddingLeft: "8px", paddingRight: "8px" }}
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
              style={{ paddingLeft: "8px", paddingRight: "8px" }}
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
  }
);

export default MobileToolbar;

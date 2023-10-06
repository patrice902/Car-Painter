import {
  faDrawPolygon,
  faFolderOpen,
  faFont,
} from "@fortawesome/free-solid-svg-icons";
import { Typography } from "@material-ui/core";
import { Stage } from "konva/types/Stage";
import React, {
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import BasepaintIcon from "src/assets/base-paint.svg";
import GraphicsIcon from "src/assets/insert-graphics.svg";
import LogoIcon from "src/assets/insert-logo.svg";
import { DefaultSettingsButton, LightTooltip } from "src/components/common";
import {
  BasePaintDialog,
  DefaultSettingsDialog,
  LogoDialog,
  OverlayDialog,
  TextDialog,
  UploadDialog,
} from "src/components/dialogs";
import {
  focusBoard,
  focusBoardQuickly,
  getZoomedCenterPosition,
} from "src/helper";
import { RootState } from "src/redux";
import { setMouseMode } from "src/redux/reducers/boardReducer";
import {
  createLayerFromLogo,
  createLayerFromOverlay,
  createLayerFromUpload,
  createLayersFromBasePaint,
  createLayersFromLegacyBasePaint,
  createTextLayer,
  setCurrent as setCurrentLayer,
  setDrawingStatus,
} from "src/redux/reducers/layerReducer";
import { submitDefaultSetting } from "src/redux/reducers/schemeReducer";
import { DialogTypes, DrawingStatus, MouseModes } from "src/types/enum";

import { drawModes } from "../../MobileDrawerBar/MobileDrawerBar";
import {
  CustomDrawingItem,
  CustomFontAwesomeIcon,
  MainItem,
  ShapeItem,
  ShapeWrapper,
  ToolWrapper,
  Wrapper,
} from "./DrawerBar.style";

type DrawerBarProps = {
  dialog?: DialogTypes | null;
  setDialog: (dialog?: DialogTypes | null) => void;
  stageRef: RefObject<Stage | undefined>;
  editable: boolean;
};

export const DrawerBar = React.memo(
  ({ dialog, setDialog, stageRef, editable }: DrawerBarProps) => {
    const dispatch = useDispatch();

    const mouseMode = useSelector(
      (state: RootState) => state.boardReducer.mouseMode
    );
    const currentScheme = useSelector(
      (state: RootState) => state.schemeReducer.current
    );
    const currentCarMake = useSelector(
      (state: RootState) => state.carMakeReducer.current
    );
    const overlayList = useSelector(
      (state: RootState) => state.overlayReducer.list
    );
    const logoList = useSelector((state: RootState) => state.logoReducer.list);
    const uploadList = useSelector(
      (state: RootState) => state.uploadReducer.list
    );
    const fontList = useSelector((state: RootState) => state.fontReducer.list);
    const frameSize = useSelector(
      (state: RootState) => state.boardReducer.frameSize
    );
    const zoom = useSelector((state: RootState) => state.boardReducer.zoom);
    const boardRotate = useSelector(
      (state: RootState) => state.boardReducer.boardRotate
    );
    const basePaints = useSelector(
      (state: RootState) => state.basePaintReducer.list
    );
    const user = useSelector((state: RootState) => state.authReducer.user);
    const [showShapes, setShowShapes] = useState(false);

    const dialog_modes = useMemo(
      () => [
        {
          value: DialogTypes.BASEPAINT,
          label: "Base Paints",
          icon: (
            <img
              src={BasepaintIcon}
              alt="Base Paint"
              height="50px"
              style={{ margin: "-5px" }}
            />
          ),
        },
        {
          value: DialogTypes.SHAPE,
          label: "Add Graphics",
          icon: (
            <img
              src={GraphicsIcon}
              alt="Graphics"
              height="45px"
              style={{ margin: "-4px" }}
            />
          ),
        },
        {
          value: DialogTypes.LOGO,
          label: "Insert Logo",
          icon: <img src={LogoIcon} alt="Logos" height={"40px"} />,
        },
        {
          value: DialogTypes.UPLOAD,
          label: "My Uploads",
          icon: (
            <CustomFontAwesomeIcon
              style={{ height: "30px", width: "30px" }}
              icon={faFolderOpen}
            />
          ),
        },
        {
          value: DialogTypes.TEXT,
          label: "Add Text",
          icon: (
            <CustomFontAwesomeIcon
              style={{ height: "30px", width: "30px" }}
              icon={faFont}
            />
          ),
        },
      ],
      []
    );

    const hideDialog = useCallback(() => {
      setDialog(undefined);
      focusBoardQuickly();
    }, [setDialog]);

    const handleModeChange = useCallback(
      (value) => {
        dispatch(setMouseMode(value));
        if (value !== MouseModes.DEFAULT) {
          dispatch(setCurrentLayer(null));
        }
        focusBoardQuickly();
      },
      [dispatch]
    );

    const handleOpenBase = useCallback(
      (basePaintItemORIndex) => {
        if (!currentScheme) return;

        dispatch(setMouseMode(MouseModes.DEFAULT));

        if (currentScheme.legacy_mode) {
          dispatch(
            createLayersFromLegacyBasePaint(
              currentScheme.id,
              basePaintItemORIndex
            )
          );
        } else {
          dispatch(
            createLayersFromBasePaint(currentScheme.id, basePaintItemORIndex)
          );
        }

        setDialog(undefined);
        focusBoard();
      },
      [dispatch, setDialog, currentScheme]
    );
    const handleOpenOverlay = useCallback(
      (shape) => {
        if (!currentScheme) return;

        dispatch(setMouseMode(MouseModes.DEFAULT));
        dispatch(
          createLayerFromOverlay(
            currentScheme.id,
            shape,
            getZoomedCenterPosition(stageRef, frameSize, zoom, boardRotate)
          )
        );
        setDialog(undefined);
        focusBoard();
      },
      [
        dispatch,
        currentScheme,
        stageRef,
        frameSize,
        zoom,
        boardRotate,
        setDialog,
      ]
    );
    const handleOpenLogo = useCallback(
      (logo) => {
        if (!currentScheme) return;

        dispatch(setMouseMode(MouseModes.DEFAULT));
        dispatch(
          createLayerFromLogo(
            currentScheme.id,
            logo,
            getZoomedCenterPosition(stageRef, frameSize, zoom, boardRotate)
          )
        );
        setDialog(undefined);
        focusBoard();
      },
      [
        dispatch,
        currentScheme,
        stageRef,
        frameSize,
        zoom,
        boardRotate,
        setDialog,
      ]
    );
    const handleOpenUpload = useCallback(
      (upload) => {
        if (!currentScheme) return;

        dispatch(setMouseMode(MouseModes.DEFAULT));
        dispatch(
          createLayerFromUpload(
            currentScheme.id,
            upload,
            getZoomedCenterPosition(stageRef, frameSize, zoom, boardRotate)
          )
        );
        setDialog(undefined);
        focusBoard();
      },
      [
        dispatch,
        setDialog,
        currentScheme,
        stageRef,
        frameSize,
        zoom,
        boardRotate,
      ]
    );
    const handleCreateText = useCallback(
      (values) => {
        if (!currentScheme) return;

        dispatch(setMouseMode(MouseModes.DEFAULT));
        dispatch(
          createTextLayer(
            currentScheme.id,
            values,
            getZoomedCenterPosition(stageRef, frameSize, zoom, boardRotate)
          )
        );
        setDialog(undefined);
        focusBoard();
      },
      [
        dispatch,
        setDialog,
        currentScheme,
        stageRef,
        frameSize,
        zoom,
        boardRotate,
      ]
    );

    const handleApplySettings = useCallback(
      (guide_data) => {
        dispatch(
          submitDefaultSetting(guide_data, () => {
            setDialog(undefined);
            focusBoardQuickly();
          })
        );
      },
      [dispatch, setDialog]
    );

    const handleToggleDrawShapes = useCallback(() => {
      if (showShapes) {
        dispatch(setMouseMode(MouseModes.DEFAULT));
      }
      setShowShapes((flag) => !flag);
    }, [showShapes, dispatch]);

    const handleKeyEventDrawingItem = useCallback(
      (e) => {
        if (e.key === "Escape") {
          dispatch(setMouseMode(MouseModes.DEFAULT));
          dispatch(setDrawingStatus(DrawingStatus.CLEAR_COMMAND));
        }
        focusBoardQuickly();
      },
      [dispatch]
    );

    const handleOpenDialog = useCallback(
      (dialogName) => {
        setDialog(dialogName);
      },
      [setDialog]
    );

    useEffect(() => {
      if (mouseMode !== MouseModes.DEFAULT) {
        setShowShapes(true);
      } else {
        setShowShapes(false);
      }
    }, [mouseMode]);

    if (!currentScheme || !user) return <></>;

    const dialogContents = (
      <>
        <BasePaintDialog
          open={dialog === DialogTypes.BASEPAINT}
          legacyMode={currentScheme.legacy_mode}
          carMake={currentCarMake}
          basePaints={basePaints}
          onOpenBase={handleOpenBase}
          onCancel={hideDialog}
        />
        <OverlayDialog
          open={dialog === DialogTypes.SHAPE}
          overlays={overlayList}
          onOpenOverlay={handleOpenOverlay}
          onCancel={hideDialog}
        />
        <LogoDialog
          open={dialog === DialogTypes.LOGO}
          logos={logoList}
          uploads={uploadList}
          user={user}
          onOpenLogo={handleOpenLogo}
          onOpenUpload={handleOpenUpload}
          onCancel={hideDialog}
        />
        <UploadDialog
          open={dialog === DialogTypes.UPLOAD}
          uploads={uploadList}
          onOpenUpload={handleOpenUpload}
          onCancel={hideDialog}
        />
        <TextDialog
          open={dialog === DialogTypes.TEXT}
          fontList={fontList}
          baseColor={currentScheme.base_color}
          defaultColor={currentScheme.guide_data.default_shape_color}
          defaultStrokeColor={currentScheme.guide_data.default_shape_scolor}
          onCreate={handleCreateText}
          onCancel={hideDialog}
        />
        <DefaultSettingsDialog
          open={dialog === DialogTypes.DEFAULT_SHAPE_SETTINGS}
          onApply={handleApplySettings}
          onCancel={hideDialog}
        />
      </>
    );

    return (
      <Wrapper
        height="100%"
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        alignItems="center"
      >
        <ToolWrapper>
          {dialog_modes.map((item) => (
            <MainItem
              value={item.value}
              disabled={!editable}
              key={item.value}
              onClick={() => handleOpenDialog(item.value)}
            >
              {item.icon}
              <Typography style={{ fontSize: "10px" }}>{item.label}</Typography>
            </MainItem>
          ))}
          <ShapeItem
            value={"Draw Shapes"}
            disabled={!editable}
            active={showShapes}
            onClick={handleToggleDrawShapes}
          >
            <CustomFontAwesomeIcon
              icon={faDrawPolygon}
              style={{ fontSize: "30px" }}
            />
            <Typography style={{ fontSize: "10px" }}>Draw Shapes</Typography>
          </ShapeItem>
          {showShapes ? (
            <ShapeWrapper>
              {drawModes.map((mode) => (
                <LightTooltip
                  key={mode.value}
                  title={mode.label}
                  arrow
                  placement="right"
                >
                  <CustomDrawingItem
                    value={mode.value}
                    disabled={!editable}
                    onClick={() => handleModeChange(mode.value)}
                    onKeyDown={handleKeyEventDrawingItem}
                    active={mode.value === mouseMode ? "true" : "false"}
                  >
                    {mode.icon}
                  </CustomDrawingItem>
                </LightTooltip>
              ))}
            </ShapeWrapper>
          ) : (
            <></>
          )}

          <DefaultSettingsButton
            onClick={() =>
              editable ? setDialog(DialogTypes.DEFAULT_SHAPE_SETTINGS) : null
            }
          />
        </ToolWrapper>

        {dialogContents}
      </Wrapper>
    );
  }
);

export default DrawerBar;

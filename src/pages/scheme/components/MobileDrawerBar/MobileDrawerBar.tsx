import { faCuttlefish } from "@fortawesome/free-brands-svg-icons";
import {
  faCircle,
  faDotCircle,
  faDrawPolygon,
  faFolderOpen,
  faFont,
  faPaintBrush,
  faSquare,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import {
  ShowChart as LineIcon,
  SignalWifi4Bar as WedgeIcon,
  TrendingUp as ArrowIcon,
} from "@material-ui/icons";
import { SpeedDialIcon } from "@material-ui/lab";
import { Stage } from "konva/types/Stage";
import React, { RefObject, useCallback, useMemo, useState } from "react";
import { Octagon as OctagonIcon } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import BasepaintIcon from "src/assets/base-paint.svg";
import GraphicsIcon from "src/assets/insert-graphics.svg";
import LogoIcon from "src/assets/insert-logo.svg";
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
  updateLayer,
} from "src/redux/reducers/layerReducer";
import { updateScheme } from "src/redux/reducers/schemeReducer";
import { DefaultLayerData } from "src/types/common";
import { DialogTypes, MouseModes } from "src/types/enum";

import {
  CustomFontAwesomeIcon,
  MainSpeedDial,
  MainSpeedDialAction,
  ShapesSpeedDialAction,
  SubSpeedDial,
  SubSpeedDialAction,
} from "./MobileDrawerBar.style";

export const drawModes = [
  {
    value: MouseModes.POLYGON,
    label: "Polygon Mode",
    icon: <CustomFontAwesomeIcon icon={faDrawPolygon} />,
  },
  {
    value: MouseModes.LINE,
    label: "Line Mode",
    icon: <LineIcon />,
  },
  {
    value: MouseModes.PEN,
    label: "Brush Mode",
    icon: <CustomFontAwesomeIcon icon={faPaintBrush} />,
  },
  {
    value: MouseModes.RECT,
    label: "Rectangle Mode",
    icon: <CustomFontAwesomeIcon icon={faSquare} />,
  },
  {
    value: MouseModes.CIRCLE,
    label: "Circle Mode",
    icon: <CustomFontAwesomeIcon icon={faCircle} />,
  },
  {
    value: MouseModes.ELLIPSE,
    label: "Ellipse Mode",
    icon: <CustomFontAwesomeIcon icon={faCircle} isstretch="true" />,
  },
  {
    value: MouseModes.STAR,
    label: "Star Mode",
    icon: <CustomFontAwesomeIcon icon={faStar} />,
  },
  {
    value: MouseModes.RING,
    label: "Ring Mode",
    icon: <CustomFontAwesomeIcon icon={faDotCircle} />,
  },
  {
    value: MouseModes.REGULARPOLYGON,
    label: "Regular Polygon Mode",
    icon: <OctagonIcon size={17} />,
  },
  {
    value: MouseModes.WEDGE,
    label: "Wedge Mode",
    icon: <WedgeIcon fontSize="small" />,
  },
  {
    value: MouseModes.ARC,
    label: "Arc Mode",
    icon: <CustomFontAwesomeIcon icon={faCuttlefish} />,
  },
  {
    value: MouseModes.ARROW,
    label: "Arrow Mode",
    icon: <ArrowIcon fontSize="small" />,
  },
];

type MobileDrawerBarProps = {
  dialog?: DialogTypes | null;
  setDialog: (dialog?: DialogTypes | undefined | null) => void;
  editable: boolean;
  stageRef: RefObject<Stage | undefined>;
};

export const MobileDrawerBar = React.memo(
  ({ dialog, setDialog, stageRef, editable }: MobileDrawerBarProps) => {
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
    const currentLayer = useSelector(
      (state: RootState) => state.layerReducer.current
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
    const [openSpeedDial, setOpenSpeedDial] = useState(false);

    const dialog_modes = useMemo(
      () => [
        {
          value: DialogTypes.BASEPAINT,
          label: "Base Paints",
          icon: (
            <img
              src={BasepaintIcon}
              alt="Base Paint"
              height="30px"
              style={{ margin: "0px" }}
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
              height="30px"
              style={{ margin: "0px" }}
            />
          ),
        },
        {
          value: DialogTypes.LOGO,
          label: "Insert Logo",
          icon: <img src={LogoIcon} alt="Logos" height={"30px"} />,
        },
        {
          value: DialogTypes.UPLOAD,
          label: "My Uploads",
          icon: (
            <CustomFontAwesomeIcon
              style={{ height: "20px", width: "20px", color: "white" }}
              icon={faFolderOpen}
            />
          ),
        },
        {
          value: DialogTypes.TEXT,
          label: "Add Text",
          icon: (
            <CustomFontAwesomeIcon
              style={{ height: "20px", width: "20px", color: "white" }}
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
        setOpenSpeedDial(false);
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
        setDialog(undefined);
        focusBoardQuickly();
      },
      [dispatch, currentScheme, currentLayer, setDialog]
    );

    const handleCloseDrawShapesMobile = useCallback(
      (e, reason) => {
        setShowShapes(false);
        if (reason === "toggle") {
          dispatch(setMouseMode(MouseModes.DEFAULT));
        }
      },
      [dispatch]
    );

    const handleOpenDialog = useCallback(
      (dialogName) => {
        setDialog(dialogName);
        setOpenSpeedDial(false);
      },
      [setDialog]
    );

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
      <>
        <MainSpeedDial
          ariaLabel="Add Layer"
          icon={<SpeedDialIcon />}
          onClose={() => setOpenSpeedDial(false)}
          onOpen={(_, reason) => {
            if (reason === "toggle") {
              setOpenSpeedDial(true);
            }
          }}
          open={openSpeedDial}
          hidden={!editable}
          direction="left"
        >
          <ShapesSpeedDialAction
            icon={
              <SubSpeedDial
                ariaLabel="Draw Shapes"
                icon={
                  <CustomFontAwesomeIcon
                    icon={faDrawPolygon}
                    style={{ fontSize: "20px", color: "white" }}
                  />
                }
                onClose={handleCloseDrawShapesMobile}
                onOpen={() => setShowShapes(true)}
                open={showShapes || mouseMode !== MouseModes.DEFAULT}
                hidden={!editable}
                direction="down"
              >
                {drawModes.map((mode) => (
                  <SubSpeedDialAction
                    key={mode.value}
                    icon={mode.icon}
                    active={mode.value === mouseMode}
                    tooltipTitle={mode.label}
                    onClick={() => handleModeChange(mode.value)}
                  />
                ))}
              </SubSpeedDial>
            }
            tooltipTitle="Draw Shapes"
          />
          {dialog_modes.map((action) => (
            <MainSpeedDialAction
              key={action.label}
              icon={action.icon}
              tooltipTitle={action.label}
              onClick={() => handleOpenDialog(action.value)}
            />
          ))}
        </MainSpeedDial>

        {dialogContents}
      </>
    );
  }
);

export default MobileDrawerBar;

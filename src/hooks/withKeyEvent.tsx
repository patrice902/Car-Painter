import { useFeatureFlag } from "configcat-react";
import { Group } from "konva/types/Group";
import { Stage } from "konva/types/Stage";
import _ from "lodash";
import React, {
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { usePageVisibility } from "react-page-visibility";
import { useDispatch, useSelector } from "react-redux";
import LayerDeleteDialog from "src/components/dialogs/LayerDeleteDialog";
import {
  decodeHtml,
  detectBrowser,
  focusBoard,
  getZoomedCenterPosition,
  isInSameSideBar,
  isWindows,
} from "src/helper";
import { useZoom } from "src/hooks";
import { RootState } from "src/redux";
import {
  historyActionBack,
  historyActionUp,
  setBoardRotate,
  setMouseMode,
  setPaintingGuides,
  setPressedEventKey,
  setPressedKey,
  setZoom,
} from "src/redux/reducers/boardReducer";
import { setAskingSimPreviewByLatest } from "src/redux/reducers/downloaderReducer";
import {
  cloneLayer,
  CloneLayerProps,
  deleteLayer,
  setClipboard as setLayerClipboard,
  setCurrent as setCurrentLayer,
  setDrawingStatus,
  updateLayer,
  updateLayerOnly,
} from "src/redux/reducers/layerReducer";
import { deleteUpload } from "src/redux/reducers/uploadReducer";
import SchemeService from "src/services/schemeService";
import {
  CSSStyleDeclarationWithMozTransform,
  MovableObjLayerData,
  UploadObjLayerData,
} from "src/types/common";
import {
  Browser,
  ConfigCatFlags,
  DialogTypes,
  DrawingStatus,
  LayerTypes,
  MouseModes,
  PaintingGuides,
} from "src/types/enum";
import { BuilderLayerJSON } from "src/types/query";
import { useDebouncedCallback } from "use-debounce";

export const ArrowKeys = ["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"];
const BracketKeys = ["[", "]"];

export interface WithKeyEventProps {
  editable: boolean;
  stageRef: RefObject<Stage>;
  baseLayerRef: RefObject<Group>;
  mainLayerRef: RefObject<Group>;
  carMakeLayerRef: RefObject<Group>;
  carMaskLayerRef: RefObject<Group>;
  virtualStageRef: RefObject<Stage>;
  virtualBaseLayerRef: RefObject<Group>;
  virtualMainLayerRef: RefObject<Group>;
  virtualCarMakeLayerRef: RefObject<Group>;
  virtualCarMaskLayerRef: RefObject<Group>;
}

export interface ComponentWithKeyEventProps extends WithKeyEventProps {
  dialog?: DialogTypes | null;
  setDialog: (dialog?: DialogTypes | null) => void;
  unsetDeleteLayerState: () => void;
  onKeyEvent: (key: string, event: KeyboardEvent) => void;
  onDeleteLayer: (layer: BuilderLayerJSON) => void;
  onCloneLayer: (props: CloneLayerProps) => void;
  onTogglePaintingGuides: (guide: PaintingGuides) => void;
}

export const withKeyEvent = (Component: React.FC<ComponentWithKeyEventProps>) =>
  React.memo((props: WithKeyEventProps) => {
    const dispatch = useDispatch();
    const isVisible = usePageVisibility();
    const { editable, stageRef } = props;
    const { onZoomIn, onZoomOut, onZoomFit } = useZoom(stageRef);
    const { value: enableSimPreview } = useFeatureFlag(
      ConfigCatFlags.SIM_PREVIEW,
      true
    );
    const [deleteLayerState, setDeleteLayerState] = useState<{
      show?: boolean;
      deleteUpload?: boolean;
      message?: string;
    }>({});
    const [dialog, setDialog] = useState<DialogTypes | null | undefined>(null);
    const [browserZoom, setBrowserZoom] = useState(1);

    const tick = useRef(0);
    const prevTick = useRef(0);

    const currentLayer = useSelector(
      (state: RootState) => state.layerReducer.current
    );
    const clipboardLayer = useSelector(
      (state: RootState) => state.layerReducer.clipboard
    );
    const layerList = useSelector(
      (state: RootState) => state.layerReducer.list
    );
    const uploadList = useSelector(
      (state: RootState) => state.uploadReducer.list
    );

    const pressedKey = useSelector(
      (state: RootState) => state.boardReducer.pressedKey
    );
    const pressedEventKey = useSelector(
      (state: RootState) => state.boardReducer.pressedEventKey
    );
    const boardRotate = useSelector(
      (state: RootState) => state.boardReducer.boardRotate
    );
    const mouseMode = useSelector(
      (state: RootState) => state.boardReducer.mouseMode
    );
    const zoom = useSelector((state: RootState) => state.boardReducer.zoom);
    const frameSize = useSelector(
      (state: RootState) => state.boardReducer.frameSize
    );
    const paintingGuides = useSelector(
      (state: RootState) => state.boardReducer.paintingGuides
    );

    const unsetDeleteLayerState = useCallback(() => {
      dispatch(setPressedKey(null));
      dispatch(setPressedEventKey(null));
      setDeleteLayerState({});
    }, [dispatch]);

    const togglePaintingGuides = useCallback(
      (guide: PaintingGuides) => {
        const newPaintingGuides = [...paintingGuides];
        const index = newPaintingGuides.indexOf(guide);
        if (index > -1) {
          newPaintingGuides.splice(index, 1);
        } else {
          newPaintingGuides.push(guide);
        }
        dispatch(setPaintingGuides(newPaintingGuides));
      },
      [dispatch, paintingGuides]
    );

    const handleCloneLayer = useCallback(
      (params: CloneLayerProps) => {
        dispatch(
          cloneLayer({
            ...params,
            centerPosition: getZoomedCenterPosition(
              stageRef,
              frameSize,
              zoom,
              boardRotate
            ),
          })
        );
        focusBoard();
      },
      [dispatch, stageRef, frameSize, zoom, boardRotate]
    );
    const handleDeleteLayer = useCallback(
      async (layer: BuilderLayerJSON) => {
        let deleteUpload = false;
        if (
          layer.layer_type === LayerTypes.UPLOAD &&
          uploadList.find(
            (item) => item.id === (layer.layer_data as UploadObjLayerData).id
          )
        ) {
          const schemes = await SchemeService.getSchemeListByUploadID(
            (layer.layer_data as UploadObjLayerData).id
          );
          if (schemes.length <= 1) {
            deleteUpload = true;
          }
        }
        dispatch(setPressedKey(null));
        dispatch(setPressedEventKey(null));
        setDeleteLayerState({
          show: true,
          deleteUpload,
          message: `Are you sure you want to delete "${decodeHtml(
            layer.layer_data.name
          )}"?`,
        });
      },
      [dispatch, uploadList]
    );

    const handleConfirm = useCallback(
      (gonnaDeleteAll?: boolean) => {
        if (currentLayer) {
          dispatch(setPressedKey(null));
          dispatch(setPressedEventKey(null));
          dispatch(deleteLayer(currentLayer));
          if (gonnaDeleteAll) {
            // This is Uploads Layer, and gonna Delete it from uploads
            dispatch(
              deleteUpload(
                { id: (currentLayer.layer_data as UploadObjLayerData).id },
                false
              )
            );
          }
          setDeleteLayerState({});
        }
      },
      [dispatch, currentLayer, setDeleteLayerState]
    );

    const handleChangeSelectedLayerOrder = useCallback(
      (isUpper = true) => {
        if (currentLayer && currentLayer.layer_type !== LayerTypes.CAR) {
          const exchangableLayers = _.orderBy(
            layerList.filter(
              (layer) =>
                (isUpper
                  ? layer.layer_order < currentLayer.layer_order
                  : layer.layer_order > currentLayer.layer_order) &&
                isInSameSideBar(currentLayer.layer_type, layer.layer_type)
            ),
            ["layer_order"],
            isUpper ? ["desc"] : ["asc"]
          );
          if (exchangableLayers.length) {
            const layerToExchange = exchangableLayers[0];
            dispatch(
              updateLayer({
                id: layerToExchange.id,
                layer_order: +currentLayer.layer_order,
              })
            );
            dispatch(
              updateLayer({
                id: currentLayer.id,
                layer_order: +layerToExchange.layer_order,
              })
            );
          }
        }
      },
      [currentLayer, dispatch, layerList]
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
        dispatch(setBoardRotate(newBoardRotate));
      },
      [boardRotate, dispatch]
    );

    const handleDebouncedLayerDataUpdate = useDebouncedCallback(
      (layer_data) => {
        dispatch(
          updateLayer({
            id: currentLayer?.id,
            layer_data,
          })
        );
      },
      300
    );

    const handleKeyEvent = useCallback(
      (key: string, event: KeyboardEvent) => {
        event.preventDefault();
        // console.log("key, event: ", key, event);
        // Delete Selected Layer
        if (
          (event.target as HTMLElement)?.tagName !== "INPUT" &&
          event.type === "keydown"
        ) {
          if (
            pressedKey === key &&
            pressedEventKey === event.key &&
            !ArrowKeys.includes(event.key) &&
            !BracketKeys.includes(event.key)
          ) {
            return;
          }
          if (pressedKey !== key) {
            dispatch(setPressedKey(key));
          }
          if (pressedEventKey !== event.key) {
            dispatch(setPressedEventKey(event.key));
          }
          if (key === "f5") {
            document.location.reload();
          } else if (
            (key === "del" || key === "backspace") &&
            currentLayer &&
            currentLayer.layer_type !== LayerTypes.CAR &&
            editable
          ) {
            handleDeleteLayer(currentLayer);
          } else if (key === "esc") {
            if (currentLayer) {
              dispatch(setCurrentLayer(null));
            } else if (mouseMode !== MouseModes.DEFAULT) {
              dispatch(setMouseMode(MouseModes.DEFAULT));
              dispatch(setDrawingStatus(DrawingStatus.CLEAR_COMMAND));
            }
          } else if (event.key === "+" && event.shiftKey) {
            onZoomIn();
          } else if (event.key === "_" && event.shiftKey) {
            onZoomOut();
          } else if (event.key === ")" && event.shiftKey) {
            dispatch(setZoom(1));
          } else if (event.key === "(" && event.shiftKey) {
            onZoomFit();
          } else if (
            event.key === "[" &&
            (event.ctrlKey || event.metaKey) &&
            editable
          ) {
            handleChangeSelectedLayerOrder(false);
          } else if (
            event.key === "]" &&
            (event.ctrlKey || event.metaKey) &&
            editable
          ) {
            handleChangeSelectedLayerOrder(true);
          } else if (event.key === "D" && event.shiftKey && editable) {
            dispatch(setMouseMode(MouseModes.DEFAULT));
          } else if (event.key === "B" && event.shiftKey && editable) {
            dispatch(setMouseMode(MouseModes.PEN));
          } else if (event.key === "R" && event.shiftKey && editable) {
            dispatch(setMouseMode(MouseModes.RECT));
          } else if (event.key === "C" && event.shiftKey && editable) {
            dispatch(setMouseMode(MouseModes.CIRCLE));
          } else if (event.key === "E" && event.shiftKey && editable) {
            dispatch(setMouseMode(MouseModes.ELLIPSE));
          } else if (event.key === "S" && event.shiftKey && editable) {
            dispatch(setMouseMode(MouseModes.STAR));
          } else if (event.key === "G" && event.shiftKey && editable) {
            dispatch(setMouseMode(MouseModes.RING));
          } else if (event.key === "O" && event.shiftKey && editable) {
            dispatch(setMouseMode(MouseModes.REGULARPOLYGON));
          } else if (event.key === "W" && event.shiftKey && editable) {
            dispatch(setMouseMode(MouseModes.WEDGE));
          } else if (event.key === "A" && event.shiftKey && editable) {
            dispatch(setMouseMode(MouseModes.ARC));
          } else if (event.key === "P" && event.shiftKey && editable) {
            dispatch(setMouseMode(MouseModes.POLYGON));
          } else if (event.key === "L" && event.shiftKey && editable) {
            dispatch(setMouseMode(MouseModes.LINE));
          } else if (event.key === ">" && event.shiftKey && editable) {
            dispatch(setMouseMode(MouseModes.ARROW));
          } else if (key === "t" && editable) {
            setDialog(DialogTypes.TEXT);
          } else if (enableSimPreview && key === "p" && isWindows()) {
            dispatch(setAskingSimPreviewByLatest(true));
          } else if (key === "s" && editable) {
            setDialog(DialogTypes.SHAPE);
          } else if (key === "l" && editable) {
            setDialog(DialogTypes.LOGO);
          } else if (key === "b" && editable) {
            setDialog(DialogTypes.BASEPAINT);
          } else if (
            event.key === "c" &&
            (event.ctrlKey || event.metaKey) &&
            currentLayer &&
            editable
          ) {
            dispatch(setLayerClipboard(currentLayer));
          } else if (
            event.key === "v" &&
            (event.ctrlKey || event.metaKey) &&
            clipboardLayer &&
            editable
          ) {
            handleCloneLayer({
              layerToClone: clipboardLayer as BuilderLayerJSON<MovableObjLayerData>,
            });
          } else if (
            event.key === "z" &&
            (event.ctrlKey || event.metaKey) &&
            editable
          ) {
            dispatch(historyActionBack());
          } else if (
            event.key === "y" &&
            (event.ctrlKey || event.metaKey) &&
            editable
          ) {
            dispatch(historyActionUp());
          } else if (
            event.key === "j" &&
            (event.ctrlKey || event.metaKey) &&
            editable
          ) {
            if (currentLayer) {
              handleCloneLayer({
                layerToClone: currentLayer as BuilderLayerJSON<MovableObjLayerData>,
              });
            }
          } else if (event.key === "=" && (event.ctrlKey || event.metaKey)) {
            const newBrowserZoom = browserZoom * 1.25;
            document.body.style.transform = `scale(${newBrowserZoom})`;
            document.body.style.transformOrigin = "0 0";

            if (detectBrowser() === Browser.FIREFOX) {
              (document.body
                .style as CSSStyleDeclarationWithMozTransform).MozTransform = `scale(${newBrowserZoom})`;
            }
            setBrowserZoom(newBrowserZoom);
          } else if (event.key === "-" && (event.ctrlKey || event.metaKey)) {
            const newBrowserZoom = browserZoom / 1.25;
            document.body.style.transform = `scale(${newBrowserZoom})`;
            document.body.style.transformOrigin = "0 0";

            if (detectBrowser() === Browser.FIREFOX) {
              (document.body
                .style as CSSStyleDeclarationWithMozTransform).MozTransform = `scale(${newBrowserZoom})`;
            }
            setBrowserZoom(newBrowserZoom);
          } else if (event.key === "ArrowLeft" && event.altKey) {
            handleChangeBoardRotation(false);
          } else if (event.key === "ArrowRight" && event.altKey) {
            handleChangeBoardRotation(true);
          } else if (key === "1") {
            togglePaintingGuides(PaintingGuides.CARMASK);
          } else if (key === "2") {
            togglePaintingGuides(PaintingGuides.WIREFRAME);
          } else if (key === "3") {
            togglePaintingGuides(PaintingGuides.SPONSORBLOCKS);
          } else if (key === "4") {
            togglePaintingGuides(PaintingGuides.NUMBERBLOCKS);
          } else if (key === "5") {
            togglePaintingGuides(PaintingGuides.GRID);
          } else if (key === "enter" && editable) {
            if (
              [MouseModes.LINE, MouseModes.ARROW, MouseModes.POLYGON].includes(
                mouseMode
              )
            ) {
              dispatch(setDrawingStatus(DrawingStatus.ADD_TO_SHAPE));
            } else if (currentLayer) {
              dispatch(setCurrentLayer(null));
            }
          }
        }

        // Arrow Keys
        if ((event.target as HTMLElement).tagName !== "INPUT" && editable) {
          if (event.type === "keyup") {
            dispatch(setPressedKey(null));
            dispatch(setPressedEventKey(null));
          }
          if (
            ArrowKeys.includes(event.key) &&
            currentLayer &&
            ![LayerTypes.CAR, LayerTypes.BASE].includes(currentLayer.layer_type)
          ) {
            const speed = event.shiftKey ? 10 : 1;
            const initialspeedX =
              event.key === "ArrowLeft"
                ? -speed
                : event.key === "ArrowRight"
                ? speed
                : 0;
            const initialspeedY =
              event.key === "ArrowUp"
                ? -speed
                : event.key === "ArrowDown"
                ? speed
                : 0;
            let speedX = initialspeedX;
            let speedY = initialspeedY;
            if (boardRotate === 90) {
              speedX = initialspeedY;
              speedY = -initialspeedX;
            } else if (boardRotate === 180) {
              speedX = -initialspeedX;
              speedY = -initialspeedY;
            } else if (boardRotate === 270) {
              speedX = -initialspeedY;
              speedY = initialspeedX;
            }
            if (prevTick.current != tick.current) {
              prevTick.current = +tick.current;
              const layer_data = {
                ...currentLayer.layer_data,
              } as MovableObjLayerData;
              layer_data.left =
                (currentLayer.layer_data as MovableObjLayerData).left + speedX;
              layer_data.top =
                (currentLayer.layer_data as MovableObjLayerData).top + speedY;
              dispatch(
                updateLayerOnly({
                  id: currentLayer.id,
                  layer_data,
                })
              );
              handleDebouncedLayerDataUpdate(layer_data);
            }
          }
        }
      },
      [
        editable,
        pressedKey,
        pressedEventKey,
        currentLayer,
        enableSimPreview,
        clipboardLayer,
        dispatch,
        handleDeleteLayer,
        mouseMode,
        onZoomIn,
        onZoomOut,
        onZoomFit,
        handleChangeSelectedLayerOrder,
        handleCloneLayer,
        browserZoom,
        handleChangeBoardRotation,
        togglePaintingGuides,
        boardRotate,
        handleDebouncedLayerDataUpdate,
      ]
    );

    useEffect(() => {
      if (editable && (pressedKey || pressedEventKey)) {
        const interval = setInterval(() => {
          tick.current += 1;
        }, 50);

        return () => {
          clearInterval(interval);
        };
      }
    }, [editable, pressedKey, pressedEventKey]);

    useEffect(() => {
      if (!isVisible) {
        dispatch(setPressedKey(null));
        dispatch(setPressedEventKey(null));
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isVisible]);

    useEffect(() => {
      window.addEventListener("blur", function () {
        dispatch(setPressedKey(null));
        dispatch(setPressedEventKey(null));
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <>
        <Component
          {...props}
          dialog={dialog}
          setDialog={setDialog}
          unsetDeleteLayerState={unsetDeleteLayerState}
          onKeyEvent={handleKeyEvent}
          onDeleteLayer={handleDeleteLayer}
          onCloneLayer={handleCloneLayer}
          onTogglePaintingGuides={togglePaintingGuides}
        />
        <LayerDeleteDialog
          text={deleteLayerState?.message}
          open={!!currentLayer && deleteLayerState?.show}
          deleteUpload={deleteLayerState?.deleteUpload}
          onCancel={unsetDeleteLayerState}
          onConfirm={handleConfirm}
        />
      </>
    );
  });

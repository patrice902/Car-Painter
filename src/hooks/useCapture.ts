import { Group } from "konva/types/Group";
import { Stage } from "konva/types/Stage";
import _ from "lodash";
import { RefObject, useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addImageProcess,
  dataURItoBlob,
  downloadTGA,
  getTGABlob,
  sleep,
} from "src/helper";
import { useReducerRef, useScheme } from "src/hooks";
import { RootState } from "src/redux";
import {
  setDownloadSpecTGA,
  setShowProperties,
  setSpecTGADataURL,
  setViewMode,
} from "src/redux/reducers/boardReducer";
import {
  setCurrent as setCurrentLayer,
  setLoadedStatus,
  updateLayer,
} from "src/redux/reducers/layerReducer";
import { setMessage } from "src/redux/reducers/messageReducer";
import {
  setCurrent as setCurrentScheme,
  setSaving,
} from "src/redux/reducers/schemeReducer";
import SchemeService from "src/services/schemeService";
import { LayerTypes, ViewModes } from "src/types/enum";

export const useCapture = (
  stageRef: RefObject<Stage>,
  baseLayerRef: RefObject<Group>,
  mainLayerRef: RefObject<Group>,
  carMaskLayerRef: RefObject<Group>,
  unsetDeleteLayerState: () => void
) => {
  const dispatch = useDispatch();
  const { schemeFinishBase } = useScheme();
  const [pauseCapturing, setPauseCapturing] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [, userRef] = useReducerRef(
    useSelector((state: RootState) => state.authReducer.user)
  );
  const [, currentSchemeRef] = useReducerRef(
    useSelector((state: RootState) => state.schemeReducer.current)
  );
  const [, currentCarMakeRef] = useReducerRef(
    useSelector((state: RootState) => state.carMakeReducer.current)
  );
  const schemeSaving = useSelector(
    (state: RootState) => state.schemeReducer.saving
  );
  const loadedStatuses = useSelector(
    (state: RootState) => state.layerReducer.loadedStatuses
  );
  const viewMode = useSelector(
    (state: RootState) => state.boardReducer.viewMode
  );
  const downloadSpecTGA = useSelector(
    (state: RootState) => state.boardReducer.downloadSpecTGA
  );
  const [, currentLayerRef] = useReducerRef(
    useSelector((state: RootState) => state.layerReducer.current)
  );
  const [drawingStatus, drawingStatusRef] = useReducerRef(
    useSelector((state: RootState) => state.layerReducer.drawingStatus)
  );
  const [, showPropertiesRef] = useReducerRef(
    useSelector((state: RootState) => state.boardReducer.showProperties)
  );

  const [, frameSizeRef] = useReducerRef(
    useSelector((state: RootState) => state.boardReducer.frameSize)
  );

  const carMakeSize = useMemo(
    () =>
      currentCarMakeRef.current && currentCarMakeRef.current.car_type === "Misc"
        ? 1024
        : 2048,
    [currentCarMakeRef]
  );

  const takeScreenshot = useCallback(async () => {
    if (
      !stageRef?.current ||
      !baseLayerRef?.current ||
      !mainLayerRef?.current ||
      !carMaskLayerRef?.current
    ) {
      return {};
    }

    setCapturing(true);
    await sleep(500);

    if (
      currentLayerRef.current &&
      ![LayerTypes.BASE, LayerTypes.CAR].includes(
        currentLayerRef.current.layer_type
      )
    ) {
      dispatch(updateLayer(currentLayerRef.current));
      dispatch(setCurrentLayer(null));
      unsetDeleteLayerState();
    }
    const pixelRatio = carMakeSize / frameSizeRef.current.width;

    const width = frameSizeRef.current.width * pixelRatio;
    const height = frameSizeRef.current.height * pixelRatio;

    const stageAttrs = { ...stageRef.current.attrs };

    const boardWrapper = document.getElementById("board-wrapper");
    if (boardWrapper) {
      boardWrapper.style.width = `${frameSizeRef.current.width}px`;
      boardWrapper.style.height = `${frameSizeRef.current.height}px`;
    }

    const originShowProperties = showPropertiesRef.current;
    dispatch(setShowProperties(false));

    // Getting Original Screenshot
    stageRef.current.setAttrs({
      x: 0,
      y: 0,
      offsetX: 0,
      offsetY: 0,
      scaleX: 1,
      scaleY: 1,
      rotation: 0,
      width: frameSizeRef.current.width,
      height: frameSizeRef.current.height,
    });
    stageRef.current.draw();

    const schemeLayerURL = stageRef.current.toDataURL({
      pixelRatio,
      x: 0,
      y: 0,
      width: frameSizeRef.current.width,
      height: frameSizeRef.current.height,
    });
    const schemeLayerImg = await addImageProcess(schemeLayerURL);

    // Getting TGA Screenshot
    carMaskLayerRef.current?.hide();
    stageRef.current.setAttrs({
      x: 0,
      y: 0,
      offsetX: 0,
      offsetY: 0,
      scaleX: 1,
      scaleY: 1,
      rotation: 0,
      width: frameSizeRef.current.width,
      height: frameSizeRef.current.height,
    });
    stageRef.current.draw();

    const tgaSchemeLayerURL = stageRef.current.toDataURL({
      pixelRatio,
      x: 0,
      y: 0,
      width: frameSizeRef.current.width,
      height: frameSizeRef.current.height,
    });
    const tgaSchemeLayerImg = await addImageProcess(tgaSchemeLayerURL);

    // Backup it's original States
    carMaskLayerRef.current?.show();
    stageRef.current.setAttrs(_.omit(stageAttrs, ["container"]));
    stageRef.current.draw();
    setTimeout(() => {
      stageRef.current?.x(stageAttrs.x);
      stageRef.current?.y(stageAttrs.y);
      stageRef.current?.draw();
    }, 100);

    if (boardWrapper) {
      boardWrapper.style.width = `100%`;
      boardWrapper.style.height = `100%`;
    }
    dispatch(setShowProperties(originShowProperties));

    // Draw Screenshot Image on Canvas
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = width;
    canvas.height = height;

    ctx?.drawImage(schemeLayerImg, 0, 0, width, height);

    // Draw TGA Screenshot Image on tgaCanvas

    const tgaCanvas = document.createElement("canvas");
    const tgaCtx = tgaCanvas.getContext("2d");

    tgaCanvas.width = width;
    tgaCanvas.height = height;

    tgaCtx?.drawImage(tgaSchemeLayerImg, 0, 0, width, height);

    setCapturing(false);
    return {
      canvas,
      ctx,
      tgaCanvas,
      tgaCtx,
    };
  }, [
    currentLayerRef,
    carMakeSize,
    frameSizeRef,
    stageRef,
    showPropertiesRef,
    dispatch,
    baseLayerRef,
    mainLayerRef,
    carMaskLayerRef,
    unsetDeleteLayerState,
  ]);

  const uploadThumbnail = useCallback(
    async (dataURL) => {
      try {
        if (!capturing && currentSchemeRef.current) {
          const blob = dataURItoBlob(dataURL);
          const fileOfBlob = new File(
            [blob],
            `${currentSchemeRef.current.id}.jpg`,
            {
              type: "image/jpeg",
            }
          );

          const formData = new FormData();
          formData.append("files", fileOfBlob);
          formData.append("schemeID", currentSchemeRef.current.id.toString());
          dispatch(
            setCurrentScheme({
              ...currentSchemeRef.current,
              thumbnail_updated: 1,
            })
          );
          await SchemeService.uploadThumbnail(formData);
        }
      } catch (err) {
        dispatch(setMessage({ message: (err as Error).message }));
      }
    },
    [dispatch, capturing, currentSchemeRef]
  );

  const handleUploadThumbnail = useCallback(
    async (uploadLater = true) => {
      if (
        stageRef.current &&
        currentSchemeRef.current &&
        !currentSchemeRef.current.thumbnail_updated &&
        !capturing
      ) {
        if (drawingStatusRef.current) {
          setPauseCapturing(true);
          return;
        }
        try {
          dispatch(setSaving(true));
          const { canvas } = await takeScreenshot();
          const dataURL = canvas?.toDataURL("image/jpeg", 0.5);
          if (uploadLater) dispatch(setSaving(false));
          await uploadThumbnail(dataURL);
          if (!uploadLater) dispatch(setSaving(false));
        } catch (err) {
          console.log(err);
          dispatch(setMessage({ message: (err as Error).message }));
        }
      }
    },
    [
      dispatch,
      capturing,
      currentSchemeRef,
      stageRef,
      drawingStatusRef,
      takeScreenshot,
      uploadThumbnail,
    ]
  );

  const retrievePNGDataUrl = useCallback(async () => {
    if (stageRef.current && currentSchemeRef.current && !capturing) {
      try {
        dispatch(setSaving(true));
        const { canvas } = await takeScreenshot();
        const dataURL = canvas?.toDataURL("image/png", 0.5);
        dispatch(setSaving(false));
        return dataURL;
      } catch (err) {
        console.log(err);
        dispatch(setMessage({ message: (err as Error).message }));
        return null;
      }
    }
  }, [dispatch, currentSchemeRef, stageRef, takeScreenshot, capturing]);

  const retrieveTGAPNGDataUrl = useCallback(async () => {
    if (stageRef.current && currentSchemeRef.current && !capturing) {
      try {
        dispatch(setSaving(true));
        const { tgaCanvas } = await takeScreenshot();

        const dataURL = tgaCanvas?.toDataURL("image/png", 1);
        dispatch(setSaving(false));
        return dataURL;
      } catch (err) {
        console.log(err);
        dispatch(setMessage({ message: (err as Error).message }));
        return null;
      }
    }
  }, [dispatch, currentSchemeRef, stageRef, takeScreenshot, capturing]);

  const retrieveTGABlobURL = useCallback(
    async (isCustomNumber) => {
      if (stageRef.current && currentSchemeRef.current && !capturing) {
        try {
          dispatch(setSaving(true));
          const { tgaCtx } = await takeScreenshot();

          dispatch(setSaving(false));

          if (!tgaCtx) return null;

          const blob = getTGABlob(tgaCtx, carMakeSize, carMakeSize);
          const fileOfBlob = new File(
            [blob],
            isCustomNumber
              ? `car_num_${userRef.current?.id ?? ""}.tga`
              : `car_${userRef.current?.id ?? ""}.tga`
          );
          return fileOfBlob;
        } catch (err) {
          console.log(err);
          dispatch(setMessage({ message: (err as Error).message }));
        }
      }
    },
    [
      stageRef,
      currentSchemeRef,
      dispatch,
      takeScreenshot,
      carMakeSize,
      userRef,
      capturing,
    ]
  );

  const handleDownloadTGA = useCallback(
    async (isCustomNumberTGA = false) => {
      if (stageRef.current && currentSchemeRef.current && !capturing) {
        try {
          dispatch(setSaving(true));
          const { canvas, tgaCtx } = await takeScreenshot();

          dispatch(setSaving(false));

          if (!tgaCtx) return;

          downloadTGA(
            tgaCtx,
            carMakeSize,
            carMakeSize,
            isCustomNumberTGA
              ? `car_num_${userRef.current?.id ?? ""}.tga`
              : `car_${userRef.current?.id ?? ""}.tga`
          );

          const dataURL = canvas?.toDataURL("image/jpeg", 0.5);
          if (!currentSchemeRef.current.thumbnail_updated)
            await uploadThumbnail(dataURL);
        } catch (err) {
          console.log(err);
          dispatch(setMessage({ message: (err as Error).message }));
        }
      }
    },
    [
      stageRef,
      currentSchemeRef,
      dispatch,
      takeScreenshot,
      carMakeSize,
      userRef,
      uploadThumbnail,
      capturing,
    ]
  );

  const requestSpecTGAPNGDataUrl = useCallback(async () => {
    if (stageRef.current && currentSchemeRef.current && !capturing) {
      dispatch(setSaving(true));
      dispatch(setViewMode(ViewModes.SPEC_VIEW));
    }
  }, [dispatch, currentSchemeRef, stageRef, capturing]);

  const handleDownloadSpecTGA = useCallback(() => {
    if (stageRef.current && currentSchemeRef.current && !capturing) {
      dispatch(setSaving(true));
      dispatch(setDownloadSpecTGA(true));
      dispatch(setViewMode(ViewModes.SPEC_VIEW));
    }
  }, [dispatch, currentSchemeRef, stageRef, capturing]);

  const handleDownloadSpecPNG = useCallback(async () => {
    if (
      schemeSaving &&
      viewMode === ViewModes.SPEC_VIEW &&
      loadedStatuses[`guide-mask-${schemeFinishBase}`]
    ) {
      try {
        const { tgaCtx, canvas } = await takeScreenshot();

        dispatch(setViewMode(ViewModes.NORMAL_VIEW));
        dispatch(
          setLoadedStatus({
            key: `guide-mask-${schemeFinishBase}`,
            value: false,
          })
        );
        setTimeout(() => dispatch(setSaving(false)), 1000);

        if (!tgaCtx) return;

        if (downloadSpecTGA) {
          downloadTGA(
            tgaCtx,
            carMakeSize,
            carMakeSize,
            `car_spec_${userRef.current?.id ?? ""}.tga`
          );
        } else {
          const dataURL = canvas.toDataURL("image/png", 1);
          dispatch(setSpecTGADataURL(dataURL));
        }
      } catch (err) {
        console.log(err);
        dispatch(setMessage({ message: (err as Error).message }));
      }
    }
  }, [
    dispatch,
    schemeSaving,
    viewMode,
    schemeFinishBase,
    loadedStatuses,
    userRef,
    takeScreenshot,
    carMakeSize,
    downloadSpecTGA,
  ]);

  useEffect(() => {
    handleDownloadSpecPNG();
  }, [handleDownloadSpecPNG]);

  useEffect(() => {
    if (pauseCapturing && !drawingStatus && !capturing) {
      setPauseCapturing(false);
      handleUploadThumbnail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pauseCapturing, drawingStatus, capturing]);

  return {
    handleUploadThumbnail,
    handleDownloadTGA,
    handleDownloadSpecTGA,
    retrieveTGAPNGDataUrl,
    retrieveTGABlobURL,
    retrievePNGDataUrl,
    requestSpecTGAPNGDataUrl,
  };
};
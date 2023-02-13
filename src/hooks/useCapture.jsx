import { LayerTypes, ViewModes } from "constant";
import {
  addImageProcess,
  dataURItoBlob,
  downloadTGA,
  getTGABlob,
  sleep,
} from "helper";
import { useReducerRef, useScheme } from "hooks";
import _ from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setDownloadSpecTGA,
  setShowProperties,
  setSpecTGADataURL,
  setViewMode,
} from "redux/reducers/boardReducer";
import {
  setCurrent as setCurrentLayer,
  setLoadedStatus,
  updateLayer,
} from "redux/reducers/layerReducer";
import { setMessage } from "redux/reducers/messageReducer";
import {
  setCurrent as setCurrentScheme,
  setSaving,
} from "redux/reducers/schemeReducer";
import SchemeService from "services/schemeService";

export const useCapture = (
  stageRef,
  baseLayerRef,
  mainLayerRef,
  carMaskLayerRef,
  unsetDeleteLayerState
) => {
  const dispatch = useDispatch();
  const { schemeFinishBase } = useScheme();
  const [pauseCapturing, setPauseCapturing] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [, userRef] = useReducerRef(
    useSelector((state) => state.authReducer.user)
  );
  const [, currentSchemeRef] = useReducerRef(
    useSelector((state) => state.schemeReducer.current)
  );
  const [, currentCarMakeRef] = useReducerRef(
    useSelector((state) => state.carMakeReducer.current)
  );
  const schemeSaving = useSelector((state) => state.schemeReducer.saving);
  const loadedStatuses = useSelector(
    (state) => state.layerReducer.loadedStatuses
  );
  const viewMode = useSelector((state) => state.boardReducer.viewMode);
  const downloadSpecTGA = useSelector(
    (state) => state.boardReducer.downloadSpecTGA
  );
  const [, currentLayerRef] = useReducerRef(
    useSelector((state) => state.layerReducer.current)
  );
  const [drawingStatus, drawingStatusRef] = useReducerRef(
    useSelector((state) => state.layerReducer.drawingStatus)
  );
  const [, showPropertiesRef] = useReducerRef(
    useSelector((state) => state.boardReducer.showProperties)
  );

  const [, frameSizeRef] = useReducerRef(
    useSelector((state) => state.boardReducer.frameSize)
  );

  const carMakeSize = useMemo(
    () =>
      currentCarMakeRef.current && currentCarMakeRef.current.car_type === "Misc"
        ? 1024
        : 2048,
    [currentCarMakeRef]
  );

  const takeScreenshot = useCallback(
    async (isPNG = true) => {
      if (
        !stageRef.current ||
        !baseLayerRef.current ||
        !mainLayerRef.current ||
        !carMaskLayerRef.current
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
      let canvas = document.createElement("canvas");
      let ctx = canvas.getContext("2d");
      const pixelRatio = carMakeSize / frameSizeRef.current.width;

      let width = frameSizeRef.current.width * pixelRatio;
      let height = frameSizeRef.current.height * pixelRatio;
      let baseLayerImg, mainLayerImg, carMaskLayerImg;
      let stageAttrs = { ...stageRef.current.attrs };

      const boardWrapper = document.getElementById("board-wrapper");

      boardWrapper.style.width = `${frameSizeRef.current.width}px`;
      boardWrapper.style.height = `${frameSizeRef.current.height}px`;
      const originShowProperties = showPropertiesRef.current;
      dispatch(setShowProperties(false));

      const baseLayerAbPos = baseLayerRef.current.absolutePosition();
      const mainLayerAbPos = mainLayerRef.current.absolutePosition();
      const carMaskLayerAbPos = carMaskLayerRef.current.absolutePosition();
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

      if (baseLayerRef.current) {
        baseLayerRef.current.absolutePosition({
          x: 0,
          y: 0,
        });
        let baseLayerURL = baseLayerRef.current.toDataURL({
          pixelRatio,
          x: 0,
          y: 0,
          width: frameSizeRef.current.width,
          height: frameSizeRef.current.height,
        });
        baseLayerImg = await addImageProcess(baseLayerURL);
      }

      if (mainLayerRef.current) {
        mainLayerRef.current.absolutePosition({
          x: 0,
          y: 0,
        });
        let mainLayerURL = mainLayerRef.current.toDataURL({
          pixelRatio,
          x: 0,
          y: 0,
          width: frameSizeRef.current.width,
          height: frameSizeRef.current.height,
        });
        mainLayerImg = await addImageProcess(mainLayerURL);
      }
      if (carMaskLayerRef.current) {
        carMaskLayerRef.current.absolutePosition({
          x: 0,
          y: 0,
        });
        let carMaskLayerURL = carMaskLayerRef.current.toDataURL({
          pixelRatio,
          x: 0,
          y: 0,
          width: frameSizeRef.current.width,
          height: frameSizeRef.current.height,
        });
        carMaskLayerImg = await addImageProcess(carMaskLayerURL);
      }

      stageRef.current.setAttrs(_.omit(stageAttrs, ["container"]));
      stageRef.current.draw();
      setTimeout(() => {
        stageRef.current.x(stageAttrs.x);
        stageRef.current.y(stageAttrs.y);
        stageRef.current.draw();
      }, 100);

      baseLayerRef.current.absolutePosition(baseLayerAbPos);
      mainLayerRef.current.absolutePosition(mainLayerAbPos);
      carMaskLayerRef.current.absolutePosition(carMaskLayerAbPos);

      boardWrapper.style.width = `100%`;
      boardWrapper.style.height = `100%`;
      dispatch(setShowProperties(originShowProperties));
      canvas.width = width;
      canvas.height = height;

      if (baseLayerImg) {
        ctx.drawImage(baseLayerImg, 0, 0, width, height);
      }
      if (mainLayerImg) {
        ctx.drawImage(mainLayerImg, 0, 0, width, height);
      }
      if (carMaskLayerImg && isPNG) {
        ctx.drawImage(carMaskLayerImg, 0, 0, width, height);
      }
      setCapturing(false);
      return {
        canvas,
        ctx,
        carMaskLayerImg,
      };
    },
    [
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
    ]
  );

  const uploadThumbnail = useCallback(
    async (dataURL) => {
      try {
        if (!capturing) {
          let blob = dataURItoBlob(dataURL);
          var fileOfBlob = new File(
            [blob],
            `${currentSchemeRef.current.id}.jpg`,
            {
              type: "image/jpeg",
            }
          );

          let formData = new FormData();
          formData.append("files", fileOfBlob);
          formData.append("schemeID", currentSchemeRef.current.id);
          dispatch(setCurrentScheme({ thumbnail_updated: 1 }));
          await SchemeService.uploadThumbnail(formData);
        }
      } catch (err) {
        dispatch(setMessage({ message: err.message }));
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
          const { canvas, ctx, carMaskLayerImg } = await takeScreenshot();
          ctx.drawImage(carMaskLayerImg, 0, 0);
          let dataURL = canvas.toDataURL("image/jpeg", 0.5);
          if (uploadLater) dispatch(setSaving(false));
          await uploadThumbnail(dataURL);
          if (!uploadLater) dispatch(setSaving(false));
        } catch (err) {
          console.log(err);
          dispatch(setMessage({ message: err.message }));
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
        const { canvas, ctx, carMaskLayerImg } = await takeScreenshot();
        ctx.drawImage(carMaskLayerImg, 0, 0);
        let dataURL = canvas.toDataURL("image/png", 0.5);
        dispatch(setSaving(false));
        return dataURL;
      } catch (err) {
        console.log(err);
        dispatch(setMessage({ message: err.message }));
        return null;
      }
    }
  }, [dispatch, currentSchemeRef, stageRef, takeScreenshot, capturing]);

  const retrieveTGAPNGDataUrl = useCallback(async () => {
    if (stageRef.current && currentSchemeRef.current && !capturing) {
      try {
        dispatch(setSaving(true));
        const { canvas } = await takeScreenshot(false);

        let dataURL = canvas.toDataURL("image/png", 1);
        dispatch(setSaving(false));
        return dataURL;
      } catch (err) {
        console.log(err);
        dispatch(setMessage({ message: err.message }));
        return null;
      }
    }
  }, [dispatch, currentSchemeRef, stageRef, takeScreenshot, capturing]);

  const retrieveTGABlobURL = useCallback(
    async (isCustomNumber) => {
      if (stageRef.current && currentSchemeRef.current && !capturing) {
        try {
          dispatch(setSaving(true));
          const { ctx } = await takeScreenshot(false);

          dispatch(setSaving(false));

          const blob = getTGABlob(ctx, carMakeSize, carMakeSize);
          var fileOfBlob = new File(
            [blob],
            isCustomNumber
              ? `car_num_${userRef.current.id}.tga`
              : `car_${userRef.current.id}.tga`
          );
          return fileOfBlob;
        } catch (err) {
          console.log(err);
          dispatch(setMessage({ message: err.message }));
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
          const { canvas, ctx, carMaskLayerImg } = await takeScreenshot(false);

          dispatch(setSaving(false));
          downloadTGA(
            ctx,
            carMakeSize,
            carMakeSize,
            isCustomNumberTGA
              ? `car_num_${userRef.current.id}.tga`
              : `car_${userRef.current.id}.tga`
          );

          ctx.drawImage(carMaskLayerImg, 0, 0, carMakeSize, carMakeSize);
          let dataURL = canvas.toDataURL("image/jpeg", 0.1);
          if (!currentSchemeRef.current.thumbnail_updated)
            await uploadThumbnail(dataURL);
        } catch (err) {
          console.log(err);
          dispatch(setMessage({ message: err.message }));
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    if (
      schemeSaving &&
      viewMode === ViewModes.SPEC_VIEW &&
      loadedStatuses[`guide-mask-${schemeFinishBase}`]
    ) {
      try {
        const { ctx, canvas } = await takeScreenshot(false);

        dispatch(setViewMode(ViewModes.NORMAL_VIEW));
        dispatch(
          setLoadedStatus({
            key: `guide-mask-${schemeFinishBase}`,
            value: false,
          })
        );
        setTimeout(() => dispatch(setSaving(false)), 1000);
        if (downloadSpecTGA) {
          downloadTGA(
            ctx,
            carMakeSize,
            carMakeSize,
            `car_spec_${userRef.current.id}.tga`
          );
        } else {
          let dataURL = canvas.toDataURL("image/png", 1);
          dispatch(setSpecTGADataURL(dataURL));
        }
      } catch (err) {
        console.log(err);
        dispatch(setMessage({ message: err.message }));
      }
    }
  }, [
    dispatch,
    schemeSaving,
    viewMode,
    schemeFinishBase,
    currentCarMakeRef,
    loadedStatuses,
    userRef,
    takeScreenshot,
    carMakeSize,
    downloadSpecTGA,
  ]);

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

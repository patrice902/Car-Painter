import React, { useEffect, useState, useRef, useCallback } from "react";

import { useSelector, useDispatch } from "react-redux";
import useInterval from "react-useinterval";
import KeyboardEventHandler from "react-keyboard-event-handler";
import { Helmet } from "react-helmet";
import { useHistory, useParams } from "react-router";

import { Box, useMediaQuery } from "@material-ui/core";

import { ScreenLoader } from "components/common";
import {
  Toolbar,
  Board,
  SideBar,
  PropertyBar,
  BoardGuide,
  Header,
} from "./components";

import {
  getScheme,
  setLoaded,
  getSharedUsers,
  getFavoriteList,
} from "redux/reducers/schemeReducer";
import { getOverlayList } from "redux/reducers/overlayReducer";
import { getFontList } from "redux/reducers/fontReducer";
import { getLogoList } from "redux/reducers/logoReducer";
import { setMessage } from "redux/reducers/messageReducer";
import { setBoardRotate, setIsDesktop } from "redux/reducers/boardReducer";
import { getUploadListByUserID } from "redux/reducers/uploadReducer";

import { useBoardSocket, useCapture, useZoom, withKeyEvent } from "hooks";
import { withWrapper } from "./withWrapper";
import { LegacyBanner } from "./components/LegacyBanner";
import { ReconnectionBanner } from "./components/ReconnectionBanner";
import { getCarRaces } from "redux/reducers/carReducer";
import { getDownloaderStatus } from "redux/reducers/downloaderReducer";
import { MouseModes } from "constant";
import { focusBoardQuickly, isWindows } from "helper";
import { useMemo } from "react";
import { setLoadedStatusAll } from "redux/reducers/layerReducer";
import { DrawerBar } from "./components/SideBar/components";

const Scheme = React.memo((props) => {
  const {
    editable,
    dialog,
    setDialog,
    stageRef,
    baseLayerRef,
    mainLayerRef,
    carMaskLayerRef,
    onKeyEvent,
    onDeleteLayer,
    onCloneLayer,
    unsetDeleteLayerState,
  } = props;
  useBoardSocket();
  const dispatch = useDispatch();
  const history = useHistory();
  const params = useParams();
  const { onZoomFit } = useZoom(stageRef);
  const overMobile = useMediaQuery((theme) => theme.breakpoints.up("sm"));

  const [hoveredJSON, setHoveredJSON] = useState({});
  const [transformingLayer, setTransformingLayer] = useState(null);

  const activeTransformerRef = useRef(null);
  const hoveredTransformerRef = useRef(null);

  const {
    handleUploadThumbnail,
    handleDownloadTGA,
    handleDownloadSpecTGA,
    retrieveTGAPNGDataUrl,
    requestSpecTGAPNGDataUrl,
  } = useCapture(
    stageRef,
    baseLayerRef,
    mainLayerRef,
    carMaskLayerRef,
    unsetDeleteLayerState
  );

  const user = useSelector((state) => state.authReducer.user);
  const blockedBy = useSelector((state) => state.authReducer.blockedBy);
  const previousPath = useSelector((state) => state.authReducer.previousPath);
  const mouseMode = useSelector((state) => state.boardReducer.mouseMode);
  const pressedKey = useSelector((state) => state.boardReducer.pressedKey);
  const currentScheme = useSelector((state) => state.schemeReducer.current);
  const schemeLoaded = useSelector((state) => state.schemeReducer.loaded);
  const schemeSocketConnected = useSelector(
    (state) => state.schemeReducer.socketConnected
  );

  const loadedStatuses = useSelector(
    (state) => state.layerReducer.loadedStatuses
  );
  const overlayList = useSelector((state) => state.overlayReducer.list);
  const logoList = useSelector((state) => state.logoReducer.list);
  const fontList = useSelector((state) => state.fontReducer.list);
  const sharedUsers = useSelector((state) => state.schemeReducer.sharedUsers);
  const favoriteSchemeList = useSelector(
    (state) => state.schemeReducer.favoriteList
  );

  const schemeLoading = useSelector((state) => state.schemeReducer.loading);
  const carMakeLoading = useSelector((state) => state.carMakeReducer.loading);
  const fontLoading = useSelector((state) => state.fontReducer.loading);
  const uploadsInitialized = useSelector(
    (state) => state.uploadReducer.initialized
  );

  const [showLegacyBanner, setShowLegacyBanner] = useState(false);
  const isInWindows = useMemo(() => isWindows(), []);

  const setHoveredJSONItem = useCallback(
    (key, value) => {
      if (value === true) setHoveredJSON({ [key]: value });
      else setHoveredJSON((origin) => ({ ...origin, [key]: value }));
    },
    [setHoveredJSON]
  );

  const handleChangeBoardRotation = useCallback(
    (newRotation) => {
      dispatch(setBoardRotate(newRotation));
      focusBoardQuickly();
    },
    [dispatch]
  );

  const handleGoBack = useCallback(async () => {
    dispatch(setLoadedStatusAll({}));
    if (overMobile) {
      await handleUploadThumbnail(false);
    }
    history.push(previousPath || "/");
  }, [history, dispatch, handleUploadThumbnail, previousPath, overMobile]);

  const hideLegacyBanner = useCallback(() => {
    setShowLegacyBanner(false);
    focusBoardQuickly();
  }, []);

  useEffect(() => {
    if (currentScheme) {
      setShowLegacyBanner(currentScheme.legacy_mode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentScheme && currentScheme.legacy_mode]);

  useEffect(() => {
    if (user && user.id && params.id) {
      if (!currentScheme) {
        dispatch(
          getScheme(
            params.id,
            (scheme, tempsharedUsers) => {
              if (
                (user.id !== scheme.user_id &&
                  !tempsharedUsers.find(
                    (shared) => shared.user_id === user.id
                  )) ||
                blockedBy.includes(scheme.user_id)
              ) {
                dispatch(
                  setMessage({
                    message: "You don't have permission for this project!",
                  })
                );
                history.push("/");
              } else {
                if (!uploadsInitialized) {
                  dispatch(getUploadListByUserID(user.id));
                }
                if (!overlayList.length) dispatch(getOverlayList());
                if (!logoList.length) dispatch(getLogoList());
                if (!fontList.length) dispatch(getFontList());
                if (!sharedUsers.length) dispatch(getSharedUsers(params.id));
                if (!favoriteSchemeList.length)
                  dispatch(getFavoriteList(user.id));
                dispatch(getCarRaces(scheme.id));
                if (isWindows()) {
                  dispatch(getDownloaderStatus());
                }
              }
            },
            () => {
              history.push("/");
            }
          )
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (
      !schemeLoaded &&
      Object.keys(loadedStatuses).length &&
      Object.keys(loadedStatuses).every((k) => loadedStatuses[k]) &&
      stageRef.current
    ) {
      dispatch(setLoaded(true));
      onZoomFit();
      if (overMobile) {
        setTimeout(handleUploadThumbnail, 5000);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadedStatuses, schemeLoaded]);

  useEffect(() => {
    if (editable && overMobile) {
      const thumbnailInterval = setInterval(handleUploadThumbnail, 300000);
      return () => {
        clearInterval(thumbnailInterval);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editable]);

  useInterval(
    () => {
      if (isWindows()) {
        dispatch(getDownloaderStatus());
      }
    },
    isInWindows && user && user.id && currentScheme ? 10000 : null
  );

  useEffect(() => {
    if (stageRef.current) {
      const container = stageRef.current.attrs.container;
      let flag = false;
      for (const item of Object.keys(hoveredJSON)) {
        if (hoveredJSON[item]) {
          flag = true;
        }
      }
      if (flag) {
        if (pressedKey === "alt") {
          container.style.cursor = "copy";
        } else {
          container.style.cursor = "move";
        }
      } else {
        container.style.cursor =
          mouseMode === MouseModes.DEFAULT ? "default" : "crosshair";
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hoveredJSON, stageRef, pressedKey]);

  useEffect(() => {
    dispatch(setIsDesktop(overMobile));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [overMobile]);

  return (
    <>
      <Helmet>
        {currentScheme ? <title>{currentScheme.name}</title> : null}
      </Helmet>
      {schemeLoading || carMakeLoading || fontLoading || !currentScheme ? (
        <ScreenLoader />
      ) : (
        <Box width="100%" height="100%" display="flex" flexDirection="column">
          <KeyboardEventHandler handleKeys={["all"]} onKeyEvent={onKeyEvent} />
          <KeyboardEventHandler
            handleKeys={["all"]}
            handleEventType="keyup"
            onKeyEvent={onKeyEvent}
          />
          <Header
            editable={editable}
            onBack={handleGoBack}
            onDownloadTGA={handleDownloadTGA}
            onDownloadSpecTGA={handleDownloadSpecTGA}
            retrieveTGAPNGDataUrl={retrieveTGAPNGDataUrl}
          />
          <Box
            width="100%"
            height="calc(100% - 56px)"
            display="flex"
            justifyContent="space-between"
          >
            {overMobile ? (
              <SideBar
                dialog={dialog}
                setDialog={setDialog}
                editable={editable}
                hoveredLayerJSON={hoveredJSON}
                stageRef={stageRef}
                onBack={handleGoBack}
                onChangeHoverJSONItem={setHoveredJSONItem}
              />
            ) : (
              <></>
            )}
            <Box
              bgcolor="#282828"
              overflow="hidden"
              flexGrow="1"
              position="relative"
            >
              {!overMobile ? (
                <DrawerBar
                  dialog={dialog}
                  setDialog={setDialog}
                  stageRef={stageRef}
                  editable={editable}
                />
              ) : (
                <></>
              )}
              <Board
                hoveredLayerJSON={hoveredJSON}
                editable={editable}
                onChangeHoverJSONItem={setHoveredJSONItem}
                stageRef={stageRef}
                baseLayerRef={baseLayerRef}
                mainLayerRef={mainLayerRef}
                carMaskLayerRef={carMaskLayerRef}
                activeTransformerRef={activeTransformerRef}
                hoveredTransformerRef={hoveredTransformerRef}
                setTransformingLayer={setTransformingLayer}
                onDeleteLayer={onDeleteLayer}
                onCloneLayer={onCloneLayer}
              />
              <BoardGuide />
              <LegacyBanner
                show={showLegacyBanner}
                carMakeID={currentScheme.car_make}
                onDismiss={hideLegacyBanner}
              />
              <ReconnectionBanner show={!schemeSocketConnected} />
              <Toolbar
                stageRef={stageRef}
                retrieveTGAPNGDataUrl={retrieveTGAPNGDataUrl}
                requestSpecTGAPNGDataUrl={requestSpecTGAPNGDataUrl}
                onChangeBoardRotation={handleChangeBoardRotation}
              />
            </Box>
            <PropertyBar
              stageRef={stageRef}
              editable={editable}
              transformingLayer={transformingLayer}
              onCloneLayer={onCloneLayer}
              onDeleteLayer={onDeleteLayer}
            />
          </Box>
        </Box>
      )}
    </>
  );
});

const SchemeWithWrapper = withWrapper(withKeyEvent(Scheme));

export { SchemeWithWrapper as Scheme };

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import _ from "lodash";

import { Box, Typography, useMediaQuery } from "components/MaterialUI";

import { Add as AddIcon } from "@material-ui/icons";
import { AppHeader, ScreenLoader } from "components/common";
import {
  MyProjects,
  SharedProjects,
  FavoriteProjects,
  TabBar,
  FilterBar,
} from "./components";

import {
  getSchemeList,
  deleteScheme,
  cloneScheme,
  getSharedList,
  updateSharedItem,
  deleteSharedItem,
  getFavoriteList,
  deleteFavoriteItem,
  createFavoriteScheme,
  clearCurrent as clearCurrentScheme,
  clearSharedUsers,
  setLoaded as setSchemeLoaded,
  createScheme,
} from "redux/reducers/schemeReducer";
import { reset as resetLayerReducer } from "redux/reducers/layerReducer";
import { reset as resetBoardReducer } from "redux/reducers/boardReducer";
import { getCarMakeList } from "redux/reducers/carMakeReducer";
import { useGeneralSocket } from "hooks";
import { getCarPinListByUserID } from "redux/reducers/carPinReducer";
import { CreateProjectDialog } from "components/dialogs";
import { useHistory } from "react-router";
import styled from "styled-components";
import { scrollTopOnProjectList } from "helper";
import { Button } from "@material-ui/core";

export const Projects = React.memo(() => {
  const dispatch = useDispatch();
  const history = useHistory();
  const overMobile = useMediaQuery((theme) => theme.breakpoints.up("sm"));

  const user = useSelector((state) => state.authReducer.user);
  const blockedBy = useSelector((state) => state.authReducer.blockedBy);
  const blockedUsers = useSelector((state) => state.authReducer.blockedUsers);
  const carMakeList = useSelector((state) => state.carMakeReducer.list);
  const schemeList = useSelector((state) => state.schemeReducer.list);
  const sharedSchemeList = useSelector(
    (state) => state.schemeReducer.sharedList
  );
  const favoriteSchemeList = useSelector(
    (state) => state.schemeReducer.favoriteList
  );
  const carPinList = useSelector((state) => state.carPinReducer.list);

  const schemeLoading = useSelector((state) => state.schemeReducer.loading);
  const carMakeLoading = useSelector((state) => state.carMakeReducer.loading);

  const [tabValue, setTabValue] = useState(0);
  const [search, setSearch] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [hideLegacy, setHideLegacy] = useState(false);
  const [dialog, setDialog] = useState();
  const [predefinedCarMakeID, setPredefinedCarMakeID] = useState();
  const [sortBy, setSortBy] = useState(3);
  const [innerHeight, setInnerHeight] = useState(window.innerHeight);

  const [loadingSharedList, setLoadingSharedList] = useState(false);
  const [loadingFavoriteList, setLoadingFavoriteList] = useState(false);
  const legacyFilter = useMemo(() => {
    for (let scheme of schemeList) {
      if (scheme.legacy_mode) return true;
    }
    for (let favoriteScheme of favoriteSchemeList) {
      if (favoriteScheme.scheme.legacy_mode) return true;
    }
    for (let sharedScheme of sharedSchemeList) {
      if (sharedScheme.scheme.legacy_mode) return true;
    }
    return false;
  }, [schemeList, favoriteSchemeList, sharedSchemeList]);

  let sortedCarMakesList = useMemo(
    () =>
      _.orderBy(
        [...carMakeList.filter((item) => !item.is_parent && !item.deleted)],
        ["car_type", "name"],
        ["asc", "asc"]
      ),
    [carMakeList]
  );

  useGeneralSocket();

  const openScheme = useCallback(
    (schemeID) => {
      history.push(`/project/${schemeID}`);
    },
    [history]
  );

  const createSchemeFromCarMake = useCallback(
    (carMake, name) => {
      setDialog(null);
      dispatch(createScheme(carMake, name, user.id, 0, openScheme));
    },
    [dispatch, openScheme, user]
  );

  const handleCreateNew = useCallback(() => {
    setDialog("CreateProjectDialog");
  }, []);

  const hideDialog = useCallback(() => setDialog(null), []);

  useEffect(() => {
    // dispatch(setMessage({ message: null }));
    dispatch(clearCurrentScheme());
    dispatch(clearSharedUsers());
    dispatch(setSchemeLoaded(false));
    dispatch(resetLayerReducer());
    dispatch(resetBoardReducer());
    dispatch(getSchemeList(user.id));

    window.addEventListener("resize", () => {
      setInnerHeight(window.innerHeight);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      if (!schemeList.length) dispatch(getSchemeList(user.id));
      if (!carMakeList.length) dispatch(getCarMakeList());
      if (!sharedSchemeList.length) {
        setLoadingSharedList(true);
        dispatch(getSharedList(user.id, () => setLoadingSharedList(false)));
      }
      if (!favoriteSchemeList.length) {
        setLoadingFavoriteList(true);
        dispatch(getFavoriteList(user.id, () => setLoadingFavoriteList(false)));
      }
      if (!carPinList.length) {
        dispatch(getCarPinListByUserID(user.id));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    // Set Vehicle Filter based on query string
    const url = new URL(window.location.href);
    const vehiclefilter = url.searchParams.get("vehiclefilter");
    if (vehiclefilter) {
      const foundVehicle = carMakeList.find(
        (item) => item.id.toString() === vehiclefilter
      );
      if (foundVehicle) {
        setSelectedVehicle(foundVehicle);
      }
    }
  }, [carMakeList, setSelectedVehicle]);

  useEffect(() => {
    if (user) {
      const url = new URL(window.location.href);
      const makeID = url.searchParams.get("make");
      if (makeID) {
        setPredefinedCarMakeID(makeID);
        setDialog("CreateProjectDialog");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleDeleteProject = (schemeID) => {
    dispatch(deleteScheme(schemeID));
  };
  const handleCloneProject = (schemeID) => {
    dispatch(cloneScheme(schemeID));
  };
  const handleAcceptInvitation = (sharedID, callback) => {
    dispatch(
      updateSharedItem(
        sharedID,
        {
          accepted: 1,
        },
        callback
      )
    );
  };

  const handleRemoveSharedProject = (sharedID) => {
    dispatch(deleteSharedItem(sharedID));
  };

  const handleCreateFavorite = (user_id, scheme_id, callback) => {
    dispatch(
      createFavoriteScheme(
        {
          user_id,
          scheme_id,
        },
        callback
      )
    );
  };

  const handleRemoveFavorite = (favoriteID, callback) => {
    dispatch(deleteFavoriteItem(favoriteID, callback));
  };

  const handleChangeSortBy = (value) => {
    setSortBy(value);
    scrollTopOnProjectList();
  };

  const handleChangeSelectedVehicle = (value) => {
    setSelectedVehicle(value);
    scrollTopOnProjectList();
  };

  const handleChangeSearch = (value) => {
    setSearch(value);
    scrollTopOnProjectList();
  };

  const handleSetHideLegacy = (value) => {
    setHideLegacy(value);
    scrollTopOnProjectList();
  };

  return (
    <Box width="100%" height="100%" display="flex" flexDirection="column">
      <AppHeader></AppHeader>
      <Box
        width="100%"
        height={innerHeight - 56}
        display="flex"
        bgcolor="#333"
        flexDirection={overMobile ? "row" : "column-reverse"}
      >
        <TabBar
          tabValue={tabValue}
          setTabValue={setTabValue}
          onCreateNew={handleCreateNew}
        />
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="flex-start"
          my={overMobile ? 2 : 0}
          mr={2}
          py={5}
          pl={5}
          width="100%"
          height={overMobile ? "calc(100% - 16px)" : "calc(100% - 48px)"}
          position="relative"
          bgcolor="#444"
          borderRadius={overMobile ? "10px" : 0}
        >
          <FilterBar
            search={search}
            setSearch={handleChangeSearch}
            selectedVehicle={selectedVehicle}
            setSelectedVehicle={handleChangeSelectedVehicle}
            hideLegacy={hideLegacy}
            setHideLegacy={handleSetHideLegacy}
            sortBy={sortBy}
            setSortBy={handleChangeSortBy}
            legacyFilter={legacyFilter}
          />
          <Box
            id="scheme-list-content"
            overflow="auto"
            position="relative"
            pr={5}
          >
            {schemeLoading ||
            carMakeLoading ||
            loadingSharedList ||
            loadingFavoriteList ? (
              <ScreenLoader />
            ) : (
              <>
                <TabPanel
                  value={tabValue}
                  index={0}
                  title="My Projects"
                  onCreateNew={handleCreateNew}
                >
                  <MyProjects
                    user={user}
                    favoriteSchemeList={favoriteSchemeList}
                    schemeList={schemeList}
                    sortBy={sortBy}
                    search={search}
                    hideLegacy={hideLegacy}
                    selectedVehicle={selectedVehicle}
                    onDeleteProject={handleDeleteProject}
                    onCloneProject={handleCloneProject}
                    onRemoveFavorite={handleRemoveFavorite}
                    onAddFavorite={handleCreateFavorite}
                  />
                </TabPanel>
                <TabPanel
                  value={tabValue}
                  index={1}
                  title="Shared with Me"
                  onCreateNew={handleCreateNew}
                >
                  <SharedProjects
                    user={user}
                    blockedBy={blockedBy}
                    blockedUsers={blockedUsers}
                    favoriteSchemeList={favoriteSchemeList}
                    sharedSchemeList={sharedSchemeList}
                    sortBy={sortBy}
                    search={search}
                    selectedVehicle={selectedVehicle}
                    hideLegacy={hideLegacy}
                    onAccept={handleAcceptInvitation}
                    onRemove={handleRemoveSharedProject}
                    onRemoveFavorite={handleRemoveFavorite}
                    onAddFavorite={handleCreateFavorite}
                  />
                </TabPanel>
                <TabPanel
                  value={tabValue}
                  index={2}
                  title="Favorite Projects"
                  onCreateNew={handleCreateNew}
                >
                  <FavoriteProjects
                    user={user}
                    favoriteSchemeList={favoriteSchemeList}
                    sortBy={sortBy}
                    search={search}
                    selectedVehicle={selectedVehicle}
                    hideLegacy={hideLegacy}
                    onRemoveFavorite={handleRemoveFavorite}
                    onAddFavorite={handleCreateFavorite}
                  />
                </TabPanel>
              </>
            )}
          </Box>
        </Box>
      </Box>
      <CreateProjectDialog
        carMakeList={sortedCarMakesList}
        predefinedCarMakeID={predefinedCarMakeID}
        open={dialog === "CreateProjectDialog"}
        onContinue={createSchemeFromCarMake}
        onCancel={hideDialog}
      />
    </Box>
  );
});

const TabPanel = ({ children, value, index, title, onCreateNew, ...props }) => {
  const overMobile = useMediaQuery((theme) => theme.breakpoints.up("sm"));

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`projects-tabpanel-${index}`}
      aria-labelledby={`projects-tab-${index}`}
      width="100%"
      {...props}
    >
      {value === index && (
        <Box display="flex" flexDirection="column">
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={5}
          >
            <Typography variant="h2">{title}</Typography>
            {overMobile ? null : (
              <GreyButton
                onClick={onCreateNew}
                color="default"
                variant="text"
                startIcon={<AddIcon />}
              >
                <Typography variant="subtitle1"> New</Typography>
              </GreyButton>
            )}
          </Box>
          {children}
        </Box>
      )}
    </Box>
  );
};

const GreyButton = styled(Button)`
  background-color: #444;
  &:hover {
    background-color: #666;
  }
`;

export default Projects;

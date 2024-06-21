import {
  Box,
  Button,
  Theme,
  Typography,
  useMediaQuery,
} from "@material-ui/core";
import { Add as AddIcon } from "@material-ui/icons";
import { useFeatureFlag } from "configcat-react";
import _ from "lodash";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { AppHeader, ScreenLoader } from "src/components/common";
import { CreateProjectDialog } from "src/components/dialogs";
import { scrollTopOnProjectList } from "src/helper";
import { useGeneralSocket } from "src/hooks";
import { RootState } from "src/redux";
import { reset as resetBoardReducer } from "src/redux/reducers/boardReducer";
import { getCarMakeList } from "src/redux/reducers/carMakeReducer";
import { getCarPinListByUserID } from "src/redux/reducers/carPinReducer";
import { reset as resetLayerReducer } from "src/redux/reducers/layerReducer";
import {
  clearCurrent as clearCurrentScheme,
  clearSharedUsers,
  cloneScheme,
  createFavoriteScheme,
  createScheme,
  deleteFavoriteItem,
  deleteScheme,
  deleteSharedItem,
  getFavoriteList,
  getPublicSchemeList,
  getSchemeList,
  getSharedList,
  setLoaded as setSchemeLoaded,
  updateSharedItem,
} from "src/redux/reducers/schemeReducer";
import { CustomTabPanelProps } from "src/types/common";
import { ConfigCatFlags } from "src/types/enum";
import { CarMake } from "src/types/model";
import styled from "styled-components";

import {
  FavoriteProjects,
  FilterBar,
  GalleryProjects,
  MyProjects,
  SharedProjects,
  TabBar,
} from "./components";

export const Projects = React.memo(() => {
  const dispatch = useDispatch();
  const history = useHistory();
  const isAboveMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.up("sm")
  );
  const { value: enableGallery } = useFeatureFlag(
    ConfigCatFlags.ENABLE_GALLERY,
    true
  );

  const user = useSelector((state: RootState) => state.authReducer.user);
  const blockedBy = useSelector(
    (state: RootState) => state.authReducer.blockedBy
  );
  const carMakeList = useSelector(
    (state: RootState) => state.carMakeReducer.list
  );
  const schemeList = useSelector(
    (state: RootState) => state.schemeReducer.list
  );
  const schemePublicList = useSelector(
    (state: RootState) => state.schemeReducer.publicList
  );
  const sharedSchemeList = useSelector(
    (state: RootState) => state.schemeReducer.sharedList
  );
  const favoriteSchemeList = useSelector(
    (state: RootState) => state.schemeReducer.favoriteList
  );
  const carPinList = useSelector(
    (state: RootState) => state.carPinReducer.list
  );

  const schemeLoading = useSelector(
    (state: RootState) => state.schemeReducer.loading
  );
  const carMakeLoading = useSelector(
    (state: RootState) => state.carMakeReducer.loading
  );

  const [tabValue, setTabValue] = useState(0);
  const [search, setSearch] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState<CarMake | null>(null);
  const [hideLegacy, setHideLegacy] = useState(false);
  const [dialog, setDialog] = useState<string | null>();
  const [predefinedCarMakeID, setPredefinedCarMakeID] = useState<string>();
  const [sortBy, setSortBy] = useState(3);
  const [innerHeight, setInnerHeight] = useState(window.innerHeight);

  const [loadingSharedList, setLoadingSharedList] = useState(false);
  const [loadingFavoriteList, setLoadingFavoriteList] = useState(false);
  const [loadingPublicList, setLoadingPublicList] = useState(false);
  const legacyFilter = useMemo(() => {
    for (const scheme of schemeList) {
      if (scheme.legacy_mode) return true;
    }
    for (const favoriteScheme of favoriteSchemeList) {
      if (favoriteScheme.scheme.legacy_mode) return true;
    }
    for (const sharedScheme of sharedSchemeList) {
      if (sharedScheme.scheme.legacy_mode) return true;
    }
    return false;
  }, [schemeList, favoriteSchemeList, sharedSchemeList]);

  const sortedCarMakesList = useMemo(
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
      if (user)
        dispatch(createScheme(carMake, name, user.id, false, openScheme));
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
    if (user) dispatch(getSchemeList(user.id));

    window.addEventListener("resize", () => {
      setInnerHeight(window.innerHeight);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      if (!schemeList.length) dispatch(getSchemeList(user.id));
      if (!schemePublicList.length && enableGallery) {
        setLoadingPublicList(true);
        dispatch(getPublicSchemeList(() => setLoadingPublicList(false)));
      }
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

  const handleDeleteProject = (schemeID: number) => {
    dispatch(deleteScheme(schemeID));
  };
  const handleCloneProject = (schemeID: number) => {
    dispatch(cloneScheme(schemeID, openScheme));
  };
  const handleAcceptInvitation = (sharedID: number, callback?: () => void) => {
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

  const handleRemoveSharedProject = (sharedID: number) => {
    dispatch(deleteSharedItem(sharedID));
  };

  const handleCreateFavorite = (
    user_id: number,
    scheme_id: number,
    callback?: () => void
  ) => {
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

  const handleRemoveFavorite = (favoriteID: number, callback?: () => void) => {
    dispatch(deleteFavoriteItem(favoriteID, callback));
  };

  const handleChangeSortBy = (value: number) => {
    setSortBy(value);
    scrollTopOnProjectList();
  };

  const handleChangeSelectedVehicle = (value: CarMake | null) => {
    setSelectedVehicle(value);
    scrollTopOnProjectList();
  };

  const handleChangeSearch = (value: string) => {
    setSearch(value);
    scrollTopOnProjectList();
  };

  const handleSetHideLegacy = (value: boolean) => {
    setHideLegacy(value);
    scrollTopOnProjectList();
  };

  if (!user) return <></>;

  return (
    <Box width="100%" height="100%" display="flex" flexDirection="column">
      <AppHeader />
      <Box
        width="100%"
        height={innerHeight - 56}
        display="flex"
        bgcolor="#333"
        flexDirection={isAboveMobile ? "row" : "column-reverse"}
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
          my={isAboveMobile ? 2 : 0}
          mr={2}
          py={5}
          pl={5}
          width="100%"
          height={isAboveMobile ? "calc(100% - 16px)" : "calc(100% - 48px)"}
          position="relative"
          bgcolor="#444"
          borderRadius={isAboveMobile ? "10px" : 0}
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
            loadingFavoriteList ||
            loadingPublicList ? (
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
                    onDeleteProject={handleDeleteProject}
                    onCloneProject={handleCloneProject}
                  />
                </TabPanel>
                {enableGallery ? (
                  <TabPanel
                    value={tabValue}
                    index={3}
                    title="Gallery"
                    onCreateNew={handleCreateNew}
                  >
                    <GalleryProjects
                      user={user}
                      favoriteSchemeList={favoriteSchemeList}
                      schemeList={schemePublicList}
                      sortBy={sortBy}
                      search={search}
                      hideLegacy={hideLegacy}
                      selectedVehicle={selectedVehicle}
                      onCloneProject={handleCloneProject}
                      onRemoveFavorite={handleRemoveFavorite}
                      onAddFavorite={handleCreateFavorite}
                    />
                  </TabPanel>
                ) : (
                  <></>
                )}
              </>
            )}
          </Box>
        </Box>
      </Box>
      {dialog === "CreateProjectDialog" ? (
        <CreateProjectDialog
          carMakeList={sortedCarMakesList}
          predefinedCarMakeID={predefinedCarMakeID}
          open={dialog === "CreateProjectDialog"}
          onContinue={createSchemeFromCarMake}
          onCancel={hideDialog}
        />
      ) : (
        <></>
      )}
    </Box>
  );
});

type TabPanelProps = {
  title: string;
  onCreateNew: () => void;
} & CustomTabPanelProps;

const TabPanel = ({
  children,
  value,
  index,
  title,
  onCreateNew,
  ...props
}: TabPanelProps) => {
  const isAboveMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.up("sm")
  );

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`projects-tabpanel-${index}`}
      aria-labelledby={`projects-tab-${index}`}
      width="100%"
      pb={2}
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
            {isAboveMobile ? null : (
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

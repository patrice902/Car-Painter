import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Avatar,
  Box,
  CircularProgress,
  IconButton,
  LinearProgress,
  Menu,
  MenuItem,
  Theme,
  Typography,
  useMediaQuery,
} from "@material-ui/core";
import { AvatarGroup } from "@material-ui/lab";
import React, { useCallback, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import ShowroomNoCar from "src/assets/showroom_no_car.svg";
import { ImageWithLoad, LightTooltip } from "src/components/common";
import { ConfirmDialog } from "src/components/dialogs";
import config from "src/config";
import {
  getDifferenceFromToday,
  getUserName,
  reduceString,
  setScrollPostion,
} from "src/helper";
import { setPreviousPath } from "src/redux/reducers/authReducer";
import CarService from "src/services/carService";
import {
  BuilderSchemeJSONForGetListByUserId,
  UserWithoutPassword,
} from "src/types/query";

import {
  ActionIcon,
  faStarOff,
  faStarOn,
  useStyles,
} from "./ProjectItem.style";

type ProjectItemProps = {
  user: UserWithoutPassword;
  scheme: BuilderSchemeJSONForGetListByUserId;
  onDelete?: (schemeID: number) => void;
  onCloneProject?: (schemeID: number) => void;
  onAccept?: (schemeID: number) => void;
  onOpenScheme?: (schemeID: number, sharedID?: number) => void;
  onAddFavorite?: (
    userID: number,
    schemeID: number,
    callback?: () => void
  ) => void;
  onRemoveFavorite?: (favoriteID: number, callback?: () => void) => void;
  shared?: boolean;
  isFavorite?: boolean;
  accepted?: boolean;
  sharedID?: number;
  favoriteID?: number;
};

export const ProjectItem = React.memo((props: ProjectItemProps) => {
  const {
    user,
    scheme,
    onDelete,
    onCloneProject,
    onAccept,
    onOpenScheme,
    onAddFavorite,
    onRemoveFavorite,
    shared,
    isFavorite,
    accepted,
    sharedID,
    favoriteID,
  } = props;
  const dispatch = useDispatch();
  const classes = useStyles();
  const [hovered, setHovered] = useState(false);
  const [actionMenuEl, setActionMenuEl] = useState<HTMLButtonElement | null>(
    null
  );
  const [deleteMessage, setDeleteMessage] = useState<
    React.ReactElement | string
  >();
  const [favoriteInPrgoress, setFavoriteInPrgoress] = useState(false);
  const isAboveMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.up("sm")
  );
  const showActionMenu = useMemo(
    () =>
      (onCloneProject || onDelete || onAccept) && (!isAboveMobile || hovered),
    [onCloneProject, onDelete, onAccept, isAboveMobile, hovered]
  );
  const showFavoriteButton = useMemo(
    () => !isAboveMobile || hovered || isFavorite,
    [hovered, isAboveMobile, isFavorite]
  );

  const unsetDeleteMessage = useCallback(() => setDeleteMessage(undefined), []);

  const handleToggleFavorite = useCallback(() => {
    setFavoriteInPrgoress(true);
    if (isFavorite && favoriteID)
      onRemoveFavorite?.(favoriteID, () => setFavoriteInPrgoress(false));
    else
      onAddFavorite?.(user.id, scheme.id, () => setFavoriteInPrgoress(false));
  }, [
    favoriteID,
    isFavorite,
    onAddFavorite,
    onRemoveFavorite,
    scheme.id,
    user.id,
  ]);

  const handleActionMenuClose = () => {
    setActionMenuEl(null);
  };

  const handleDeleteItem = useCallback(() => {
    if (shared && sharedID) {
      onDelete?.(sharedID);
    } else {
      onDelete?.(scheme.id);
    }
    handleActionMenuClose();
  }, [onDelete, scheme.id, shared, sharedID]);

  const handleCloneProject = useCallback(() => {
    onCloneProject?.(scheme.id);
    handleActionMenuClose();
  }, [onCloneProject, scheme.id]);

  const handleAccept = useCallback(() => {
    if (sharedID) onAccept?.(sharedID);
    handleActionMenuClose();
  }, [onAccept, sharedID]);

  const handleDelete = useCallback(async () => {
    handleActionMenuClose();
    setDeleteMessage(
      <>
        Are you sure you want to{" "}
        {!shared ? "delete" : !accepted ? "reject" : "remove"} &quot;
        {scheme.name}&quot;?
        <LinearProgress color="secondary" style={{ margin: "10px 0" }} />
      </>
    );
    let hasPrimaryRace = false;
    if (!shared) {
      const carRaces = [];
      const stampedCarResult = await CarService.getCarRace(scheme.id, 0);
      if (stampedCarResult.status) {
        carRaces.push(stampedCarResult.output);
      }
      const customCarResult = await CarService.getCarRace(scheme.id, 1);
      if (customCarResult.status) {
        carRaces.push(customCarResult.output);
      }
      hasPrimaryRace = carRaces.some((car) => car.primary);
    }
    setDeleteMessage(
      <>
        Are you sure you want to{" "}
        {!shared ? "delete" : !accepted ? "reject" : "remove"} &quot;
        {scheme.name}&quot;?
        {hasPrimaryRace && (
          <>
            <br />
            This project is associated with an active paint for your{" "}
            {scheme.carMake.name}. <br />
            If you delete this project, you won’t be able to make changes.
          </>
        )}
      </>
    );
    handleActionMenuClose();
  }, [accepted, scheme, shared]);

  const handleOpenScheme = useCallback(() => {
    const scrollPosition = document.getElementById("scheme-list-content")
      ?.scrollTop;

    dispatch(setPreviousPath(window.location.pathname));
    if (scrollPosition)
      setScrollPostion(window.location.pathname, scrollPosition);
    onOpenScheme?.(scheme.id, sharedID);
    return false;
  }, [dispatch, onOpenScheme, scheme, sharedID]);

  const schemeThumbnailURL = useCallback(
    (id) => `${config.assetsURL}/scheme_thumbnails/${id}.jpg`,
    []
  );

  const legacySchemeThumbnailURL = useCallback(
    (id) => `${config.legacyAssetURL}/thumbnails/${id}.jpg`,
    []
  );

  return (
    <Box
      display="flex"
      flexDirection="column"
      border="1px solid grey"
      position="relative"
      height="100%"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <a href={`/project/${scheme.id}`} onClick={handleOpenScheme}>
        <ImageWithLoad
          src={schemeThumbnailURL(scheme.id) + "?date=" + scheme.date_modified}
          altSrc={legacySchemeThumbnailURL(scheme.id)}
          fallbackSrc={ShowroomNoCar}
          minHeight="200px"
          alt={scheme.name}
          cursorPointer
        />
      </a>
      <Box display="flex" justifyContent="space-between">
        <Box
          display="flex"
          flexDirection="column"
          flexGrow={1}
          p={4}
          overflow="hidden"
        >
          {scheme.legacy_mode ? (
            <Box
              bgcolor="#FF0833"
              color="white"
              p="0px 5px"
              mb={1}
              width="52px"
            >
              <LightTooltip
                title="This project was created with an old version of Paint Builder."
                arrow
              >
                <Typography variant="caption">LEGACY</Typography>
              </LightTooltip>
            </Box>
          ) : (
            <></>
          )}
          <Box mb={1}>
            <Typography
              component="a"
              variant="subtitle1"
              className={classes.breakableTypography}
              noWrap
              href={`/project/${scheme.id}`}
              onClick={handleOpenScheme}
            >
              {reduceString(scheme.name, 50)}
            </Typography>
          </Box>
          {scheme.user && scheme.user.id !== user.id ? (
            <Typography variant="body2" noWrap>
              Owner: {getUserName(scheme.user)}
            </Typography>
          ) : (
            <></>
          )}
          <Typography variant="body2" noWrap>
            {scheme.carMake.name}
          </Typography>
          <Typography variant="body2" noWrap>
            Edited {getDifferenceFromToday(scheme.date_modified)}
          </Typography>
          {scheme.sharedUsers && scheme.sharedUsers.length ? (
            <Box pt={2}>
              <AvatarGroup max={5}>
                {scheme.sharedUsers.map((sharedUser, index) => (
                  <LightTooltip
                    title={"Shared with " + getUserName(sharedUser.user)}
                    arrow
                    key={index}
                  >
                    <Avatar
                      alt={getUserName(sharedUser.user)}
                      src={`https://www.tradingpaints.com/scripts/image_driver.php?driver=${sharedUser.user_id}`}
                    >
                      {sharedUser.user.drivername[0].toUpperCase()}
                    </Avatar>
                  </LightTooltip>
                ))}
              </AvatarGroup>
            </Box>
          ) : (
            <></>
          )}
        </Box>

        <Box display="flex" alignItems="center">
          {favoriteInPrgoress ? (
            <CircularProgress size={30} />
          ) : (
            <>
              {showFavoriteButton ? (
                <IconButton onClick={handleToggleFavorite}>
                  {isFavorite ? (
                    <FontAwesomeIcon icon={faStarOn} size="sm" />
                  ) : (
                    <FontAwesomeIcon icon={faStarOff} size="sm" />
                  )}
                </IconButton>
              ) : (
                <></>
              )}
            </>
          )}
          {showActionMenu && (
            <>
              <IconButton
                aria-haspopup="true"
                aria-controls={`action-menu-${scheme.id}`}
                onClick={(event) => setActionMenuEl(event.currentTarget)}
              >
                <ActionIcon />
              </IconButton>
              <Menu
                id={`action-menu-${scheme.id}`}
                elevation={0}
                getContentAnchorEl={null}
                anchorEl={actionMenuEl}
                keepMounted
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                open={Boolean(actionMenuEl)}
                onClose={handleActionMenuClose}
              >
                {onCloneProject && (
                  <MenuItem onClick={handleCloneProject}>Clone</MenuItem>
                )}

                {onAccept && <MenuItem onClick={handleAccept}>Accept</MenuItem>}

                {onDelete && (
                  <MenuItem onClick={handleDelete}>
                    {shared && !accepted
                      ? "Reject"
                      : shared && accepted
                      ? "Remove"
                      : "Delete"}
                  </MenuItem>
                )}
              </Menu>
            </>
          )}
        </Box>
      </Box>
      <ConfirmDialog
        text={deleteMessage}
        open={!!deleteMessage}
        onCancel={unsetDeleteMessage}
        onConfirm={handleDeleteItem}
      />
    </Box>
  );
});

export default ProjectItem;

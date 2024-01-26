import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Box,
  IconButton,
  ImageListItemBar,
  Menu,
  MenuItem,
  Typography,
} from "@material-ui/core";
import { MoreVert } from "@material-ui/icons";
import React, { useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ImageWithLoad, LightTooltip } from "src/components/common";
import {
  getNameFromUploadFileName,
  getUserName,
  stopPropagation,
  uploadAssetURL,
} from "src/helper";
import { RootState } from "src/redux";
import {
  createFavoriteUpload,
  deleteFavoriteUploadItem,
} from "src/redux/reducers/uploadReducer";
import { BuilderUpload, BuilderUploadWithUser } from "src/types/model";

import { faStarOff, faStarOn } from "./UploadDialog.style";

type UploadItemContentProps = {
  uploadItem: BuilderUploadWithUser;
  onShareCode: (uploadId: number) => void;
  onDelete: (upload: BuilderUploadWithUser) => void;
};

export const getUploadItemId = (uploadItem: BuilderUpload) =>
  `upload-${uploadItem.id}`;

export const UploadItemContent = React.memo(
  ({ uploadItem, onShareCode, onDelete }: UploadItemContentProps) => {
    const dispatch = useDispatch();

    const user = useSelector((state: RootState) => state.authReducer.user);
    const favoriteUploadList = useSelector(
      (state: RootState) => state.uploadReducer.favoriteUploadList
    );
    const [actionMenuEl, setActionMenuEl] = useState<HTMLButtonElement | null>(
      null
    );

    const isFavorite = useMemo(
      () => favoriteUploadList.some((fav) => fav.upload_id === uploadItem.id),
      [favoriteUploadList, uploadItem]
    );

    const handleClickAddFavorite = useCallback(
      (event, upload: BuilderUpload) => {
        stopPropagation(event);

        if (!user) return;

        dispatch(
          createFavoriteUpload({ upload_id: upload.id, user_id: user.id })
        );
      },
      [dispatch, user]
    );

    const handleClickRemoveFavorite = useCallback(
      (event, upload: BuilderUpload) => {
        stopPropagation(event);

        const favoriteUploadItem = favoriteUploadList.find(
          (item) => item.upload_id === upload.id
        );

        if (!favoriteUploadItem) return;

        dispatch(deleteFavoriteUploadItem(favoriteUploadItem.id));
      },
      [dispatch, favoriteUploadList]
    );

    const handleOpenActionMenu = useCallback((event) => {
      stopPropagation(event);

      setActionMenuEl(event.currentTarget);
    }, []);

    const handleClickDeleteUpload = useCallback(
      (event, uploadItem: BuilderUploadWithUser) => {
        stopPropagation(event);

        onDelete(uploadItem);

        setActionMenuEl(null);
      },
      [onDelete]
    );
    const handleOpenShareCode = useCallback(
      (event, id: number) => {
        stopPropagation(event);

        onShareCode(id);
        setActionMenuEl(null);
      },
      [onShareCode]
    );

    const handleCloseMenu = useCallback((event) => {
      stopPropagation(event);

      setActionMenuEl(null);
    }, []);

    return (
      <>
        <ImageWithLoad
          id={getUploadItemId(uploadItem)}
          src={uploadAssetURL(uploadItem)}
          alt={getNameFromUploadFileName(
            uploadItem.file_name,
            uploadItem.user_id
          )}
          alignItems="center"
          height="100%"
          maxHeight="250px"
        />
        <ImageListItemBar
          title={
            <>
              <LightTooltip
                title={getNameFromUploadFileName(
                  uploadItem.file_name,
                  uploadItem.user_id
                )}
                arrow
              >
                <Typography>
                  {getNameFromUploadFileName(
                    uploadItem.file_name,
                    uploadItem.user_id
                  )}
                </Typography>
              </LightTooltip>
              {uploadItem.user_id !== user?.id && (
                <Typography variant="body2">
                  From {getUserName(uploadItem.user) ?? ""}
                </Typography>
              )}
            </>
          }
          actionIcon={
            <Box display="flex" alignItems="center">
              <IconButton
                color="secondary"
                onClick={(event) =>
                  isFavorite
                    ? handleClickRemoveFavorite(event, uploadItem)
                    : handleClickAddFavorite(event, uploadItem)
                }
              >
                <FontAwesomeIcon
                  icon={isFavorite ? faStarOn : faStarOff}
                  size="sm"
                />
              </IconButton>
              <IconButton aria-haspopup="true" onClick={handleOpenActionMenu}>
                <MoreVert />
              </IconButton>
              <Menu
                anchorEl={actionMenuEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                open={Boolean(actionMenuEl)}
                onClose={handleCloseMenu}
              >
                <MenuItem
                  onClick={(event) => handleOpenShareCode(event, uploadItem.id)}
                >
                  Share Code
                </MenuItem>
                <MenuItem
                  onClick={(event) =>
                    handleClickDeleteUpload(event, uploadItem)
                  }
                >
                  Delete
                </MenuItem>
              </Menu>
            </Box>
          }
        />
      </>
    );
  }
);

export default UploadItemContent;
